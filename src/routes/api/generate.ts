import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { buildPrompt, type ToolId } from "@/lib/prompts";

const BodySchema = z.object({
  tool: z.enum(["email", "meeting", "planner"]),
  input: z.record(z.string().max(20000)).refine((v) => Object.keys(v).length <= 12),
});

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
        const { system, prompt } = buildPrompt(parsed.tool as ToolId, parsed.input);

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system,
            prompt,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Generation failed";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
