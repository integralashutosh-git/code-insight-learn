import { createFileRoute } from "@tanstack/react-router";
import { Award, NotebookPen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CONCEPTS, CONCEPT_ORDER } from "@/lib/concepts";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — CodeInsight" },
      {
        name: "description",
        content:
          "Your learning level, completed concepts, certificates and saved AI revision notes.",
      },
      { property: "og:title", content: "Your Profile — CodeInsight" },
      {
        property: "og:description",
        content: "Learning level, completed concepts, certificates and saved notes on CodeInsight.",
      },
    ],
  }),
  component: ProfilePage,
});

const CERTIFICATES = [
  { name: "Java Fundamentals", date: "Mar 2026" },
  { name: "Control Flow Mastery", date: "May 2026" },
  { name: "Arrays & Strings", date: "Jul 2026" },
];

const NOTES = [
  {
    title: "Variable",
    body: "A variable is a named memory location used to store data.",
  },
  {
    title: "For loop",
    body: "A for loop runs a block a known number of times using an initialiser, a condition and an update.",
  },
  {
    title: "Array index",
    body: "Array indexing starts at 0, so the last element is at length - 1.",
  },
];

function ProfilePage() {
  const completed = CONCEPT_ORDER.filter((key) => CONCEPTS[key].progress >= 60);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <Avatar className="size-20">
          <AvatarFallback className="gradient-primary text-2xl font-semibold text-primary-foreground">
            AK
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Ashutosh Kumar</h1>
          <p className="text-sm text-muted-foreground">Learning Java, Python and C++</p>
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <Badge className="rounded-full">Level 4 — Intermediate</Badge>
            <Badge variant="secondary" className="rounded-full">
              12 day streak
            </Badge>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <p className="pb-1.5 text-xs text-muted-foreground">Level progress</p>
          <Progress value={68} className="h-2" />
        </div>
      </div>

      <div className="grid gap-4 pt-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-sm font-semibold">Completed Concepts</h2>
          <div className="flex flex-wrap gap-2 pt-4">
            {completed.map((key) => (
              <Badge key={key} variant="secondary" className="rounded-full">
                {key}
              </Badge>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-sm font-semibold">Certificates</h2>
          <ul className="space-y-3 pt-4">
            {CERTIFICATES.map((cert) => (
              <li key={cert.name} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Award className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <NotebookPen className="size-4 text-primary" /> Saved Notes
        </h2>
        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {NOTES.map((note) => (
            <div key={note.title} className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold">{note.title}</h3>
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{note.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}