import transport from "../config/mailer.config";
import { CourseErro } from "../errors/errors";

interface IMailerService {
  from: string;
  to: string;
  subject: string;
  text: string;
}

class MailerService {
  sendMail = (mailOptions: IMailerService) => {
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        throw new CourseErro(400, "Erro ao enviar email");

      }
    });
  };
}

export default new MailerService();
