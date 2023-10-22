const { validateTaskDetails } = require("../validations/task.js");
const models = require("../models/index.js");
const logger = require("../utils/logger.js");

const createTask = async(req, res) => {
	const { username } = req.user;

	try {
		const user = await models.User.findOne({ username });
		const { error, value } = validateTaskDetails(req.body);
		if (error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}

		const createdTask = await models.Task.create({
			title: value.title,
			description: value.description,
			user: user.id
		});

		return res.status(200).render("viewSingle", {
			task: createdTask, taskId: createdTask.id
		});
	} catch (error) {
		logger.error(`Error fetching tasks: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: error.message
		});
	}
};

const readAllTasks = async(req, res) => {
	const { username } = req.user;
	let { page, limit, status } = req.query;
	
	try {
		const user = await models.User.findOne({ username });
		page = page || 1;
		limit = limit || 10;
		
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		
		let query = { status: "pending", user: user.id };

		if (status) {
			if (status === "deleted") {
				query.status = "deleted";
			} else if (status === "completed") {
				query.status = "completed";
			}
		}

		const tasks = await models.Task.find(query)
			.limit(endIndex)
			.skip(startIndex)
			.exec();
		
		if (tasks.length < 1) {
			return res.status(204).send({
				status: true,
				message: "No content"
			});
		}
		
		const count = await models.Task.countDocuments(query);
		
		const totalPages = Math.ceil(count / limit);
		const total = tasks.length;

		return res.status(200).render("viewTask", {
			total,
			totalPages,
			currentPage: page,
			tasks
		});
	} catch (error) {
		logger.error(`Error fetching tasks: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const readTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;
    
	try {
		const user = await models.User.findOne({ username });
		const task = await models.Task.findOne({ _id: taskId, user: user.id });

		if (!task) {
			return res.status(404).json({
				status: false,
				message: "Task not found"
			});
		}

		if (task.status === "deleted") {
			return res.status(204).json({
				status: true,
				message: "No content"
			});
		}
		
		return res.status(200).render("viewSingle", {
			taskId, task
		});

	} catch (error) {
		logger.error(`Error fetching tasks: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const updateTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;

	try {
		const user = await models.User.findOne({ username });
		const task = await models.Task.findOne({ _id: taskId, user: user.id });

		if (!task) {
			return res.status(404).send({
				status: false,
				message: "Task not found"
			});
		}

		if (task.status === "deleted") {
			return res.status(204).send({
				status: true,
				message: "No content"
			});
		}

		const updateObject = {};
		if (req.body.title) updateObject.title = req.body.title;
		if (req.body.description) updateObject.description = req.body.description;
		if (req.body.status) updateObject.status = req.body.status;

		const updatedTask = await models.Task.findByIdAndUpdate(taskId, updateObject, { new: true });

		return res.status(200).json({
			status: true,
			message: "Task updated",
			data: updatedTask
		});
	} catch (error) {
		logger.error(`Error updating task: ${error.message}`);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const deleteTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;
  
	try {
		const user = await models.User.findOne({ username });
		const task = await models.Task.findOne({ _id: taskId, user: user.id });
  
		if (!task) {
			return res.status(404).send({
				status: false,
				message: "Task not found"
			});
		}
  
		if (task.status === "deleted") {
			return res.status(204).send({
				status: true,
				message: "No content"
			});
		}
  
		await models.Task.findByIdAndUpdate(taskId, { status: "deleted" }, { upsert: true });
  
		return res.status(204).json({
			status: true,
			message: "Task deleted successfully"
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
	createTask, readTask, readAllTasks, updateTask, deleteTask
};