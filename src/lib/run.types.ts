import type { ConceptKey } from "./concepts";

export interface RunResult {
  status: "success" | "error";
  output: string;
  errorMessage: string;
  errorLine: number | null;
  explanation: string;
  solution: string;
  fixedCode: string;
  concepts: ConceptKey[];
}
