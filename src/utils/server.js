const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("../routes/index.js");
const requestLogger = require("../middleware/requestLogger.js");

const createServer = () => {
	const app = express();
	app.use(express.json());
	app.set("views", path.join(__dirname, "../views"));
	app.set("view engine", "ejs");

	app.use(cors());
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(requestLogger);

	app.use("/", router);

	app.get("/", (req, res) => {
		// res.clearCookie("token");
		// res.render("homepage");
		return res.status(200).send({
			status: true,
			message: "Welcome to To do App"
		});
	});
	
	app.use((req, res) => res.status(404).json({
		status: false,
		message: "Invalid route"
	}));

	return app;
};

module.exports = createServer;