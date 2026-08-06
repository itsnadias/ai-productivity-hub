import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Clock3, Mail, NotebookPen, Sparkles, Zap } from "lucide-react";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One dashboard for AI-written emails, meeting summaries and prioritized task plans. No account, no storage — start instantly.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant Dashboard" },
      {
        property: "og:description",
        content: "AI emails, meeting summaries and task plans in one clean workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    id: "email" as const,
    title: "Smart Email Generator",
    description:
      "Turn a purpose and a few details into a polished email in a formal, friendly or persuasive tone.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    id: "meeting" as const,
    title: "Meeting Notes Summarizer",
    description:
      "Paste raw notes and get discussion points, decisions, action items, owners and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    id: "planner" as const,
    title: "AI Task Planner",
    description:
      "Prioritize your tasks by urgency and importance, with realistic time blocks and productivity tips.",
  },
];

function Dashboard() {
  const { entries, countFor, clear } = useSession();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="bg-card-gradient rounded-2xl border border-border p-6 shadow-soft sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> No signup · nothing stored
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Do your busywork <span className="text-brand-gradient">in seconds</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Three focused AI tools for everyday workplace writing and planning. Everything you generate
          stays in this browser session only.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/email">
              <Mail className="size-4" /> Write an email
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/planner">
              <Zap className="size-4" /> Plan my day
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.to} className="shadow-soft transition-shadow hover:shadow-elevated">
            <CardHeader>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <div className="bg-brand-gradient grid size-10 shrink-0 place-items-center rounded-xl text-primary-foreground">
                  <tool.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{tool.title}</CardTitle>
                  <CardDescription>{countFor(tool.id)} generated this session</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              <Button asChild variant="secondary" className="w-full">
                <Link to={tool.to}>Open tool</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base">Session activity</CardTitle>
              <CardDescription>Cleared automatically when you close or reload the tab.</CardDescription>
            </div>
            {entries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} className="shrink-0">
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing generated yet. Pick a tool above to get started.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {entries.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5">
                    <span className="truncate text-sm">{entry.label}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {new Date(entry.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <AiDisclaimer />
      </section>
    </div>
  );
}
