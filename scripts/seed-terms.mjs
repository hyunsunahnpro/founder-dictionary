import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CSV = path.resolve(
  process.cwd(),
  "data",
  "terms-sheet-500.csv",
);

const filePath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : DEFAULT_CSV;

const parseCsv = (content) => {
  const rows = [];
  let current = "";
  let inQuotes = false;
  let row = [];

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
};

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toDate = (value) => {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const parseRelated = (value) =>
  value
    ? value
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => slugify(item))
    : [];

const run = async () => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const [headerRow, ...dataRows] = parseCsv(content);

  if (!headerRow) {
    throw new Error("CSV header row not found.");
  }

  const headers = headerRow.map((value) => value.trim());
  const indexOf = (key) => headers.indexOf(key);

  const getValue = (row, key) => {
    const index = indexOf(key);
    return index >= 0 ? row[index] ?? "" : "";
  };

  const terms = dataRows
    .map((row) => {
      const term = getValue(row, "term").trim();
      const slug = getValue(row, "slug").trim() || slugify(term);
      if (!term || !slug) return null;

      return {
        slug,
        term,
        category: getValue(row, "category").trim() || "General",
        definition: getValue(row, "definition").trim(),
        example: getValue(row, "example").trim(),
        context: getValue(row, "context").trim(),
        updatedAt: toDate(getValue(row, "updatedAt").trim()),
        relatedTerms: parseRelated(getValue(row, "relatedTerms")),
      };
    })
    .filter(Boolean);

  for (const item of terms) {
    await prisma.term.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        term: item.term,
        category: item.category,
        definition: item.definition,
        example: item.example,
        context: item.context,
        updatedAt: item.updatedAt,
      },
      update: {
        term: item.term,
        category: item.category,
        definition: item.definition,
        example: item.example,
        context: item.context,
        updatedAt: item.updatedAt,
      },
    });
  }

  const storedTerms = await prisma.term.findMany({
    select: { id: true, slug: true },
  });
  const termBySlug = new Map(storedTerms.map((item) => [item.slug, item.id]));

  const relations = [];
  for (const item of terms) {
    const fromId = termBySlug.get(item.slug);
    if (!fromId) continue;

    for (const relatedSlug of item.relatedTerms) {
      if (relatedSlug === item.slug) continue;
      const toId = termBySlug.get(relatedSlug);
      if (!toId) continue;
      relations.push({ fromTermId: fromId, toTermId: toId });
    }
  }

  if (relations.length) {
    await prisma.relatedTerm.createMany({
      data: relations,
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${terms.length} terms from ${path.basename(filePath)}.`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
