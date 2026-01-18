import { streamAgentResponse } from "../ai/streaming";
import { Message } from "@prisma/client";

export function billingAgent(
  _message: string,
  history: Message[]
): { stream: AsyncIterable<string>; text: Promise<string> } {
  return streamAgentResponse(
    "You handle billing and refund questions.",
    history
  );
}
