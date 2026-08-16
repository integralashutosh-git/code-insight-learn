import { useState } from "react";
import { Clock, PlayCircle, Sparkles, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CONCEPTS, type ConceptKey } from "@/lib/concepts";
import type { AnalysisResult } from "@/lib/analysis.types";
import { findLectures, thumbnailUrl, watchUrl } from "@/lib/videoLibrary";
import type { LanguageKey } from "@/lib/languages";

interface Props {
  analysis: AnalysisResult | null;
  language: LanguageKey;
  isAnalyzing: boolean;
  error: string | null;
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-xl gradient-primary text-primary-foreground">
        <Youtube className="size-8 opacity-90" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-video w-full rounded-xl object-cover"
    />
  );
}

export function LearningPanel({ analysis, language, isAnalyzing, error }: Props) {
  const [openConcept, setOpenConcept] = useState<ConceptKey | null>(null);
  const concepts = analysis?.concepts ?? [];
  const { best, related } = findLectures(language, concepts);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <section>
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Detected Concepts
          </h2>
          {isAnalyzing ? (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Sparkles className="size-3 animate-pulse" /> analysing
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
        ) : concepts.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {isAnalyzing ? (
              <>
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Start typing code — concepts appear here automatically.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept) => (
              <button
                key={concept}
                type="button"
                onClick={() => setOpenConcept(concept)}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {concept}
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Best YouTube Lecture
        </h2>
        {best ? (
          <article className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft">
            <Thumb src={thumbnailUrl(best)} alt={best.title} />
            <h3 className="pt-3 text-sm font-semibold leading-snug">
              {best.concept} — {best.creator}
            </h3>
            <p className="pt-1 text-xs text-muted-foreground">{best.title}</p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {best.duration}
              </span>
              <Badge variant="secondary" className="rounded-full font-mono">
                {best.start} → {best.end}
              </Badge>
            </div>
            <p className="pt-2 text-xs text-muted-foreground">{best.summary}</p>
            <Button asChild size="sm" className="mt-3 w-full rounded-xl">
              <a href={watchUrl(best)} target="_blank" rel="noreferrer">
                <PlayCircle className="size-4" /> Watch Topic
              </a>
            </Button>
          </article>
        ) : (
          <Skeleton className="h-48 w-full rounded-2xl" />
        )}
      </section>

      <section>
        <h2 className="pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          More References
        </h2>
        <div className="space-y-2">
          {related.map((video) => (
            <article
              key={video.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-2"
            >
              <div className="w-24 shrink-0">
                <Thumb src={thumbnailUrl(video)} alt={video.title} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-semibold">{video.concept}</h3>
                <p className="truncate text-[11px] text-muted-foreground">{video.creator}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {video.start}
                  </span>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    {video.difficulty}
                  </Badge>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="mt-1 h-7 rounded-lg px-2 text-xs"
                >
                  <a href={watchUrl(video)} target="_blank" rel="noreferrer">
                    Watch
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          AI Notes
        </h2>
        {analysis?.notes?.length ? (
          <div className="space-y-2">
            {analysis.notes.map((note) => (
              <div key={note.title} className="rounded-xl border border-border bg-card p-3">
                <h3 className="text-xs font-semibold">{note.title}</h3>
                <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{note.body}</p>
              </div>
            ))}
          </div>
        ) : isAnalyzing ? (
          <Skeleton className="h-20 w-full rounded-xl" />
        ) : (
          <p className="text-xs text-muted-foreground">
            Notes are generated from your code as you write.
          </p>
        )}
      </section>

      <Dialog open={openConcept !== null} onOpenChange={() => setOpenConcept(null)}>
        <DialogContent className="rounded-2xl">
          {openConcept ? (
            <>
              <DialogHeader>
                <DialogTitle>{openConcept}</DialogTitle>
                <DialogDescription>{CONCEPTS[openConcept].short}</DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {CONCEPTS[openConcept].explanation}
              </p>
              <Badge variant="secondary" className="w-fit rounded-full">
                {CONCEPTS[openConcept].difficulty}
              </Badge>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}