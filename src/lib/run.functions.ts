import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runProgram } from "./run.server";

const inputSchema = z.object({
  code: z.string().min(1).max(12000),
  language: z.enum(["java", "python", "c", "cpp", "javascript"]),
});

export const runCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured");
    return runProgram(data.code, data.language, apiKey);
  });
