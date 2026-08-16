import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGE_LIST, type LanguageKey } from "@/lib/languages";

export function LanguagePicker({ onSelect }: { onSelect: (l: LanguageKey) => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center px-6 py-12">
      <div className="animate-fade-up space-y-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          <Code2 className="size-3.5 text-primary" /> Step 1 of 2
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Choose your programming language
        </h1>
        <p className="text-muted-foreground">
          Pick a language first — the editor, AI comments, run output and lecture references all
          adapt to it.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LANGUAGE_LIST.map((lang) => (
          <button
            key={lang.key}
            type="button"
            onClick={() => onSelect(lang.key)}
            className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
          >
            <p className="text-lg font-semibold group-hover:text-primary">{lang.label}</p>
            <p className="pt-1 text-xs text-muted-foreground">Main.{lang.extension}</p>
          </button>
        ))}
      </div>

      <div className="pt-6 text-center">
        <Button variant="ghost" size="sm" onClick={() => onSelect("python")}>
          Not sure? Start with Python
        </Button>
      </div>
    </div>
  );
}
