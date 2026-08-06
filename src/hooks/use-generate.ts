import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import type { GenerateInput, ToolId } from "@/lib/prompts";

export function useGenerate(tool: ToolId) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastInput = useRef<GenerateInput | null>(null);

  const run = useCallback(
    async (input: GenerateInput) => {
      lastInput.current = input;
      setIsLoading(true);
      setOutput("");

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, input }),
        });

        if (!response.ok || !response.body) {
          const detail = await response.text().catch(() => "");
          if (response.status === 429) {
            toast.error("Too many requests", {
              description: "The AI service is rate limited. Please try again shortly.",
            });
          } else if (response.status === 402) {
            toast.error("AI credits exhausted", {
              description: "Add credits to your workspace to keep generating.",
            });
          } else {
            toast.error("Generation failed", {
              description: detail?.slice(0, 200) || "Please try again.",
            });
          }
          return false;
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let text = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          text += value;
          setOutput(text);
        }
        return text.trim().length > 0;
      } catch {
        toast.error("Network error", { description: "Could not reach the AI service." });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tool],
  );

  const regenerate = useCallback(async () => {
    if (!lastInput.current) return false;
    return run(lastInput.current);
  }, [run]);

  return { output, setOutput, isLoading, run, regenerate, canRegenerate: !!lastInput.current };
}
