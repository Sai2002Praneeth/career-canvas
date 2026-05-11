import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper } from "@/components/layout/container";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export — InterviewFlow" },
      { name: "description", content: "Export your AI analysis as a polished report." },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Export report</h1>
        <p className="mt-4 text-muted-foreground">
          PDF and shareable export options will live here. Coming in Phase 5.
        </p>
      </div>
    </SectionWrapper>
  );
}
