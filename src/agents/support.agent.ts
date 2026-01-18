import { streamAgentResponse } from "../ai/streaming";
import { Message } from "@prisma/client";

export function supportAgent(
  _message: string,
  history: Message[]
): { stream: AsyncIterable<string>; text: Promise<string> } {
  return streamAgentResponse(
    "You are a helpful customer support agent.",
    history
  );
}
