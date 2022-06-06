import { verifiUserExistsUpdate, verifyPermission } from "../../../middlewares";
import { config } from "dotenv";
import { ErrorHandler } from "../../../errors/errors";
import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import supertest from "supertest";
import app from "../../../app";

config();

describe("Check if the user already exists", () => {
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

  const mockReq: Partial<Request> | string = {};
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes),
  } as Partial<Response>;
  const nextFunc: NextFunction = jest.fn();

  it("should return 409 if the user already exists", async () => {
    const userMock = {
      firstName: "John",
      lastName: "Doe",
      email: "jhondoe@gmail.com",
      password: "1234",
    };

    mockReq.headers = {};

    const newUser = await supertest(app).post("/users").send(userMock)

    mockReq.validated = newUser.body.email


    try {
      await verifiUserExistsUpdate(mockReq as Request, mockRes as Response, nextFunc);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorHandler);
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("User already exists");
      expect(nextFunc).not.toHaveBeenCalled();
    }
  });

  it("the next function must be called if the user does not exist", async () => {


    mockReq.headers = {};
    mockReq.validated = "newuser@gmail.com" as any | string;

    try {
      await verifiUserExistsUpdate(mockReq as Request, mockRes as Response, nextFunc);
    } catch (error) {
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(nextFunc).toHaveBeenCalled();

    }

  })
});
