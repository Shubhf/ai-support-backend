import { streamAgentResponse } from "../ai/streaming";
import { Message } from "@prisma/client";

export function orderAgent(
  _message: string,
  history: Message[]
): { stream: AsyncIterable<string>; text: Promise<string> } {
  return streamAgentResponse(
    "You handle order-related questions.",
    history
  );
}
