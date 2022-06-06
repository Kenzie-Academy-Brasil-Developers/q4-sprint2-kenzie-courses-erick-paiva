import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";

describe("It should be possible to create a user", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should insert the information of the new user in the database", async () => {
    const firstName = "John";
    const lastName = "Doe";
    const email = "email@mail.com";
    const password = "password";
    const isAdm = true;
    const userData = { email, firstName, lastName, password, isAdm };

    const response = await supertest(app).post("/users").send(userData);

    expect(response.body).toEqual(
      expect.objectContaining({
        email,
        firstName,
        lastName,
      })
    );
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });
});
