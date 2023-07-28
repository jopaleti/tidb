import connection from "../config/db.js";
import { isEmpty } from "../helper/validation.js";
import { movie } from "../models/movie.js";

/**
 * Create user chat
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createMovie = (req, res) => {
	connection.query(movie, (err, result) => {
		err && res.status(400).json({ err: err }) && console.log(err);
		res.status(200).json({ msg: "User movie table created successfully" });
	});
};

let errorMessage = {};
/**
 * Create User chat in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const movies = async (req, res) => {
	const userId = req.params.id;
	const { title, genre, url, actors, image, year } = req.body;
	if (
		isEmpty(title) ||
		isEmpty(genre) ||
		isEmpty(url) ||
		isEmpty(actors) ||
		isEmpty(userId)
	) {
		errorMessage.error = "User title genre, url, actors must be specified!";
		return res.status(400).send(errorMessage);
	}
	try {
		let data = {
			userId: userId,
			title: title,
			url: url,
			image: image,
			genre: genre,
			year: year,
			actors: actors,
		};
		let sql = `INSERT INTO movie SET ?`;
		await connection.query(sql, data, async (err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result) {
				console.log(result.insertId);
				await connection.query(
					`SELECT * FROM movie WHERE id = '${result.insertId}'`,
					(err, resp) => {
						err && res.json({ err: err }) && console.log(err);
						res.status(200).json({ msg: resp });
					}
				);
			}
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ err: err });
	}
};

/**
 * Get user chat history by userId
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const getMovie = async (req, res) => {
	const userId = req.params.id;
	await connection.query(
		`SELECT * FROM users WHERE id = ${userId}`,
		(err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result.length) {
				connection.query(
					`SELECT * FROM movie WHERE userId = ${userId}`,
					(err, result) => {
						err && res.json({ err: err }) && console.log(err);
						if (result.length) {
							res.status(200).json({ msg: result });
						} else {
							res.status(200).json({ msg: "No movie history found" });
						}
					}
				);
			} else {
				res.status(404).json({ error: "User not found" });
			}
		}
	);
};

export { createMovie, movies, getMovie };
