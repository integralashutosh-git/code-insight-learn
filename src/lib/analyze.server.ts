import { CONCEPT_ORDER, isConceptKey } from "./concepts";
import type { AnalysisResult } from "./analysis.types";
import type { ConceptKey } from "./concepts";

const MODEL = "google/gemini-3-flash-preview";
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are CodeInsight, a patient programming teacher for absolute beginners.
You NEVER run, compile or execute code. You only read and explain it.
For the given source code you must:
1. Write one short beginner-friendly comment for EVERY non-empty line (1-indexed line numbers, skip blank lines).
2. Detect which programming concepts appear.
3. Write 2-4 short revision notes.
Comments must be plain sentences without comment markers, max 90 characters.`;

interface GatewayResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model response");
  return JSON.parse(raw.slice(start, end + 1));
}

export async function runAnalysis(
  code: string,
  language: string,
  apiKey: string,
): Promise<AnalysisResult> {
  const numbered = code
    .split("\n")
    .map((line, i) => `${i + 1}: ${line}`)
    .join("\n");

  const userPrompt = `Language: ${language}
Allowed concept names (use these exact strings): ${CONCEPT_ORDER.join(", ")}

Source code with line numbers:
${numbered}

Reply with JSON only, in this exact shape:
{"summary":"one sentence about what this code does","concepts":["Variables"],"comments":[{"line":1,"comment":"..."}],"notes":[{"title":"Variable","body":"A variable is a named memory location used to store data."}]}`;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("Too many requests — pause typing for a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const payload = (await res.json()) as GatewayResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error(payload.error?.message ?? "Empty AI response");

  const parsed = extractJson(content) as {
    summary?: unknown;
    concepts?: unknown;
    comments?: unknown;
    notes?: unknown;
  };

  const concepts: ConceptKey[] = Array.isArray(parsed.concepts)
    ? parsed.concepts
        .filter((c): c is string => typeof c === "string")
        .filter(isConceptKey)
    : [];

  const comments = Array.isArray(parsed.comments)
    ? parsed.comments
        .map((c) => c as { line?: unknown; comment?: unknown })
        .filter(
          (c) => typeof c.line === "number" && typeof c.comment === "string",
        )
        .map((c) => ({
          line: c.line as number,
          comment: (c.comment as string).replace(/^\s*(\/\/|#)\s*/, "").trim(),
        }))
    : [];

  const notes = Array.isArray(parsed.notes)
    ? parsed.notes
        .map((n) => n as { title?: unknown; body?: unknown })
        .filter((n) => typeof n.title === "string" && typeof n.body === "string")
        .map((n) => ({ title: n.title as string, body: n.body as string }))
    : [];

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    concepts: [...new Set(concepts)].sort(
      (a, b) => CONCEPT_ORDER.indexOf(a) - CONCEPT_ORDER.indexOf(b),
    ),
    comments,
    notes,
  };
}