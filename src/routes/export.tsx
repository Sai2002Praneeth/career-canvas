import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Copy, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { SectionWrapper } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export — InterviewFlow" },
      { name: "description", content: "Export your interview prep report." },
    ],
  }),
  component: ExportPage,
});

function buildReport(stored: NonNullable<ReturnType<typeof useAnalysis>>) {
  const { result, meta } = stored;
  const lines: string[] = [];
  lines.push(`InterviewFlow — Analysis Report`);
  lines.push(`Role: ${meta.role}  ·  Experience: ${meta.experience}`);
  lines.push("");
  lines.push(`Overall: ${result.score}/100 · ATS: ${result.atsScore}/100 · Role fit: ${result.roleFit}/100 · Hiring readiness: ${result.hiringReadiness}/100`);
  lines.push("");
  lines.push("Summary"); lines.push(result.summary); lines.push("");
  lines.push("Strengths"); result.strengths.forEach((s) => lines.push(`- ${s}`)); lines.push("");
  lines.push("Weaknesses"); result.weaknesses.forEach((s) => lines.push(`- ${s}`)); lines.push("");
  lines.push("Suggestions"); result.suggestions.forEach((s) => lines.push(`- ${s}`)); lines.push("");
  lines.push(`Matched skills: ${result.matchedSkills.join(", ") || "—"}`);
  lines.push(`Missing skills: ${result.missingSkills.join(", ") || "—"}`);
  lines.push("");
  lines.push("Interview questions");
  result.questions.forEach((q, i) =>
    lines.push(`${i + 1}. [${q.category} · ${q.difficulty}] ${q.question}`),
  );
  return lines.join("\n");
}

function ExportPage() {
  const stored = useAnalysis();

  if (!stored) {
    return (
      <SectionWrapper>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Nothing to export yet</h1>
          <p className="mt-3 text-muted-foreground">Generate an analysis first.</p>
          <Button asChild className="mt-6 rounded-lg">
            <Link to="/upload">Start analysis <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  const { result, meta } = stored;
  const report = buildReport(stored);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(report); toast.success("Report copied"); }
    catch { toast.error("Could not copy"); }
  };
  const onPrint = () => window.print();
  const onShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "InterviewFlow report", text: report }); } catch { /* cancelled */ }
    } else {
      onCopy();
    }
  };

  return (
    <SectionWrapper>
      <div className="flex flex-col gap-2 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="rounded-full">Export</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your report</h1>
          <p className="mt-2 text-muted-foreground">Copy, print to PDF, or share.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onCopy} className="rounded-lg"><Copy className="size-4" /> Copy</Button>
          <Button variant="outline" onClick={onShare} className="rounded-lg"><Share2 className="size-4" /> Share</Button>
          <Button onClick={onPrint} className="rounded-lg"><Printer className="size-4" /> Print / PDF</Button>
        </div>
      </div>

      <Card className="mt-8 rounded-2xl border-border/70 print:border-0 print:shadow-none">
        <CardContent className="p-8 sm:p-10">
          <div className="border-b border-border/70 pb-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">InterviewFlow Report</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{meta.role}</h2>
            <p className="text-sm text-muted-foreground">{meta.experience} · Generated {new Date(stored.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Overall", result.score], ["ATS", result.atsScore],
              ["Role fit", result.roleFit], ["Readiness", result.hiringReadiness],
            ].map(([label, val]) => (
              <div key={label as string} className="rounded-xl border border-border/70 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{val}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
              </div>
            ))}
          </div>

          <Section title="Summary"><p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p></Section>
          <Section title="Strengths"><BulletList items={result.strengths} /></Section>
          <Section title="Weaknesses"><BulletList items={result.weaknesses} /></Section>
          <Section title="Suggestions"><BulletList items={result.suggestions} /></Section>

          <Section title="Skills">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Matched</p>
            <p className="mt-1 text-sm">{result.matchedSkills.join(", ") || "—"}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Missing</p>
            <p className="mt-1 text-sm">{result.missingSkills.join(", ") || "—"}</p>
          </Section>

          <Section title="Interview questions">
            <ol className="space-y-3 text-sm">
              {result.questions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>
                    <span className="mr-2 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-xs capitalize text-muted-foreground">
                      {q.category} · {q.difficulty}
                    </span>
                    {q.question}
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.map((t, i) => <li key={i}>· {t}</li>)}
    </ul>
  );
}
