import { courseRepository, userRepository } from "../repositories";
import { CourseErro } from "../errors/errors";
import maillerService from "./mailler.service";
import { config } from "dotenv";
import AppDataSource from "../data-source";

config();

class signInCourseService {
  signInCourse = async (id: string, idUser: string) => {
    let course = null;
    try {
      course = await courseRepository.retrieve({ id });
    } catch (error) {
      throw new CourseErro(400, "Id inválido!");
    }

    const user = await userRepository.retrieve({ id: idUser });

    const coursesStudentsUsers = await AppDataSource.createQueryBuilder()
      .from("courses_students_users", "csu")
      .select("*")
      .where("csu.usersId = :usersId", { usersId: user.id })
      .andWhere("csu.coursesId = :coursesId", { coursesId: course.id })
      .execute();

    if (coursesStudentsUsers.length > 0) {
      throw new CourseErro(422, "Você já está inscrito neste curso.");
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into("courses_students_users")
      .values({
        coursesId: course.id,
        usersId: user.id,
      })
      .execute();

    maillerService.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: "Bem-vindo!",
      text: `Você se inscreveu no curso: ${course.courseName} !`,
    });

    if (course === null) {
      throw new CourseErro(404, "Curso não encontrado");
    }
    return course;
  };
}

export default new signInCourseService();
