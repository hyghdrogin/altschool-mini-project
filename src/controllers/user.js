const { validateUser } = require("../validations/user.js");
const bcrypt = require("bcrypt");
const models = require("../models");
const { generateToken } = require("../utils/jwt.js");
const logger = require("../utils/logger.js");

const userRegistration = async (req, res) => {
	try {
		const { error, value } = validateUser(req.body);
		if(error) {
			return res.status(400).json({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.User.findOne({ username: value.username });
		if(existingUser) {
			return res.status(409).json({
				status: false,
				message: "User already exists"
			});
		}
		const hashedPassword = await bcrypt.hash(value.password, 10);
		await models.User.create({
			username: value.username,
			password: hashedPassword
		});

		return res.status(201).render("login");
	} catch (error) {
		logger.error(`Error creating user: ${error.message}`);
		return res.status(500).json({
			status: false,
			message: "Internal server error"
		});
	}
};

const userLogin = async (req, res) => {
	try {
		const { error, value } = validateUser(req.body);
		if(error) {
			return res.status(400).json({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.User.findOne({ username: value.username });
		if(!existingUser) {
			return res.status(404).json({
				status: false,
				message: "Invalid username or password"
			});
		}
		const passwordCompare = await bcrypt.compare(value.password, existingUser.password);
		if(!passwordCompare) {
			return res.status(404).json({
				status: false,
				message: "Invalid username or password"
			});
		}
		const token = await generateToken({ id: existingUser._id, username: existingUser.username});
		const user = await models.User.findOne({ username: value.username }).select("-password");
		res.cookie("token", token, { httpOnly: true });
		return res.status(200).render("dashboard", {
			user, token
		});
	} catch (error) {
		logger.error(`Error logging in user: ${error.message}`);
		return res.status(500).json({
			status: false,
			message: "Internal server error"
		});
	}
};

const logOut = async (req, res) => {
	try {
		res.clearCookie("token");
		return res.status(200).render("login");
	} catch (error) {
		logger.error(`Error logging out: ${error.message}`);
		return res.status(500).json({
			status: false,
			message: "Internal server error"
		});
	}
};

module.exports = {
	userRegistration, userLogin, logOut
};