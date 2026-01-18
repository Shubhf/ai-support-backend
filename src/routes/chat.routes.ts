import { Hono } from "hono";
import { postMessage } from "../controllers/chat.controller";

export const chatRoutes = new Hono({ strict: false });

chatRoutes.post("/messages", postMessage);
