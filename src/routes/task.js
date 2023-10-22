const express = require("express");
const { createTask, readTask, readAllTasks, updateTask, deleteTask } = require("../controllers/task.js");

const router = express.Router();

router.get("/create", (req, res) => {
	res.render("createTask");
});

router.get("/update", (req, res) => {
	res.render("update");
});

router.post("/", createTask);

router.get("/", readAllTasks);
router.get("/:taskId", readTask);

router.patch("/:taskId", updateTask);

router.delete("/:taskId", deleteTask);

module.exports = router;
