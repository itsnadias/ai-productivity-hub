import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { OutputPanel } from "@/components/output-panel";
import { PageHeader } from "@/components/page-header";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritized daily or weekly schedule with time blocks and productivity tips. Editable and copy-ready.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritized daily and weekly schedules with time blocks and productivity tips.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("09:00-17:00");
  const [horizon, setHorizon] = useState("daily");
  const { output, setOutput, isLoading, run, regenerate, canRegenerate } = useGenerate("planner");
  const { record } = useSession();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tasks.trim()) {
      toast.error("Add some tasks", { description: "List one task per line to build a plan." });
      return;
    }
    const ok = await run({ tasks, hours, horizon });
    if (ok) record("planner", `${horizon === "weekly" ? "Weekly" : "Daily"} plan`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner"
        description="Drop in your tasks — get a prioritized schedule with time blocks and productivity tips."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>One task per line. Add deadlines or effort if you know them.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tasks">Tasks</Label>
                <Textarea
                  id="tasks"
                  value={tasks}
                  onChange={(event) => setTasks(event.target.value)}
                  placeholder={"Finish client proposal (due tomorrow, ~3h)\nReview 4 pull requests\nPrep Thursday board deck\nCall supplier about invoice"}
                  className="min-h-72 resize-y"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hours">Working hours</Label>
                  <Input
                    id="hours"
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                    placeholder="09:00-17:00"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Plan for</Label>
                  <ToggleGroup
                    type="single"
                    value={horizon}
                    onValueChange={(value) => value && setHorizon(value)}
                    variant="outline"
                    className="w-full"
                  >
                    <ToggleGroupItem value="daily" className="flex-1">
                      Day
                    </ToggleGroupItem>
                    <ToggleGroupItem value="weekly" className="flex-1">
                      Week
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                {isLoading ? "Planning…" : "Build my plan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <OutputPanel
          value={output}
          onChange={setOutput}
          isLoading={isLoading}
          canRegenerate={canRegenerate}
          onRegenerate={regenerate}
          emptyHint="Your prioritized schedule will appear here, ready to edit and copy."
        />
      </div>

      <AiDisclaimer />
    </div>
  );
}
