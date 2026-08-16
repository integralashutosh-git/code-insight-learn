import { createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck, Clock3, Flame, Youtube, ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Learning Dashboard — CodeInsight" },
      {
        name: "description",
        content:
          "See concepts learned, videos watched, study hours, streak and your weekly progress chart.",
      },
      { property: "og:title", content: "Learning Dashboard — CodeInsight" },
      {
        property: "og:description",
        content: "Analytics for your programming learning journey, powered by CodeInsight.",
      },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { label: "Concepts Learned", value: "18", icon: BookOpenCheck },
  { label: "Videos Watched", value: "42", icon: Youtube },
  { label: "Study Hours", value: "63.5", icon: Clock3 },
  { label: "Daily Streak", value: "12 days", icon: Flame },
];

const WEEKLY = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 70 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 95 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 120 },
  { day: "Sun", minutes: 80 },
];

const STRONG = [
  { topic: "Variables", value: 92 },
  { topic: "Data Types", value: 84 },
  { topic: "If-Else", value: 78 },
];

const WEAK = [
  { topic: "Recursion", value: 21 },
  { topic: "OOP", value: 33 },
  { topic: "Nested Loops", value: 38 },
];

function TopicList({
  title,
  items,
  tone,
}: {
  title: string;
  items: { topic: string; value: number }[];
  tone: "success" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="space-y-4 pt-4">
        {items.map((item) => (
          <div key={item.topic}>
            <div className="flex items-center justify-between pb-1.5 text-sm">
              <span>{item.topic}</span>
              <span
                className={
                  tone === "success"
                    ? "text-xs font-medium text-success"
                    : "text-xs font-medium text-warning"
                }
              >
                {item.value}%
              </span>
            </div>
            <Progress value={item.value} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your learning dashboard</h1>
      <p className="pt-2 text-muted-foreground">A quick look at how your week went.</p>

      <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="size-5" />
            </span>
            <p className="pt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 pt-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="text-sm font-semibold">Weekly Progress</h2>
          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="minutes" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <Badge className="rounded-full">Recommended next</Badge>
          <h2 className="pt-4 text-xl font-semibold">Next, learn Nested Loops.</h2>
          <p className="pt-2 text-sm text-muted-foreground">
            You are confident with single loops. Nested loops unlock patterns, matrices and 2D
            arrays.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Continue learning <ArrowRight className="size-4" />
          </span>
        </div>
      </div>

      <div className="grid gap-4 pt-6 md:grid-cols-2">
        <TopicList title="Strong Topics" items={STRONG} tone="success" />
        <TopicList title="Weak Topics" items={WEAK} tone="warning" />
      </div>
    </div>
  );
}