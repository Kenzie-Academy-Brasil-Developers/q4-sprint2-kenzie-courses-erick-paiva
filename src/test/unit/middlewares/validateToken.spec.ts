import { validateToken } from "../../../middlewares";
import { config } from "dotenv";
import { ErrorHandler } from "../../../errors/errors";
import { NextFunction, Request, Response } from "express";

config();

describe("ValidateToken Middleware", () => {
  const mockReq: Partial<Request> = {};
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes),
  } as Partial<Response>;
  const nextFunc: NextFunction = jest.fn();

  it("should return a 400 error if the token is not provided", async () => {
    mockReq.headers = {};

    try {
      await validateToken(mockReq as Request, mockRes as Response, nextFunc);
    } catch (error) {
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Missing authorization token.",
      });
      expect(nextFunc).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    }
  });

  it("should return a 401 error if the token is invalid", async () => {
    mockReq.headers = {};
    mockReq.headers.authorization = "Bearer invalidToken";

    try {
      await validateToken(mockReq as Request, mockRes as Response, nextFunc);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorHandler);
      expect(nextFunc).not.toHaveBeenCalled();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("jwt malformed");
    }
  });
});
