import { createFileRoute } from "@tanstack/react-router";
import { Loader2, NotebookPen, Wand2 } from "lucide-react";
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
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with decisions, action items, owners and deadlines. Editable and copy-ready.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy notes into decisions, action items, owners and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const { output, setOutput, isLoading, run, regenerate, canRegenerate } = useGenerate("meeting");
  const { record } = useSession();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (notes.trim().length < 20) {
      toast.error("Add your notes", { description: "Paste at least a few lines to summarize." });
      return;
    }
    const ok = await run({ title, notes });
    if (ok) record("meeting", `Summary — ${title.trim() || "Untitled meeting"}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste the raw notes — get discussion points, decisions, owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
            <CardDescription>Rough bullets, transcript fragments or full notes all work.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Q3 roadmap review"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={"- Priya: onboarding drop-off at step 3\n- agreed to ship new flow before launch\n- Tom to draft copy by Friday\n- budget sign-off still pending"}
                  className="min-h-[22rem] resize-y"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                {isLoading ? "Summarizing…" : "Summarize notes"}
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
          emptyHint="Your structured summary will appear here, ready to edit and share."
        />
      </div>

      <AiDisclaimer />
    </div>
  );
}
