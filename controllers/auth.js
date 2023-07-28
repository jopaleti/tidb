import connection from "../config/db.js";
import { isEmpty } from "../helper/validation.js";
import { users } from "../models/user.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Create user table
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createUser = (req, res) => {
	connection.query(users, (err, result) => {
		err && res.status(400).json({ err: err }) && console.log(err);
		res.status(200).json({ msg: "User table created successfully" });
	});
};

/**
 * Create User in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const salt = bcrypt.genSaltSync(10);
const register = async (req, res) => {
	const { username, email, password, confirm_password } = req.body;
	if (
		isEmpty(username) ||
		isEmpty(email) ||
		isEmpty(password) ||
		isEmpty(confirm_password)
	) {
		errorMessage.error =
			"username, email, password, and confirm_password cannot be empty";
		return res.status(400).send(errorMessage);
	}
	if (password != confirm_password) {
		errorMessage.error = "password and confirm_password must be the same";
		return res.status(400).send(errorMessage);
	}
	try {
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		req.body.confirm_password = bcrypt.hashSync(
			req.body.confirm_password,
			salt
		);
		let user = req.body;
		console.log(user);
		let sql = "INSERT INTO users SET ?";
		connection.query(
			`SELECT * FROM users WHERE email = '${email}'`,
			(err, result) => {
				err && res.json({ err: err }) && console.log(err);
				if (result != "") {
					return res
						.status(409)
						.json({ msg: "User with that email already existed!" });
				}
				connection.query(sql, user, (err, result) => {
					err && res.json({ err: err }) && console.log(err);
					// Testing by logging out the user result
					console.log(result.insertId);
					const data = {
						id: result.insertId,
						email: email,
					};
					// console.log(data);
					res.status(200).json({ msg: "User created successfully" });
				});
				console.log(result);
			}
		);
	} catch (err) {
		console.log(err);
		res.status(400).json({ err: err });
	}
};

/**
 * User login
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const login = async (req, res) => {
	const { email, password } = req.body;
	if (isEmpty(email) || isEmpty(password)) {
		errorMessage.error =
			"username, email, password, and confirm_password cannot be empty";
		return res.status(400).send(errorMessage);
	}
	try {
		const sql = `SELECT * FROM users WHERE email = '${email}'`;
		await connection.query(sql, (err, result) => {
			err && result.status(400).json({ msg: err });
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					const isPassCorrect = bcrypt.compareSync(
						req.body.password,
						result[i].password
					);
					// Getting first_name and last_name algorithm
					const user_name = result[i].username;
					const sName = user_name.split(" ");
					const first_name = sName[0];
					const last_name = sName && sName[1] != undefined ? sName[1] : "";

					console.log(isPassCorrect);
					if (isPassCorrect) {
						const generateToken = jwt.sign(
							{
								id: result[i].id,
								name: result[i].username,
								email: result[i].email,
								date: result[i].reg_date,
							},
							process.env.JWT_SECRET,
							{ expiresIn: "3d" }
						);
						res.status(200).json({
							id: result[0].id,
							email: result[i].email,
							date: result[i].reg_date,
							first_name: first_name,
							last_name: last_name,
							accesstoken: generateToken,
						});
					} else {
						res.status(401).json({ msg: "Incorrect Password" });
					}
				}
			} else {
				res.status(404).json({ msg: "User not found" });
			}
		});
	} catch (err) {
		res.status(400).json({ err: err });
	}
};

export { createUser, register, login };
