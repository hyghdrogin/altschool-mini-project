const { Schema, model }= require("mongoose");

const userSchema = new Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
	}
}, {
	timestamps: true
}
);

module.exports = model("User", userSchema);