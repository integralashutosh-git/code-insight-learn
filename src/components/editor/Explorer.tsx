import { FileCode2, NotebookPen, BookmarkCheck, ChevronRight } from "lucide-react";
import { LANGUAGE_LIST, type LanguageKey } from "@/lib/languages";
import { cn } from "@/lib/utils";

export interface ExplorerFile {
  id: string;
  name: string;
  language: LanguageKey;
  code: string;
}

interface Props {
  files: ExplorerFile[];
  activeId: string;
  language: LanguageKey;
  onSelectFile: (id: string) => void;
  onSelectLanguage: (language: LanguageKey) => void;
}

const NOTES = ["Loops revision.md", "Array indexing.md"];
const SAVED = ["OOP — Apna College 03:35", "Recursion — freeCodeCamp 04:40"];

export function Explorer({
  files,
  activeId,
  language,
  onSelectFile,
  onSelectLanguage,
}: Props) {
  const groups = LANGUAGE_LIST.map((lang) => ({
    lang,
    items: files.filter((f) => f.language === lang.key),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <section>
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Explorer
        </h2>
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.lang.key}>
              <div className="flex items-center gap-1 px-1 py-1 text-xs font-medium text-muted-foreground">
                <ChevronRight className="size-3" />
                {group.lang.label} Files
              </div>
              <ul className="space-y-0.5">
                {group.items.map((file) => (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => onSelectFile(file.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                        file.id === activeId
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <FileCode2 className="size-4 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Notes
        </h2>
        <ul className="space-y-0.5">
          {NOTES.map((note) => (
            <li
              key={note}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
            >
              <NotebookPen className="size-4 shrink-0" />
              <span className="truncate">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Saved Lessons
        </h2>
        <ul className="space-y-0.5">
          {SAVED.map((lesson) => (
            <li
              key={lesson}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
            >
              <BookmarkCheck className="size-4 shrink-0" />
              <span className="truncate">{lesson}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-auto">
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Language
        </h2>
        <div className="grid grid-cols-2 gap-1.5">
          {LANGUAGE_LIST.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => onSelectLanguage(lang.key)}
              className={cn(
                "rounded-xl border px-2 py-1.5 text-xs font-medium transition-colors",
                lang.key === language
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}