export type AgentType = "SUPPORT" | "ORDER" | "BILLING";

export function routeMessage(message: string): AgentType {
  const text = message.toLowerCase();

  if (text.includes("order")) return "ORDER";
  if (text.includes("refund") || text.includes("payment")) return "BILLING";

  return "SUPPORT";
}
