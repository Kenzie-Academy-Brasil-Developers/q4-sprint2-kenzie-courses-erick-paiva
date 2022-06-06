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
      isAdm: true,
    };

    await supertest(app).post("/users").send(userMock);

    const loginUser: IUserLogin | any = await supertest(app)
      .post("/login")
      .send({
        email: userMock.email,
        password: userMock.password,
      });

    await supertest(app)
      .get("/courses")
      .set("Authorization", `Bearer ${loginUser.body.token}`);

    const newCourse = await supertest(app)
      .post("/courses")
      .send({
        courseName: "course test",
        duration: "1 month",
      })
      .set("Authorization", `Bearer ${loginUser.body.token}`);

    expect(newCourse.status).toBe(201);
    expect(newCourse.body).toHaveProperty("id");
  });

  it("should return 401 unauthorized if the user is not admin", async () => {
    const userMock = {
      firstName: "John",
      lastName: "Doe",
      email: "usernotadmin@gmail.com",
      password: "1234",
    };

    await supertest(app).post("/users").send(userMock);

    const loginUser: IUserLogin | any = await supertest(app)
      .post("/login")
      .send({
        email: userMock.email,
        password: userMock.password,
      });

    await supertest(app)
      .get("/courses")
      .set("Authorization", `Bearer ${loginUser.body.token}`);

    const newCourse = await supertest(app)
      .post("/courses")
      .send({
        courseName: "course test",
        duration: "1 month",
      })
      .set("Authorization", `Bearer ${loginUser.body.token}`);

    expect(newCourse.status).toBe(401);
    expect(newCourse.body.message).toStrictEqual(
      "You are not allowed to access this information"
    );
  });
});
