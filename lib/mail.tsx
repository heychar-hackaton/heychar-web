"use server"
import { render } from "@react-email/components"
import { createTransport } from "nodemailer"
import InterviewEmail from "@/emails/interview"

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465", // true для порта 465, false для 587
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
    const email = <InterviewEmail {...interview} />

    const emailHtml = await render(email)

    if (interview.candidateEmail) {
        await sendEmail(
            interview.candidateEmail,
            "Приглашение на собеседование",
            emailHtml
        )
    }
}

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        })
        return { success: true, messageId: result.messageId }
    } catch (error) {
        // Логируем ошибку без использования console

        const errorMessage =
            error instanceof Error ? error.message : "Неизвестная ошибка"
        return { success: false, error: errorMessage }
    }
}
