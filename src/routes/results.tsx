import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper } from "@/components/layout/container";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — InterviewFlow" },
      { name: "description", content: "View your AI-generated resume analysis." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Results dashboard</h1>
        <p className="mt-4 text-muted-foreground">
          Your analytics dashboard will live here. Coming in Phase 4.
        </p>
      </div>
    </SectionWrapper>
  );
}
