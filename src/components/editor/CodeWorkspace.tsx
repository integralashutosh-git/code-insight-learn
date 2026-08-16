import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, FilePlus2, Play, Save, Upload, Moon, Sun, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Explorer, type ExplorerFile } from "./Explorer";
import { LearningPanel } from "./LearningPanel";
import { AnnotatedCode } from "./AnnotatedCode";
import { OutputPanel } from "./OutputPanel";
import { LanguagePicker } from "./LanguagePicker";
import { LANGUAGES, type LanguageKey } from "@/lib/languages";
import type { AnalysisResult } from "@/lib/analysis.types";
import { analyzeCode } from "@/lib/analyze.functions";
import type { RunResult } from "@/lib/run.types";
import { runCode } from "@/lib/run.functions";
import { useTheme } from "@/lib/useTheme";

function initialFiles(): ExplorerFile[] {
  return [
    { id: "java-main", name: "Main.java", language: "java", code: LANGUAGES.java.sample },
    {
      id: "python-main",
      name: "practice.py",
      language: "python",
      code: LANGUAGES.python.sample,
    },
    { id: "c-main", name: "marks.c", language: "c", code: LANGUAGES.c.sample },
    { id: "cpp-main", name: "result.cpp", language: "cpp", code: LANGUAGES.cpp.sample },
    {
      id: "js-main",
      name: "script.js",
      language: "javascript",
      code: LANGUAGES.javascript.sample,
    },
  ];
}

