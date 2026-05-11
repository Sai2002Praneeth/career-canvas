import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText, Sparkles, BarChart3, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/layout/container";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    icon: FileText,
    title: "Resume analysis",
    desc: "Surface strengths, gaps, and ATS compatibility issues in seconds.",
  },
  {
    icon: BarChart3,
    title: "Role-fit scoring",
    desc: "Quantified hiring readiness against the role you actually want.",
  },
  {
    icon: Sparkles,
    title: "AI interview prep",
    desc: "Technical, behavioral, and project questions tailored to your profile.",
  },
  {
    icon: Download,
    title: "Polished reports",
    desc: "Export a clean, shareable summary you can take into any interview.",
  },
];

function Index() {
  return (
    <>
      <SectionWrapper className="pb-16 pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            AI-powered interview preparation
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Land the role with a resume that actually gets read.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            InterviewFlow analyzes your resume, scores ATS compatibility, and generates
            role-specific interview questions — so you walk in prepared.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-lg">
              <Link to="/upload">
                Analyze my resume <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-lg">
              <Link to="/results">See sample report</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="rounded-2xl border-border/70 bg-card transition-colors hover:border-border"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <f.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
