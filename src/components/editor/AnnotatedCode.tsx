import type { LineComment } from "@/lib/analysis.types";

interface Props {
  code: string;
  comments: LineComment[];
  commentPrefix: string;
}

export function AnnotatedCode({ code, comments, commentPrefix }: Props) {
  const lines = code.split("\n");
  const byLine = new Map(comments.map((c) => [c.line, c.comment]));

  return (
    <pre className="overflow-auto p-4 font-mono text-[13px] leading-6">
      <code>
        {lines.map((line, index) => {
          const number = index + 1;
          const comment = byLine.get(number);
          const indent = line.match(/^\s*/)?.[0] ?? "";
          return (
            <span key={number} className="block">
              {comment ? (
                <span className="block text-code-comment">
                  {indent}
                  {commentPrefix} {comment}
                </span>
              ) : null}
              <span className="block text-foreground/90 whitespace-pre">
                {line === "" ? " " : line}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}