export function CodeWorkspace() {
  const { theme, toggle } = useTheme();
  const [files, setFiles] = useState<ExplorerFile[]>(initialFiles);
  const [activeId, setActiveId] = useState("java-main");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<LanguageKey | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [bottomTab, setBottomTab] = useState("output");
  const [stdin, setStdin] = useState("");
  const cache = useRef(new Map<string, AnalysisResult>());
  const fileInput = useRef<HTMLInputElement>(null);

  const activeFile = files.find((f) => f.id === activeId) ?? files[0]!;
  const language = activeFile.language;
  const meta = LANGUAGES[language];

  const analyze = useServerFn(analyzeCode);
  const mutation = useMutation({
    mutationFn: (input: { code: string; language: LanguageKey }) =>
      analyze({ data: input }),
  });

  const run = useServerFn(runCode);
  const runMutation = useMutation({
    mutationFn: (input: { code: string; language: LanguageKey; stdin: string }) =>
      run({ data: input }),
  });

  const handleRun = async (stdinValue = stdin) => {
    if (!activeFile.code.trim()) {
      toast.error("Write some code first");
      return;
    }
    setBottomTab("output");
    setRunError(null);
    try {
      const result = (await runMutation.mutateAsync({
        code: activeFile.code,
        language,
        stdin: stdinValue,
      })) as RunResult;
      setRunResult(result);
    } catch (err) {
      setRunResult(null);
      setRunError(err instanceof Error ? err.message : "Run failed");
    }
  };

  const submitStdinLine = (line: string) => {
    const next = stdin ? `${stdin}\n${line}` : line;
    setStdin(next);
    void handleRun(next);
  };

  const selectLanguage = (lang: LanguageKey) => {
    const target = files.find((f) => f.language === lang);
    if (target) {
      setActiveId(target.id);
    } else {
      const id = `file-${Date.now()}`;
      setFiles((prev) => [
        ...prev,
        {
          id,
          name: `Main.${LANGUAGES[lang].extension}`,
          language: lang,
          code: LANGUAGES[lang].sample,
        },
      ]);
      setActiveId(id);
    }
    setAnalysis(null);
    setRunResult(null);
    setRunError(null);
  };

  const runAnalysis = useCallback(
    async (code: string, lang: LanguageKey) => {
      const key = `${lang}::${code}`;
      const cached = cache.current.get(key);
      if (cached) {
        setAnalysis(cached);
        setError(null);
        return;
      }
      if (!code.trim()) {
        setAnalysis(null);
        return;
      }
      try {
        const result = (await mutation.mutateAsync({ code, language: lang })) as AnalysisResult;
        cache.current.set(key, result);
        setAnalysis(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "AI analysis failed");
      }
    },
    [mutation],
  );

  useEffect(() => {
    const code = activeFile.code;
    const lang = activeFile.language;
    const timer = setTimeout(() => {
      void runAnalysis(code, lang);
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile.code, activeFile.language]);

  const updateCode = (code: string) => {
    setFiles((prev) => prev.map((f) => (f.id === activeId ? { ...f, code } : f)));
  };

  const handleNewFile = () => {
    const id = `file-${Date.now()}`;
    setFiles((prev) => [
      ...prev,
      {
        id,
        name: `Untitled-${prev.length + 1}.${meta.extension}`,
        language,
        code: "",
      },
    ]);
    setActiveId(id);
    setAnalysis(null);
  };

  const handleUpload = async (file: File) => {
    const text = await file.text();
    const ext = file.name.split(".").pop()?.toLowerCase();
    const matched =
      (Object.values(LANGUAGES).find((l) => l.extension === ext)?.key as LanguageKey) ??
      language;
    const id = `file-${Date.now()}`;
    setFiles((prev) => [...prev, { id, name: file.name, language: matched, code: text }]);
    setActiveId(id);
    toast.success(`${file.name} opened`);
  };

  const handleDownload = () => {
    const blob = new Blob([annotated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const annotated = useMemo(() => {
    const byLine = new Map((analysis?.comments ?? []).map((c) => [c.line, c.comment]));
    return activeFile.code
      .split("\n")
      .map((line, index) => {
        const comment = byLine.get(index + 1);
        if (!comment) return line;
        const indent = line.match(/^\s*/)?.[0] ?? "";
        return `${indent}${meta.commentPrefix} ${comment}\n${line}`;
      })
      .join("\n");
  }, [activeFile.code, analysis, meta.commentPrefix]);

  const explorer = (
    <Explorer
      files={files}
      activeId={activeId}
      language={language}
      onSelectFile={(id) => {
        setActiveId(id);
        setAnalysis(null);
        setRunResult(null);
        setRunError(null);
      }}
      onSelectLanguage={selectLanguage}
    />
  );

  const panel = (
    <LearningPanel
      analysis={analysis}
      language={language}
      isAnalyzing={mutation.isPending}
      error={error}
    />
  );

  const center = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-3 py-2">
        <Button
          size="sm"
          className="rounded-lg"
          onClick={() => void handleRun()}
          disabled={runMutation.isPending}
        >
          <Play className="size-4" /> {runMutation.isPending ? "Running…" : "Run"}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-lg" onClick={handleNewFile}>
          <FilePlus2 className="size-4" /> New File
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg"
          onClick={() => fileInput.current?.click()}
        >
          <Upload className="size-4" /> Upload
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg"
          onClick={() => toast.success(`${activeFile.name} saved`)}
        >
          <Save className="size-4" /> Save
        </Button>
        <Button variant="ghost" size="sm" className="rounded-lg" onClick={handleDownload}>
          <Download className="size-4" /> Download
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-lg"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <input
          ref={fileInput}
          type="file"
          className="hidden"
          accept=".java,.py,.c,.cpp,.js,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="min-h-[280px] flex-1">
        <Editor
          height="100%"
          language={meta.monaco}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={activeFile.code}
          onChange={(value) => updateCode(value ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            minimap: { enabled: false },
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            tabSize: 2,
          }}
        />
      </div>

      <Tabs
        value={bottomTab}
        onValueChange={setBottomTab}
        className="flex h-[45%] min-h-[200px] flex-col border-t border-border bg-code-surface"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <TabsList className="rounded-lg">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="comments">AI comments</TabsTrigger>
          </TabsList>
          {mutation.isPending ? (
            <span className="ml-auto flex items-center gap-1 text-[11px] text-primary">
              <Sparkles className="size-3" /> reading your code…
            </span>
          ) : null}
        </div>
        <TabsContent value="output" className="min-h-0 flex-1 overflow-auto">
          <OutputPanel
            result={runResult}
            isRunning={runMutation.isPending}
            error={runError}
            language={language}
            onSubmitInput={submitStdinLine}
          />
        </TabsContent>
        <TabsContent value="input" className="min-h-0 flex-1 overflow-auto p-3">
          <p className="pb-2 text-xs text-muted-foreground">
            Type the values your program reads (one per line), then press Run.
          </p>
          <Textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder={"e.g.\n5\nAshutosh"}
            spellCheck={false}
            className="min-h-[120px] rounded-xl font-mono text-[13px]"
          />
        </TabsContent>
        <TabsContent value="comments" className="min-h-0 flex-1 overflow-auto">
          <AnnotatedCode
            code={activeFile.code}
            comments={analysis?.comments ?? []}
            commentPrefix={meta.commentPrefix}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (!chosen) {
    return (
      <LanguagePicker
        onSelect={(lang) => {
          selectLanguage(lang);
          setChosen(lang);
        }}
      />
    );
  }

  return (
    <>
      <div className="hidden h-[calc(100vh-4rem)] grid-cols-[20%_50%_30%] lg:grid">
        <aside className="min-h-0 border-r border-border bg-sidebar">{explorer}</aside>
        <main className="min-h-0">{center}</main>
        <aside className="min-h-0 border-l border-border bg-sidebar">{panel}</aside>
      </div>

      <Tabs defaultValue="editor" className="flex h-[calc(100vh-6rem)] flex-col lg:hidden">
        <TabsList className="mx-3 mt-3 grid grid-cols-3 rounded-xl">
          <TabsTrigger value="explorer">Explorer</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>
        <TabsContent value="explorer" className="min-h-0 flex-1 overflow-hidden">
          {explorer}
        </TabsContent>
        <TabsContent value="editor" className="min-h-0 flex-1 overflow-hidden">
          {center}
        </TabsContent>
        <TabsContent value="learning" className="min-h-0 flex-1 overflow-hidden">
          {panel}
        </TabsContent>
      </Tabs>
    </>
  );
}