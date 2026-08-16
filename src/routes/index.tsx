import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquareCode,
  ShieldOff,
  ScanSearch,
  Youtube,
  NotebookPen,
  Languages,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeInsight — Learn Programming by Understanding Every Line" },
      {
        name: "description",
        content:
          "Write code naturally. AI comments every line, detects concepts and finds the perfect lecture timestamp instantly.",
      },
      {
        property: "og:title",
        content: "CodeInsight — Learn Programming by Understanding Every Line",
      },
      {
        property: "og:description",
        content:
          "AI-powered line-by-line code explanations, concept detection and YouTube lecture timestamps for beginners.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: MessageSquareCode,
    title: "Real-time AI Comments",
    body: "Every line receives beginner-friendly comments as you type.",
  },
  {
    icon: ShieldOff,
    title: "No Compilation Needed",
    body: "Understand code without ever running it.",
  },
  {
    icon: ScanSearch,
    title: "Concept Detection",
    body: "Automatically identifies loops, arrays, OOP and more.",
  },
  {
    icon: Youtube,
    title: "YouTube Smart References",
    body: "Find the exact lecture with the right timestamp.",
  },
  {
    icon: NotebookPen,
    title: "Personal Notes",
    body: "AI generates concise revision notes for later.",
  },
  {
    icon: Languages,
    title: "Multi-language Support",
    body: "Java, Python, C, C++ and JavaScript.",
  },
];

const PREVIEW = [
  { comment: "Store the student's marks in a variable", code: "int marks = 87;" },
  { comment: "Check whether the marks reach the pass mark", code: "if (marks >= 40) {" },
  { comment: "Show the result to the student", code: '    System.out.println("passed");' },
  { comment: null, code: "}" },
];

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-96 opacity-25 blur-3xl gradient-primary"
        />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Code Smarter. Learn Deeper.
            </span>
            <h1 className="pt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Learn Programming by <span className="text-gradient">Understanding Every Line.</span>
            </h1>
            <p className="max-w-xl pt-5 text-lg text-muted-foreground">
              Write code naturally. AI explains every line, detects concepts, and finds the perfect
              lecture instantly.
            </p>
            <div className="flex flex-wrap gap-3 pt-8">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/learn">
                  Start Learning <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/editor">Open AI Editor</Link>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up rounded-2xl border border-border bg-code-surface shadow-elegant">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-3 rounded-full bg-destructive/70" />
              <span className="size-3 rounded-full bg-warning/70" />
              <span className="size-3 rounded-full bg-success/70" />
              <span className="pl-2 font-mono text-xs text-muted-foreground">Main.java</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
              <code>
                {PREVIEW.map((line, i) => (
                  <span key={i} className="block">
                    {line.comment ? (
                      <span className="block text-code-comment">{`// ${line.comment}`}</span>
                    ) : null}
                    <span className="block text-foreground/90">{line.code}</span>
                  </span>
                ))}
                <span className="inline-block h-4 w-2 translate-y-0.5 bg-primary animate-caret" />
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Everything a beginner needs to actually understand code
        </h2>
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="pt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="pt-1 text-sm text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}