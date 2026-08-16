import type { ConceptKey } from "./concepts";

export interface LineComment {
  line: number;
  comment: string;
}

export interface AiNote {
  title: string;
  body: string;
}

export interface AnalysisResult {
  comments: LineComment[];
  concepts: ConceptKey[];
  notes: AiNote[];
  summary: string;
}