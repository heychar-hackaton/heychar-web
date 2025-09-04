'use server';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465', // true для порта 465, false для 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    // Логируем ошибку без использования console

    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка';
    return { success: false, error: errorMessage };
  }
};
