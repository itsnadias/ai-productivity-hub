import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border bg-secondary/60 p-4 text-sm text-muted-foreground ${className ?? ""}`}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> outputs are AI-generated
        and may be inaccurate or incomplete. Review, edit and fact-check every result before sending
        or sharing it. Avoid entering confidential or personal data.
      </p>
    </div>
  );
}
