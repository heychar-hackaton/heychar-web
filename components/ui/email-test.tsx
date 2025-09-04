"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { sendEmail, verifyEmailConnection } from "@/lib/mail"

export const EmailTest = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{
        success: boolean
        message?: string
        error?: string
    } | null>(null)

    const handleTestConnection = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const connectionResult = await verifyEmailConnection()
            setResult(connectionResult)
        } catch (error) {
            setResult({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestEmail = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const emailResult = await sendEmail(
                "test@example.com",
                "Тестовое письмо",
                "Это тестовое письмо для проверки работы почтового сервиса."
            )
            setResult(emailResult)
        } catch (error) {
            setResult({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Тест почтового сервиса</CardTitle>
                <CardDescription>
                    Проверьте настройки SMTP и отправьте тестовое письмо
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        disabled={isLoading}
                        onClick={handleTestConnection}
                        variant="outline"
                    >
                        Проверить подключение
                    </Button>
                    <Button disabled={isLoading} onClick={handleTestEmail}>
                        Отправить тест
                    </Button>
                </div>

                {result && (
                    <div
                        className={`rounded-md p-3 ${
                            result.success
                                ? "border border-green-200 bg-green-50 text-green-800"
                                : "border border-red-200 bg-red-50 text-red-800"
                        }`}
                    >
                        <p className="font-medium">
                            {result.success ? "✅ Успешно" : "❌ Ошибка"}
                        </p>
                        {result.message && (
                            <p className="mt-1 text-sm">{result.message}</p>
                        )}
                        {result.error && (
                            <p className="mt-1 text-sm">{result.error}</p>
                        )}
                    </div>
                )}

                <div className="space-y-1 text-gray-500 text-xs">
                    <p>
                        <strong>Host:</strong>{" "}
                        {process.env.NEXT_PUBLIC_EMAIL_HOST || "Не настроен"}
                    </p>
                    <p>
                        <strong>Port:</strong>{" "}
                        {process.env.NEXT_PUBLIC_EMAIL_PORT || "Не настроен"}
                    </p>
                    <p>
                        <strong>User:</strong>{" "}
                        {process.env.NEXT_PUBLIC_EMAIL_USER || "Не настроен"}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
