const express = require("express");
const userRouter = require("./user.js");
const taskRouter = require("./task.js");
const ejsRouter = require("./ejs.js");
const { verifyToken } = require("../middleware/authentication.js");

const router = express.Router();

router.use("/users", userRouter);
router.use("/tasks", verifyToken, taskRouter);
router.use("/api", ejsRouter);

module.exports = router;