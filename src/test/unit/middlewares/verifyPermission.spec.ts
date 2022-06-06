import { verifyPermission } from "../../../middlewares";
import { config } from "dotenv";
import { ErrorHandler } from "../../../errors/errors";
import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import supertest from "supertest";
import app from "../../../app";

config();

describe("Check if the user has permission", () => {
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

  const mockReq: Partial<Request> = {};
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes),
  } as Partial<Response>;
  const nextFunc: NextFunction = jest.fn();

  it("should return 401 if the user is not admin", async () => {
    const userMock = {
      firstName: "John",
      lastName: "Doe",
      email: "jhondoe@gmail.com",
      password: "1234",
    };

    mockReq.headers = {};

    const newUser = await supertest(app).post("/users").send(userMock)

    mockReq.decoded = newUser.body.id


    try {
      await verifyPermission(mockReq as Request, mockRes as Response, nextFunc);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorHandler);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("You are not allowed to access this information");
      expect(nextFunc).not.toHaveBeenCalled();
    }
  });
});
