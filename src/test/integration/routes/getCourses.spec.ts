import { config } from "dotenv";
import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import supertest from "supertest";
import app from "../../../app";

config();

interface IUserLogin {
  token: string;
}

describe("Get courses", () => {
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

  it("should return 200 ok and an array with all courses", async () => {
    const userMock = {
      firstName: "John",
      lastName: "Doe",
      email: "jhondoe@gmail.com",
      password: "1234",
    };

    await supertest(app).post("/users").send(userMock);

    const loginUser: IUserLogin | any = await supertest(app)
      .post("/login")
      .send({
        email: userMock.email,
        password: userMock.password,
      });

    const response = await supertest(app)
      .get("/courses")
      .set("Authorization", `Bearer ${loginUser.body.token}`);

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("length");
  });

  it("must withdraw 400 if the user does not pass a token", async () => {
    const response = await supertest(app).get("/courses");
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual("Missing authorization token.");
  });
});
