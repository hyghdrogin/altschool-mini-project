const express = require("express");
const { createTask, readTask, readAllTasks, updateTask, deleteTask, updatePrefill } = require("../controllers/task.js");

const router = express.Router();

router.get("/create", (req, res) => {
	res.render("createTask");
});

router.get("/update/:taskId", updatePrefill);

router.post("/", createTask);

router.get("/", readAllTasks);
router.get("/:taskId", readTask);

//This route should be a put or path request but due to ejs restrictions, I will be using post
router.post("/:taskId", updateTask);

//This route should be a delete request but due to ejs restrictions, I will be using get
router.get("/delete/:taskId", deleteTask);

module.exports = router;
