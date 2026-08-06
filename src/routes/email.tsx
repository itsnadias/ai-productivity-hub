import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional emails in formal, friendly or persuasive tones. Edit, copy and regenerate instantly — no signup required.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-written professional emails in three tones, editable and copy-ready.",
      },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("Formal");
  const { output, setOutput, isLoading, run, regenerate, canRegenerate } = useGenerate("email");
  const { record } = useSession();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!purpose.trim()) {
      toast.error("Add a purpose", { description: "Tell the AI what the email should achieve." });
      return;
    }
    const ok = await run({ purpose, details, recipient, sender, tone });
    if (ok) record("email", `${tone} email — ${purpose}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the goal and key details — get a ready-to-send email in your chosen tone."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
            <CardDescription>Only the purpose is required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  placeholder="Ask for a project deadline extension"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder="Sarah, Head of Product"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sender">Your name / role</Label>
                  <Input
                    id="sender"
                    value={sender}
                    onChange={(event) => setSender(event.target.value)}
                    placeholder="Alex, Project Lead"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="details">Key details</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Two engineers were reassigned, need 5 extra working days, new date 14 March, mitigation plan attached."
                  className="min-h-40 resize-y"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Tone</Label>
                <ToggleGroup
                  type="single"
                  value={tone}
                  onValueChange={(value) => value && setTone(value)}
                  variant="outline"
                  className="w-full"
                >
                  {tones.map((item) => (
                    <ToggleGroupItem key={item} value={item} className="flex-1">
                      {item}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                {isLoading ? "Generating…" : "Generate email"}
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
          emptyHint="Your generated email will appear here, ready to edit and copy."
        />
      </div>

      <AiDisclaimer />
    </div>
  );
}
