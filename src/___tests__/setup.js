const supertest = require("supertest");
const db = require("../database/index.js");
const createServer = require("../utils/server.js");
const { user4 } = require("./testData/user.js");

const request = supertest(createServer());


const loginAndSetToken = async () => {
	try {
		await db.connect();
		const response = await request.post("/users/login").send(user4);
		const token = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
		return token;
	} catch (error) {
		console.error("Error logging in user:", error);
	}
};


module.exports = {
	loginAndSetToken
};
