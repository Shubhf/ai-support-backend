import { Hono } from "hono";
import { chatRoutes } from "./routes/chat.routes";

export const app = new Hono();

app.route("/", chatRoutes);
