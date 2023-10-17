const { createLogger, transports, format } = require("winston");

const logger = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple()
			)
		}),
		new transports.File({ filename: "error.log", level: "error" }),
		new transports.File({ filename: "combined.log" })
	]
});

module.exports = logger;