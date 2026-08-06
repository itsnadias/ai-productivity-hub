import { Check, Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  isLoading,
  canRegenerate,
  onRegenerate,
  emptyHint,
}: {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  canRegenerate: boolean;
  onRegenerate: () => void;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed", { description: "Select the text and copy manually." });
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <CardTitle className="text-base">Result</CardTitle>
          <CardDescription>Fully editable — refine the text before you use it.</CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copy}
            disabled={!value || isLoading}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={!canRegenerate || isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {value || isLoading ? (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-[22rem] resize-y bg-background font-mono text-[13px] leading-relaxed"
            placeholder="Generating…"
          />
        ) : (
          <div className="grid min-h-[22rem] place-items-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <div className="max-w-xs">
              <Sparkles className="mx-auto size-6 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">{emptyHint}</p>
            </div>
          </div>
        )}
        {isLoading && !value && (
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Thinking…
          </p>
        )}
      </CardContent>
    </Card>
  );
}
