const express = require("express");
const { createTask, readTask, readAllTasks, updateTask, deleteTask } = require("../controllers/task.js");

const router = express.Router();

router.post("/", createTask);

router.get("/", readAllTasks);
router.get("/:taskId", readTask);

router.patch("/:taskId", updateTask);

router.delete("/:taskId", deleteTask);

module.exports = router;
