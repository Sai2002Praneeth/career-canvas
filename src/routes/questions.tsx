import { createFileRoute } from "@tanstack/react-router";
import { SectionWrapper } from "@/components/layout/container";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Interview Questions — InterviewFlow" },
      { name: "description", content: "AI-generated interview questions for your role." },
    ],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Interview questions</h1>
        <p className="mt-4 text-muted-foreground">
          Tailored question sets will live here. Coming in Phase 4.
        </p>
      </div>
    </SectionWrapper>
  );
}
