"use server"
import { render } from "@react-email/components"
import { createTransport } from "nodemailer"
import InterviewEmail from "@/emails/interview"

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export const sendInterviewEmail = async (interview: {
    candidateName: string
    interviewUrl: string
    job: string
    organisation: string
    candidateEmail: string
}) => {
    if (!interview.candidateEmail) {
        return { success: false, error: "Email кандидата не указан" }
    }

    try {
        const email = <InterviewEmail {...interview} />
        const emailHtml = await render(email)

        const result = await sendEmail(
            interview.candidateEmail,
            "Приглашение на собеседование",
            emailHtml
        )

        if (!result.success) {
            // Возвращаем ошибку без логирования
            return result
        }

        return result
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Неизвестная ошибка при создании email"
        return { success: false, error: errorMessage }
    }
}

export const sendEmail = async (to: string, subject: string, html: string) => {
    // Проверяем наличие необходимых переменных окружения
    const hasRequiredEnvVars =
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASSWORD
    if (!hasRequiredEnvVars) {
        const errorMessage =
            "Не настроены переменные окружения для отправки email"
        return { success: false, error: errorMessage }
    }

    try {
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        })

        return { success: true, messageId: result.messageId }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Неизвестная ошибка"
        return { success: false, error: errorMessage }
    }
}
