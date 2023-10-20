const { validateUser } = require("../validations/user.js");
const bcrypt = require("bcrypt");
const models = require("../models");
const { generateToken } = require("../utils/jwt.js");
const logger = require("../utils/logger.js");

const userRegistration = async (req, res) => {
	try {
		console.log(req.body);
		const { error, value } = validateUser(req.body);
		if(error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.User.findOne({ username: value.username });
		if(existingUser) {
			return res.status(409).send({
				status: false,
				message: "User already exist"
			});
		}
		const hashedPassword = await bcrypt.hash(value.password, 10);
		const createdUser = await models.User.create({
			firstName: value.firstName,
			lastName: value.lastName,
			username: value.username,
			password: hashedPassword
		});
		return res.status(201).json({
			status: true,
			message: "User created successfully",
			data: createdUser
		});
	} catch (error) {
		logger.error(`Error fetching tasks: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const userLogin = async (req, res) => {
	try {
		const { error, value } = validateUser(req.body);
		if(error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.User.findOne({ username: value.username });
		if(!existingUser) {
			return res.status(404).send({
				status: false,
				message: "Invalid username or password"
			});
		}
		const passwordCompare = await bcrypt.compare(value.password, existingUser.password);
		if(!passwordCompare) {
			return res.status(404).send({
				status: false,
				message: "Invalid username or password"
			});
		}
		const token = await generateToken({ id: existingUser.id, username: existingUser.username});
		const user = await models.User.findOne({ username: value.username }).select("-password");
		res.cookie("token", token, { httpOnly: true });
		return res.status(200).json({
			status: true,
			message: "User created successfully",
			data: { token, user }
		});
	} catch (error) {
		logger.error(`Error fetching tasks: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

module.exports = {
	userRegistration, userLogin
};