import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CodeWorkspace = lazy(() =>
  import("@/components/editor/CodeWorkspace").then((m) => ({ default: m.CodeWorkspace })),
);

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "AI Code Editor — CodeInsight" },
      {
        name: "description",
        content:
          "Write code and watch AI add a beginner comment above every line, detect concepts and link the exact lecture timestamp.",
      },
      { property: "og:title", content: "AI Code Editor — CodeInsight" },
      {
        property: "og:description",
        content:
          "Line-by-line AI comments, concept detection and YouTube lecture timestamps — no compiling required.",
      },
    ],
  }),
  component: EditorPage,
});

function WorkspaceSkeleton() {
  return (
    <div className="grid h-[calc(100vh-4rem)] gap-3 p-3 lg:grid-cols-[20%_50%_30%]">
      <Skeleton className="hidden rounded-2xl lg:block" />
      <Skeleton className="rounded-2xl" />
      <Skeleton className="hidden rounded-2xl lg:block" />
    </div>
  );
}

function EditorPage() {
  return (
    <ClientOnly fallback={<WorkspaceSkeleton />}>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <CodeWorkspace />
      </Suspense>
    </ClientOnly>
  );
}