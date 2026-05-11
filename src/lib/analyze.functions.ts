import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const AnalysisInputSchema = z.object({
  resumeText: z.string().trim().min(50, "Paste at least 50 characters of your resume.").max(20000),
  role: z.string().trim().min(1).max(120),
  experience: z.string().trim().min(1).max(40),
});
export type AnalysisInput = z.infer<typeof AnalysisInputSchema>;

const QuestionSchema = z.object({
  question: z.string(),
  category: z.enum(["technical", "behavioral", "hr", "project", "role"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const AnalysisResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  atsScore: z.number().int().min(0).max(100),
  hiringReadiness: z.number().int().min(0).max(100),
  roleFit: z.number().int().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  suggestions: z.array(z.string()).min(1),
  missingSkills: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  questions: z.array(QuestionSchema).min(5),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

const SYSTEM_PROMPT = `You are a senior technical recruiter and resume coach. Analyze the candidate's resume against the target role.
Be precise, specific, and constructive. Always return valid JSON matching the provided schema. Generate 10-12 interview questions
balanced across technical, behavioral, hr, project, and role categories.`;

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AnalysisInputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured.");

    const userPrompt = `Target role: ${data.role}
Experience level: ${data.experience}

Resume:
"""
${data.resumeText}
"""

Return a thorough JSON analysis.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "ResumeAnalysis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: [
                "score","atsScore","hiringReadiness","roleFit","summary",
                "strengths","weaknesses","suggestions","missingSkills","matchedSkills","questions",
              ],
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                atsScore: { type: "integer", minimum: 0, maximum: 100 },
                hiringReadiness: { type: "integer", minimum: 0, maximum: 100 },
                roleFit: { type: "integer", minimum: 0, maximum: 100 },
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                suggestions: { type: "array", items: { type: "string" } },
                missingSkills: { type: "array", items: { type: "string" } },
                matchedSkills: { type: "array", items: { type: "string" } },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["question", "category", "difficulty"],
                    properties: {
                      question: { type: "string" },
                      category: { type: "string", enum: ["technical","behavioral","hr","project","role"] },
                      difficulty: { type: "string", enum: ["easy","medium","hard"] },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned malformed JSON.");
    }

    const result = AnalysisResultSchema.parse(parsed);
    return { success: true as const, data: result, meta: { role: data.role, experience: data.experience } };
  });
