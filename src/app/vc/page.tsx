import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VcDirectoryExplorer from "@/components/VcDirectoryExplorer";

export default function VCPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="VC Directory"
          title="Credible VC profiles, built for founder fit"
          description="We are building a vetted directory with stage, sector, and geography filters. Profiles prioritize sources from Forbes, Crunchbase, and Dealroom."
        />
        <VcDirectoryExplorer />
      </main>
      <SiteFooter />
    </div>
  );
}
