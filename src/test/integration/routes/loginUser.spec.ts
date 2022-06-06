import { config } from "dotenv";
import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import supertest from "supertest";
import app from "../../../app";

config();

describe("Login with user", () => {
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

  it("should return 200 ok and the user token when logging in", async () => {
    const userMock = {
      firstName: "John",
      lastName: "Doe",
      email: "jhondoe@gmail.com",
      password: "1234",
    };

    await supertest(app).post("/users").send(userMock);

    const loginUser = await supertest(app).post("/login").send({
      email: userMock.email,
      password: userMock.password,
    });

    expect(loginUser.status).toBe(200);
    expect(loginUser.body.token).toBeDefined();
  });

  it("should return 401 unauthorized if credentials are incorrect", async () => {
    const userMock = {
      email: "invalidemail@gmail.com",
      password: "1234",
    };

    const loginUser = await supertest(app).post("/login").send(userMock);

    console.log(loginUser.body);
    expect(loginUser.status).toBe(401);
    expect(loginUser.body.token).not.toBeDefined();
    expect(loginUser.body.message).toBe("Invalid credentials");
  });
});
