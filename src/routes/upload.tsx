import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SectionWrapper } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { analyzeResume, AnalysisInputSchema } from "@/lib/analyze.functions";
import { setAnalysis } from "@/lib/analysis-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — InterviewFlow" },
      { name: "description", content: "Upload your resume to begin AI analysis." },
    ],
  }),
  component: UploadPage,
});

const ROLES = [
  "Frontend Engineer", "Backend Engineer", "Full-Stack Engineer",
  "Mobile Engineer", "Data Engineer", "Data Scientist", "ML Engineer",
  "DevOps Engineer", "Product Manager", "UX Designer",
];
const EXPERIENCE = ["Intern", "Junior (0-2 yrs)", "Mid (2-5 yrs)", "Senior (5-8 yrs)", "Staff (8+ yrs)"];

function UploadPage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeResume);
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [errors, setErrors] = useState<{ resumeText?: string; role?: string; experience?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = AnalysisInputSchema.safeParse({ resumeText, role, experience });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of (parsed.error as z.ZodError).issues) {
        const k = issue.path[0] as keyof typeof errors;
        if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await analyze({ data: parsed.data });
      setAnalysis({ result: res.data, meta: res.meta, createdAt: Date.now() });
      toast.success("Analysis ready");
      navigate({ to: "/results" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5" /> Step 1 of 3
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Upload your resume</h1>
          <p className="mt-3 text-muted-foreground">
            Paste your resume text and we'll handle the rest. Nothing is stored on our servers.
          </p>
        </div>

        <Card className="mt-10 rounded-2xl border-border/70">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="resume">Resume</Label>
                <Textarea
                  id="resume"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here…"
                  rows={12}
                  className="resize-y rounded-xl"
                  aria-invalid={!!errors.resumeText}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className={errors.resumeText ? "text-destructive" : ""}>
                    {errors.resumeText ?? "Plain text works best. Aim for 200+ words."}
                  </span>
                  <span>{resumeText.length.toLocaleString()} chars</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Target role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="rounded-xl" aria-invalid={!!errors.role}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Experience</Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger className="rounded-xl" aria-invalid={!!errors.experience}>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.experience && <p className="text-xs text-destructive">{errors.experience}</p>}
                </div>
              </div>

              <Button type="submit" size="lg" disabled={submitting} className="rounded-lg">
                {submitting ? (
                  <><Loader2 className="size-4 animate-spin" /> Analyzing…</>
                ) : (
                  <>Analyze resume <ArrowRight className="size-4" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
