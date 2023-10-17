const express = require("express");

const router = express.Router();

router.get("/register", (req, res) => {
	res.render("register");
});
  
router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

router.get("/task/create", (req, res) => {
	res.render("createTask");
});

router.get("/task/update/:taskId", async (req, res) => {
	const taskId = req.params.taskId;
	res.render("update", { taskId }); 
});

module.exports = router;
