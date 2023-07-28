import express from "express";
const routes = express.Router();

import { createUser, login, register } from "../controllers/auth.js";

// Defining user routes
routes.get('/create', createUser);
routes.post('/register', register);
routes.post('/login', login);

export default routes;