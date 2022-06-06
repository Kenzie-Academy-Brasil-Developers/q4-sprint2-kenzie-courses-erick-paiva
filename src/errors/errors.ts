import { Response } from "express";

type TMessage = string | Record<string, any> | object

class ErrorHandler {
  public statusCode: number;
  public message: TMessage;

  constructor(statusCode: number, message: TMessage) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

class CourseErro {
  public statusCode: number;
  public message: TMessage;

  constructor(statusCode: number = 400, message: TMessage) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err: Error, res: Response) => {
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);

  return res.status(500).json({ message: "Internal server error." });
};

export { ErrorHandler, errorHandler, CourseErro };
