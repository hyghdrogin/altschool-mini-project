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

const validateUser = (user) => {
	const schema = Joi.object({
		username: Joi.string().min(4).max(50).required(),
		password: Joi.string().min(4).required(),
	});
	return schema.validate(user, options);
};

module.exports = {
	validateUser
};