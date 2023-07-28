import express from "express";
const routes = express.Router();

import { createMovie, movies, getMovie } from "../controllers/movie.js";

// Defining user routes
routes.get("/create", createMovie);
routes.post("/create-movie/:id", movies);
routes.post("/get-movie/:id", getMovie);

export default routes;
