/* eslint-disable no-undef */
const supertest = require("supertest");
const mongoose = require("mongoose");
const createServer = require("../utils/server");
const { user1, user2, user3, user4, user5 } = require("./testData/user.js");


const request = supertest(createServer());

describe("User endpoint", () => {

	beforeAll( async() => {
		await mongoose.connect(process.env.DATABASE_URL);
	}, 10000);

	afterAll(async() => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	}, 10000);
	
	describe("User Registration", () => {
		it("should create user", async() => {
			const { status, body } = await request.post("/users/").send(user1);

			expect(status).toBe(201);
			expect(body).toHaveProperty("status", true);
			expect(body).toHaveProperty("message", "User created successfully");
			expect(body).toHaveProperty("data");
		});

		describe("User Registration with incomplete details", () => {
			it("should return 400", async() => {
				await request.post("/users/").send(user3).expect(400);
			});
		});
        
		describe("User Registration with existing details", () => {
			it("should return 409", async() => {
				await request.post("/users/").send(user4).expect(409);
			});
		});
	});
	describe("User Login", () => {
		it("should login user", async() => {
			const { status, body } = await request.post("/users/login").send(user4);

			expect(status).toBe(200);
			expect(body).toHaveProperty("status", true);
			expect(body).toHaveProperty("message", "User created successfully");

		});

		describe("User login with incomplete details", () => {
			it("should return 400", async() => {
				const { status} = await request.post("/users/login").send(user3);

				expect(status).toBe(400);
			});
		});
        
		describe("User login with incorrect details", () => {
			it("should return 404", async() => {
				const { status} = await request.post("/users/login").send(user2);

				expect(status).toBe(404);
			});
		});
        
		describe("User login with new details", () => {
			it("should return 404", async() => {
				const { status} = await request.post("/users/login").send(user5);

				expect(status).toBe(404);
			});
		});
	});
});