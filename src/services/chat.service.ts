import { Context } from "hono";
import { routeMessage } from "../agents/router.agent";
import { supportAgent } from "../agents/support.agent";
import { orderAgent } from "../agents/order.agent";
import { billingAgent } from "../agents/billing.agent";
import {
  createConversation,
  addMessage,
  getConversationHistory,
} from "../tools/conversation.tool";

export async function handleChatMessage(c: Context, body: any) {
  const message = body.message as string;
  let conversationId = body.conversationId as string | undefined;

  // Ensure conversation exists
  if (!conversationId) {
    const convo = await createConversation();
    conversationId = convo.id;
  }

  // Save user message
  await addMessage(conversationId, "USER", message);

  // Fetch history for context
  const history = await getConversationHistory(conversationId);
  const agentType = routeMessage(message);

  let result;

  switch (agentType) {
    case "ORDER":
      result = orderAgent(message, history);
      break;
    case "BILLING":
      result = billingAgent(message, history);
      break;
    default:
      result = supportAgent(message, history);
  }

  // Hard assert: agents MUST return streaming output
  if (!result || !result.stream || !result.text) {
    throw new Error("Agent did not return a streaming response");
  }

  const { stream, text } = result;

  // Persist assistant response after streaming completes
  text.then(async (fullText: string) => {
    await addMessage(conversationId!, "ASSISTANT", fullText);
  });

  const encoder = new TextEncoder();

  // ✅ Node-correct: AsyncIterable<string> → ReadableStream<Uint8Array>
  const byteStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream as AsyncIterable<string>) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return c.body(byteStream, 200, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Conversation-Id": conversationId,
  });
}
