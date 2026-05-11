import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper } from "@/components/layout/container";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — InterviewFlow" },
      { name: "description", content: "Upload your resume to begin AI analysis." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Upload your resume</h1>
        <p className="mt-4 text-muted-foreground">
          The upload experience will live here. Coming in Phase 2.
        </p>
      </div>
    </SectionWrapper>
  );
}
