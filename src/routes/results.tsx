import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, AlertTriangle, Sparkles, Target, ShieldCheck, TrendingUp,
} from "lucide-react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { SectionWrapper } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — InterviewFlow" },
      { name: "description", content: "Your AI-powered resume analysis dashboard." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const stored = useAnalysis();

  if (!stored) {
    return (
      <SectionWrapper>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">No analysis yet</h1>
          <p className="mt-3 text-muted-foreground">Upload your resume to see your dashboard.</p>
          <Button asChild className="mt-6 rounded-lg">
            <Link to="/upload">Start analysis <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  const { result, meta } = stored;
  const stats = [
    { label: "Overall score", value: result.score, icon: Sparkles },
    { label: "ATS score", value: result.atsScore, icon: ShieldCheck },
    { label: "Role fit", value: result.roleFit, icon: Target },
    { label: "Hiring readiness", value: result.hiringReadiness, icon: TrendingUp },
  ];
  const skillsData = [
    ...result.matchedSkills.slice(0, 6).map((s) => ({ name: s, value: 90, kind: "matched" })),
    ...result.missingSkills.slice(0, 6).map((s) => ({ name: s, value: 30, kind: "missing" })),
  ];

  return (
    <SectionWrapper>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="rounded-full">Results</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Resume analysis</h1>
          <p className="mt-2 text-muted-foreground">
            For <span className="text-foreground">{meta.role}</span> · {meta.experience}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/questions">Interview questions <ArrowUpRight className="size-4" /></Link>
          </Button>
          <Button asChild className="rounded-lg">
            <Link to="/export">Export report <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/70">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <s.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {s.value}
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-accent" style={{ width: `${s.value}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 lg:col-span-1">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Hiring readiness</p>
            <div className="mt-2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}
                  data={[{ name: "score", value: result.hiringReadiness, fill: "var(--accent)" }]}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: "var(--secondary)" }} dataKey="value" cornerRadius={12} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-32 text-center">
              <p className="text-4xl font-semibold tracking-tight">{result.hiringReadiness}</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
            <p className="mt-28 text-sm text-muted-foreground">{result.summary}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Skill coverage</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> matched</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-secondary" /> missing</span>
              </div>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} width={120} />
                  <Tooltip
                    cursor={{ fill: "var(--secondary)" }}
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {skillsData.map((d, i) => (
                      <cell key={i} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths / Weaknesses / Suggestions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-accent" />
              <h3 className="text-sm font-semibold">Strengths</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {result.strengths.map((t, i) => <li key={i}>· {t}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Weaknesses</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {result.weaknesses.map((t, i) => <li key={i}>· {t}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h3 className="text-sm font-semibold">Suggestions</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {result.suggestions.map((t, i) => <li key={i}>· {t}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skill chips */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold">Matched skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.matchedSkills.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-full px-3 py-1">{s}</Badge>
              ))}
              {result.matchedSkills.length === 0 && <p className="text-sm text-muted-foreground">No matches detected.</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold">Missing skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.missingSkills.map((s) => (
                <Badge key={s} variant="outline" className="rounded-full border-dashed px-3 py-1">{s}</Badge>
              ))}
              {result.missingSkills.length === 0 && <p className="text-sm text-muted-foreground">Nothing critical missing.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
