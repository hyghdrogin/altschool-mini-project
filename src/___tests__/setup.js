// setup.js

const supertest = require("supertest");
const db = require("../database/index.js");
const createServer = require("../utils/server.js");
const { user4 } = require("./testData/user.js");

const request = supertest(createServer());


const loginAndSetToken = async () => {
	try {
		await db.connect();
		const { body } = await request.post("/users/login").send(user4);
		// console.log("user", status);
		// console.log("body", body);
		const token = body.data.token;
		// console.log(token);
		return token;
	} catch (error) {
		console.error("Error logging in user:", error);
	}
};

// Export the shared token value
module.exports = {
	loginAndSetToken
};
