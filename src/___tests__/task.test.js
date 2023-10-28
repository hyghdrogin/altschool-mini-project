/* eslint-disable no-undef */
const supertest = require("supertest");
const mongoose = require("mongoose");
const createServer = require("../utils/server.js");
const { task1, task2, task3, task4, task5 } = require("./testData/task.js");
const { loginAndSetToken } = require("./setup.js");

const request = supertest(createServer());

describe("Task endpoint", () => {

	beforeAll( async() => {
		await mongoose.connect(process.env.DATABASE_URL);
	}, 10000);

	afterAll(async() => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	}, 10000);

	describe("Unauthentiicated Task Endpoint", () => {
		it("should return 403", async() => {
			const { status } = await request.post("/tasks/").send(task1);

			expect(status).toBe(403);
		});
	});
	describe("Task Creation", () => {
		it("should create task", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/tasks/").send(task1).set("Cookie", `token=${token}`);

			expect(status).toBe(201);
		});

		describe("Task creation with incomplete details", () => {
			it("should return 400", async() => {
				const token = await loginAndSetToken();
				await request.post("/tasks/").send(task2).expect(400).set("Cookie", `token=${token}`);
			});
		});
	});

	describe("Read Tasks", () => {
		it("should read all pending tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks/").set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
        
		it("should read all completed tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks?status=completed").set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
        
		it("should read all deleted tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks?status=deleted").set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
	});
	describe("Read a particular task", () => {
		it("should return 200", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(task3).set("Cookie", `token=${token}`);
          
			const taskId = createResponse.body.task._id;
          
			const { status } = await request.get(`/tasks/${taskId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});
    
	describe("Update a task", () => {
		it("should return 200", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(task4).set("Cookie", `token=${token}`);
          
			const taskId = createResponse.body.task._id;

			const { status } = await request.patch(`/tasks/${taskId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});
    
	describe("Delete a task", () => {
		it("should return 204", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(task5).set("Cookie", `token=${token}`);
          
			const taskId = createResponse.body.task._id;

			const { status } = await request.delete(`/tasks/${taskId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
	});
});