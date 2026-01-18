import { Context } from "hono";
import { handleChatMessage } from "../services/chat.service";

export async function postMessage(c: Context) {
  const body = await c.req.json();
  return handleChatMessage(c, body);
}
