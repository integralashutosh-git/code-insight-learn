import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, CornerDownLeft, Lightbulb, PlayCircle, Terminal, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RunResult } from "@/lib/run.types";
import type { LanguageKey } from "@/lib/languages";
import { findLectures, thumbnailUrl, watchUrl } from "@/lib/videoLibrary";

interface Props {
  result: RunResult | null;
  isRunning: boolean;
  error: string | null;
  language: LanguageKey;
  onSubmitInput?: (value: string) => void;
}

export function OutputPanel({ result, isRunning, error, language, onSubmitInput }: Props) {
  const [value, setValue] = useState("");
  const needsInput = !!result?.needsInput;

  useEffect(() => {
    if (needsInput) setValue("");
  }, [needsInput, result?.output]);

  if (isRunning) {
    return (
      <div className="flex items-center gap-2 p-4 font-mono text-sm text-muted-foreground">
        <Terminal className="size-4 animate-pulse text-primary" /> running your program…
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-destructive">{error}</div>;
  }

  if (!result) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Press <span className="font-medium text-foreground">Run</span> to execute your program and
        see the output here.
      </div>
    );
  }

  const failed = result.status === "error";
  const { best, related } = findLectures(
    language,
    result.concepts.length ? result.concepts : [],
  );
  const videos = failed ? [best, ...related].filter(Boolean).slice(0, 3) : [];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        {failed ? (
          <>
            <AlertTriangle className="size-4 text-destructive" />
            <span className="text-destructive">Program stopped with an error</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4 text-primary" />
            <span>Program executed successfully</span>
          </>
        )}
        {result.errorLine ? (
          <Badge variant="secondary" className="ml-auto">line {result.errorLine}</Badge>
        ) : null}
      </div>

      <pre className="overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-[13px] leading-6">
        {failed
          ? result.errorMessage || "Unknown error"
          : result.output || "(no output produced)"}
      </pre>

      {needsInput && onSubmitInput ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim()) return;
            onSubmitInput(value);
          }}
        >
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={result.inputPrompts?.[0] ?? "Type your input and press Enter"}
            className="rounded-xl font-mono text-[13px]"
          />
          <Button type="submit" size="sm" className="rounded-xl">
            <CornerDownLeft className="size-4" /> Send
          </Button>
        </form>
      ) : null}

      {failed && result.explanation ? (
        <div className="rounded-xl border border-border p-3 text-sm">
          <p className="pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Why this happened
          </p>
          <p className="text-muted-foreground">{result.explanation}</p>
        </div>
      ) : null}

      {failed && result.solution ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="flex items-center gap-1.5 pb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Lightbulb className="size-3.5" /> Solution
          </p>
          <p className="whitespace-pre-wrap text-muted-foreground">{result.solution}</p>
          {result.fixedCode ? (
            <pre className="mt-2 overflow-auto rounded-lg bg-code-surface p-2 font-mono text-xs leading-5">
              {result.fixedCode}
            </pre>
          ) : null}
        </div>
      ) : null}

      {videos.length ? (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Youtube className="size-3.5 text-destructive" /> Learn this topic
          </p>
          {videos.map((video) =>
            video ? (
              <a
                key={video.id}
                href={watchUrl(video)}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-xl border border-border p-2 transition-colors hover:bg-muted"
              >
                <img
                  src={thumbnailUrl(video)}
                  alt={video.title}
                  loading="lazy"
                  className="aspect-video w-28 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 text-sm">
                  <p className="truncate font-medium">{video.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {video.creator} · {video.concept}
                  </p>
                  <p className="flex items-center gap-1 pt-1 text-xs text-primary">
                    <Clock className="size-3" /> {video.start} – {video.end}
                  </p>
                </div>
              </a>
            ) : null,
          )}
          {best ? (
            <Button asChild size="sm" className="w-full rounded-xl">
              <a href={watchUrl(best)} target="_blank" rel="noreferrer">
                <PlayCircle className="size-4" /> Watch the fix explained
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
