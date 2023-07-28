import connection from "../config/db.js";
import { isEmpty } from "../helper/validation.js";
import { journal } from "../models/journal.js";

/**
 * Create user chat
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createJournal = (req, res) => {
	connection.query(journal, (err, result) => {
		err && res.status(400).json({ err: err }) && console.log(err);
		res.status(200).json({ msg: "User chat table created successfully" });
	});
};

let errorMessage = {};
/**
 * Create User chat in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const cjournal = async (req, res) => {
	const userId = req.params.id;
	const { title, content } = req.body;
	if (isEmpty(title) || isEmpty(content) || isEmpty(userId)) {
		errorMessage.error = "User title and content must be specified!";
		return res.status(400).send(errorMessage);
	}
	try {
		let data = {
			userId: userId,
			title: title,
			content: content,
		};
		let sql = `INSERT INTO journal SET ?`;
		await connection.query(sql, data, async (err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result) {
				console.log(result.insertId);
				await connection.query(
					`SELECT * FROM journal WHERE id = '${result.insertId}'`,
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

const getJournal = async (req, res) => {
	const userId = req.params.id;
	await connection.query(
		`SELECT * FROM users WHERE id = ${userId}`,
		(err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result.length) {
				connection.query(
					`SELECT * FROM journal WHERE userId = ${userId}`,
					(err, result) => {
						err && res.json({ err: err }) && console.log(err);
						if (result.length) {
							res.status(200).json({ msg: result });
						} else {
							res.status(200).json({ msg: "No chat history found" });
						}
					}
				);
			} else {
				res.status(404).json({ error: "User not found" });
			}
		}
	);
};

export { createJournal, cjournal, getJournal };
