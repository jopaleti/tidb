import express from "express";
const routes = express.Router();

import { createJournal, cjournal, getJournal } from "../controllers/journal.js";

// Defining user routes
routes.get("/create", createJournal);
routes.post("/create-journal/:id", cjournal);
routes.get("/get-journal/:id", getJournal);

export default routes;
