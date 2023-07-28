import express from "express";
const routes = express.Router();

import { createChat, chat, getChat } from "../controllers/chat.js";

// Defining user routes
routes.get("/create", createChat);
routes.post("/create-chat/:id", chat);
routes.get("/get-chat/:id", getChat);

export default routes;
