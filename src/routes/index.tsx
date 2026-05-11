import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, FileText, Sparkles, BarChart3, Download,
  Upload, Brain, MessageSquare, CheckCircle2, ShieldCheck, Target, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, LayoutContainer } from "@/components/layout/container";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  { icon: FileText, title: "Resume analysis", desc: "Surface strengths, gaps, and ATS compatibility issues in seconds." },
  { icon: BarChart3, title: "Role-fit scoring", desc: "Quantified hiring readiness against the role you actually want." },
  { icon: Sparkles, title: "AI interview prep", desc: "Technical, behavioral, and project questions tailored to your profile." },
  { icon: Download, title: "Polished reports", desc: "Export a clean, shareable summary you can take into any interview." },
];

const workflow = [
  { icon: Upload, step: "01", title: "Upload your resume", desc: "Paste your resume text and pick your target role and experience level." },
  { icon: Brain, step: "02", title: "AI analyzes the fit", desc: "We score ATS compatibility, role fit, and surface missing skills." },
  { icon: MessageSquare, step: "03", title: "Practice with tailored questions", desc: "Get role-specific technical, behavioral, and project questions." },
  { icon: Download, step: "04", title: "Export & share", desc: "Download a clean, printable report you can take into any interview." },
];

const benefits = [
  { icon: ShieldCheck, label: "ATS compatibility scoring" },
  { icon: Target, label: "Role-specific gap analysis" },
  { icon: Zap, label: "Instant AI feedback" },
];

function Index() {
  return (
    <>
      {/* Hero */}
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
              <Link to="/upload">Analyze my resume <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-lg">
              <Link to="/results">See sample report</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            {benefits.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                <b.icon className="size-3.5 text-accent" /> {b.label}
              </span>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Features grid */}
      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="rounded-2xl border-border/70 bg-card transition-colors hover:border-border">
              <CardContent className="flex flex-col gap-4 p-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <f.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Workflow */}
      <SectionWrapper className="border-t border-border/60 pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">How it works</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">From resume to ready in four steps.</h2>
          <p className="mt-4 text-muted-foreground">A clean, focused workflow — no fluff, no friction.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((w) => (
            <div key={w.step} className="flex flex-col gap-4 bg-card p-8">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <w.icon className="size-4" />
                </span>
                <span className="text-xs font-medium tracking-widest text-muted-foreground">{w.step}</span>
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Dashboard preview */}
      <SectionWrapper className="border-t border-border/60">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">Preview</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">A dashboard that actually tells you what to fix.</h2>
          <p className="mt-4 text-muted-foreground">Quantified scores, prioritized suggestions, and questions tailored to your profile.</p>
        </div>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 bg-secondary/40 px-6 py-3 text-xs text-muted-foreground">
            interviewflow.app / results
          </div>
          <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
            {[
              { label: "ATS score", value: "86", hint: "Strong keyword density" },
              { label: "Role fit", value: "78", hint: "Senior Frontend Engineer" },
              { label: "Hiring readiness", value: "82", hint: "Above average" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/70 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}<span className="text-base font-normal text-muted-foreground">/100</span></p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
            <div className="lg:col-span-3 rounded-xl border border-border/70 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Top suggestions</p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "Quantify impact in your last two roles with measurable outcomes.",
                  "Add Kubernetes and CI/CD to your skills — appears in 80% of matching roles.",
                  "Lead with a one-line summary tailored to the target role.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="border-t border-border/60">
        <LayoutContainer className="rounded-2xl border border-border/70 bg-secondary/40 px-8 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Upload your resume and get a complete analysis in under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-lg">
              <Link to="/upload">Get started <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-lg">
              <Link to="/results">View sample</Link>
            </Button>
          </div>
        </LayoutContainer>
      </SectionWrapper>
    </>
  );
}
