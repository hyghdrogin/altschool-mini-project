const { Schema, model }= require("mongoose");

const taskSchema = new Schema({
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	status: {
		type: String,
		enum: ["pending", "completed", "deleted"],
		default: "pending",
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
}, {
	timestamps: true
}
);

module.exports = model("Task", taskSchema);