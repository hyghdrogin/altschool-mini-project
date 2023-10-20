/* eslint-disable no-undef */
const supertest = require("supertest");
const createServer = require("../utils/server.js");
require("dotenv").config();

const request = supertest(createServer());

describe("app.js", () => {

	describe("homepage", () => {
		it("should return 200", async() => {
			await request.get("/").expect(200);
		});
	});

	describe("given the route does not exist", () => {
		it("should return a 404", async() => {
			await request.get("/hhkk").expect(404);
		});
	});
});
