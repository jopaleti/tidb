import connection from "../config/db.js";
import { isEmpty } from "../helper/validation.js";
import { chats } from "../models/chat.js";
import { users } from "../models/user.js";

/**
 * Create user chat
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createChat = (req, res) => {
	connection.query(chats, (err, result) => {
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

const chat = async (req, res) => {
	const userId = req.params.id;
	const { role, content } = req.body;
	if (isEmpty(role) || isEmpty(content) || isEmpty(userId)) {
		errorMessage.error = "User role and content must be specified!";
		return res.status(400).send(errorMessage);
	}
	try {
		let data = {
			userId: userId,
			role: role,
			content: content,
		};
		let sql = `INSERT INTO chats SET ?`;
		await connection.query(sql, data, async (err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result) {
				console.log(result.insertId);
				await connection.query(
					`SELECT * FROM chats WHERE id = '${result.insertId}'`,
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

const getChat = async (req, res) => {
	const userId = req.params.id;
	await connection.query(
		`SELECT * FROM users WHERE id = ${userId}`,
		(err, result) => {
			err && res.json({ err: err }) && console.log(err);
			if (result.length) {
				connection.query(
					`SELECT * FROM chats WHERE userId = ${userId}`,
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

export { createChat, chat, getChat };
