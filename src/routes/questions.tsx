import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { SectionWrapper } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAnalysis } from "@/lib/analysis-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Interview questions — InterviewFlow" },
      { name: "description", content: "Role-specific interview questions tailored to your profile." },
    ],
  }),
  component: QuestionsPage,
});

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "technical", label: "Technical" },
  { key: "behavioral", label: "Behavioral" },
  { key: "hr", label: "HR" },
  { key: "project", label: "Project" },
  { key: "role", label: "Role" },
] as const;

function difficultyClass(d: string) {
  if (d === "easy") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (d === "hard") return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

function QuestionsPage() {
  const stored = useAnalysis();
  const [tab, setTab] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!stored) return [];
    if (tab === "all") return stored.result.questions;
    return stored.result.questions.filter((q) => q.category === tab);
  }, [stored, tab]);

  if (!stored) {
    return (
      <SectionWrapper>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">No questions yet</h1>
          <p className="mt-3 text-muted-foreground">Run an analysis to generate tailored questions.</p>
          <Button asChild className="mt-6 rounded-lg">
            <Link to="/upload">Start analysis <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="rounded-full">Practice</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Interview questions</h1>
          <p className="mt-2 text-muted-foreground">
            Tailored to {stored.meta.role} · {stored.meta.experience}
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex w-full flex-wrap gap-1 rounded-xl bg-secondary p-1">
          {CATEGORIES.map((c) => (
            <TabsTrigger
              key={c.key}
              value={c.key}
              className="rounded-lg px-3 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((q, i) => (
              <Card key={i} className="rounded-2xl border-border/70">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full text-xs capitalize">{q.category}</Badge>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", difficultyClass(q.difficulty))}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="flex items-start gap-2 text-sm text-foreground">
                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>{q.question}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No questions in this category.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </SectionWrapper>
  );
}
