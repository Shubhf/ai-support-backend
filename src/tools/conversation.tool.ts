import { db } from "../db";
import { Message } from "@prisma/client";

/**
 * Creates a new empty conversation
 */
export async function createConversation() {
  return db.conversation.create({
    data: {},
  });
}

/**
 * Persists a single message in a conversation
 */
export async function addMessage(
  conversationId: string,
  role: "USER" | "ASSISTANT",
  content: string
) {
  return db.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

/**
 * Fetches full conversation history ordered by time
 */
export async function getConversationHistory(
  conversationId: string
): Promise<Message[]> {
  return db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
