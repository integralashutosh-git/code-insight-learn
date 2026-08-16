import { CONCEPT_ORDER, isConceptKey } from "./concepts";
import type { ConceptKey } from "./concepts";
import type { RunResult } from "./run.types";

const MODEL = "google/gemini-3-flash-preview";
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are CodeInsight's execution engine for beginners.
You carefully trace the given program line by line and predict exactly what it prints.
If the program has a compile-time or runtime error, report the compiler-style error message,
the line number, a beginner explanation, a step-by-step solution and the corrected code.
Never invent output that the program would not produce.`;

interface GatewayResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text) as string;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model response");
  return JSON.parse(raw.slice(start, end + 1));
}

const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

export async function runProgram(
  code: string,
  language: string,
  apiKey: string,
  stdin = "",
): Promise<RunResult> {
  const numbered = code
    .split("\n")
    .map((line, i) => `${i + 1}: ${line}`)
    .join("\n");

  const userPrompt = `Language: ${language}
Allowed concept names (use these exact strings): ${CONCEPT_ORDER.join(", ")}

Program with line numbers:
${numbered}

Standard input provided by the user (consume these lines in order for any read/scan/input call):
${stdin ? stdin : "(empty)"}

Rules about input:
- If the program reads input and the standard input above is empty or has fewer values than needed,
  DO NOT treat that as a program error. Instead set "status":"success", "needsInput":true,
  "inputPrompts": the list of prompt texts the program shows for each value it still needs,
  and "output": the prompts printed so far.
- Otherwise set "needsInput":false and run the program normally with the provided values.

Reply with JSON only, in this exact shape:
{"status":"success" or "error","needsInput":true or false,"inputPrompts":["Enter a number"],"output":"exact console output, newline separated","errorMessage":"compiler/runtime error text or empty","errorLine":number or null,"explanation":"why this happens, for a beginner","solution":"how to fix it, short steps","fixedCode":"corrected full program or empty when there is no error","concepts":["Loops"]}`;

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

  if (res.status === 429) throw new Error("Too many runs — wait a few seconds and try again.");
  if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
  if (!res.ok) throw new Error(`Run failed (${res.status})`);

  const payload = (await res.json()) as GatewayResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error(payload.error?.message ?? "Empty response");

  const parsed = extractJson(content) as Record<string, unknown>;

  const concepts: ConceptKey[] = Array.isArray(parsed["concepts"])
    ? (parsed["concepts"] as unknown[])
        .filter((c): c is string => typeof c === "string")
        .filter(isConceptKey)
    : [];

  const status = parsed["status"] === "error" ? "error" : "success";
  const errorLine = parsed["errorLine"];
  const prompts = Array.isArray(parsed["inputPrompts"])
    ? (parsed["inputPrompts"] as unknown[]).filter((p): p is string => typeof p === "string")
    : [];

  return {
    status,
    needsInput: parsed["needsInput"] === true,
    inputPrompts: prompts,
    output: str(parsed["output"]),
    errorMessage: str(parsed["errorMessage"]),
    errorLine: typeof errorLine === "number" ? errorLine : null,
    explanation: str(parsed["explanation"]),
    solution: str(parsed["solution"]),
    fixedCode: str(parsed["fixedCode"]),
    concepts: [...new Set(concepts)],
  };
}
