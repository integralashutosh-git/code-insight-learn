import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CONCEPTS, CONCEPT_ORDER } from "@/lib/concepts";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Programming Concepts — CodeInsight" },
      {
        name: "description",
        content:
          "Track your progress across variables, loops, arrays, strings, functions, OOP and recursion.",
      },
      { property: "og:title", content: "Learn Programming Concepts — CodeInsight" },
      {
        property: "og:description",
        content: "A beginner path through every core programming concept, with progress tracking.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Learn by concept</h1>
      <p className="pt-2 max-w-2xl text-muted-foreground">
        Every concept CodeInsight detects in your code has a lesson, an explanation and a matching
        lecture timestamp.
      </p>

      <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPT_ORDER.map((key) => {
          const concept = CONCEPTS[key];
          const Icon = (Icons[concept.icon as keyof typeof Icons] ??
            Icons.Sparkles) as Icons.LucideIcon;
          return (
            <article
              key={key}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <Badge variant="secondary" className="rounded-full">
                  {concept.difficulty}
                </Badge>
              </div>
              <h2 className="pt-4 text-lg font-semibold">{concept.key}</h2>
              <p className="pt-1 text-sm text-muted-foreground">{concept.short}</p>
              <div className="flex items-center gap-3 pt-4">
                <Progress value={concept.progress} className="h-2" />
                <span className="text-xs font-medium text-muted-foreground">
                  {concept.progress}%
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}