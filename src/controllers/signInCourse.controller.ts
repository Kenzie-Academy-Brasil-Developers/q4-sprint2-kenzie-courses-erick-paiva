import { Request, Response } from "express";
import signInCourseService from "../services/signInCourse.service";

class SignInCourseController {
  signInCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await signInCourseService.signInCourse(id, req.decoded.id );
      return res.status(200).json({
        message: "Email de inscrição enviado com sucesso.",
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }
  };
}

export default new SignInCourseController();
