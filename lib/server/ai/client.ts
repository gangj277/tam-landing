import { z } from "zod";

import { env } from "@/lib/server/env";
import { ApiError } from "@/lib/server/utils/http";

export function extractJsonPayload(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("No JSON object found in model response");
}

export async function callOpenRouter<T>({
  schema,
  schemaName,
  systemPrompt,
  userPrompt,
}: {
  schema: z.ZodSchema<T>;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<T> {
  let lastError: unknown = null;
  const jsonSchema = z.toJSONSchema(schema);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENROUTER_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: schemaName,
              strict: true,
              schema: jsonSchema,
            },
          },
          temperature: 1.0,
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500 && attempt < 3) {
          lastError = new ApiError(response.status, "OPENROUTER_ERROR", errorText);
          continue;
        }
        throw new ApiError(response.status, "OPENROUTER_ERROR", errorText);
      }

      const payload = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) {
        throw new ApiError(502, "OPENROUTER_EMPTY_RESPONSE", "OpenRouter returned an empty response");
      }

      const parsedJson = JSON.parse(extractJsonPayload(content));
      return schema.parse(parsedJson);
    } catch (error) {
      lastError = error;

      if (error instanceof ApiError && error.code === "OPENROUTER_ERROR" && error.status < 500) {
        throw error;
      }

      if (error instanceof ApiError && error.code === "OPENROUTER_EMPTY_RESPONSE" && attempt >= 3) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError") &&
        attempt >= 3
      ) {
        throw new ApiError(504, "OPENROUTER_TIMEOUT", "OpenRouter request timed out");
      }

      if (attempt >= 3) {
        throw new ApiError(
          502,
          "OPENROUTER_INVALID_RESPONSE",
          error instanceof Error ? error.message : "OpenRouter returned invalid JSON",
        );
      }
    }
  }

  throw new ApiError(
    502,
    "OPENROUTER_INVALID_RESPONSE",
    lastError instanceof Error ? lastError.message : "OpenRouter failed to return valid JSON",
  );
}

export function callOpenRouterStream({
  schema,
  schemaName,
  systemPrompt,
  userPrompt,
}: {
  schema: z.ZodSchema;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}): ReadableStream<Uint8Array> {
  const jsonSchema = z.toJSONSchema(schema);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: env.OPENROUTER_MODEL,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: { name: schemaName, strict: true, schema: jsonSchema },
            },
            temperature: 1.0,
          }),
          signal: AbortSignal.timeout(60_000),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text();
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: errorText })}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const chunk = JSON.parse(data);
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                // Send raw token to client
                controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ t: delta })}\n\n`));
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }

        // Parse the complete accumulated JSON
        try {
          const parsed = JSON.parse(extractJsonPayload(accumulated));
          const validated = schema.parse(parsed);
          controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify(validated)}\n\n`));
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: e instanceof Error ? e.message : "Parse error" })}\n\n`));
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: e instanceof Error ? e.message : "Stream error" })}\n\n`));
      }

      controller.close();
    },
  });
}
