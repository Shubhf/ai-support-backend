import { streamText, type ModelMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { Message } from "@prisma/client";

export function streamAgentResponse(
  systemPrompt: string,
  history: Message[]
): { stream: AsyncIterable<string>; text: Promise<string> } {
  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...history.map<ModelMessage>((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    })),
  ];

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages,
  });

  return {
    stream: result.textStream,
    text: result.text as Promise<string>,
  };
}
