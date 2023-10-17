const Joi = require("joi");

const options = {
	stripUnknown: true,
	abortEarly: false,
	errors: {
		wrap: {
			label: ""
		}
	}
};

const validateTaskDetails = (taskDetails) => {
	const schema = Joi.object({
		title: Joi.string().min(4).max(50).required(),
		description: Joi.string().min(4).max(1000).required(),
	});
	return schema.validate(taskDetails, options);
};

const validateTaskUpdate = (taskDetails) => {
	const schema = Joi.object({
		title: Joi.string().min(4).max(50).optional(),
		description: Joi.string().min(4).max(1000).optional(),
		status: Joi.string().valid("pending", "completed").optional()
	});
  
	return schema.validate(taskDetails);
};
  

module.exports = {
	validateTaskDetails, validateTaskUpdate
};