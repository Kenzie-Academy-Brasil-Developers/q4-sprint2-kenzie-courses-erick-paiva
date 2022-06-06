import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

interface MailerConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

const config: MailerConfig = {
  host: process.env.NODEMAILER_HOST,
  port: +process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASWORD,
  },
};

const transport = nodemailer.createTransport(config);

export default transport;
