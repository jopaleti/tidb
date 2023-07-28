import express from "express";
import { default as userRouter } from "./routes/auth.js";
import { default as chatRouter } from "./routes/chat.js";
import { default as journalRouter } from "./routes/journal.js";
import { default as movieRouter } from "./routes/movie.js";
import bodyParser from "body-parser";
import cors from "cors";
import connection from "./config/db.js";

// Connect to TiDB
connection.connect((err, res) => {
	if (err) {
		console.error("Error connecting to TiDB:", err);
		return;
	}
	console.log("Connected to TiDB!");
});

// Initallizing app
const app = express();
// Middleware Usage
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Defining routes
app.use("/api/v1", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/journal", journalRouter);
app.use("/api/v1/movie", movieRouter);

app.listen("4000", () => {
	console.log("Server listening on http://localhost:4000");
});
