import type { ConceptKey } from "./concepts";

export interface RunResult {
  status: "success" | "error";
  needsInput: boolean;
  inputPrompts: string[];
  output: string;
  errorMessage: string;
  errorLine: number | null;
  explanation: string;
  solution: string;
  fixedCode: string;
  concepts: ConceptKey[];
}
