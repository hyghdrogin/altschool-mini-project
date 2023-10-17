const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./database/index.js");
const router = require("./routes/index.js");
const logger = require("./utils/logger.js");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(morgan("combined"));

app.use("/", router);

app.get("/", (req, res) => {
	res.clearCookie("token");
	res.render("homepage");
});

app.use((req, res) => res.status(404).render("404"));

app.use((err, req, res) => {
	logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, async() => {
	await db.connect();
	console.info(`Server is running on port: ${port}`);
});