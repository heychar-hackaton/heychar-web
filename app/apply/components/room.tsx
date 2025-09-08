"use client"

import { LiveKitRoom } from "@livekit/components-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { dispatchAgent, generateLiveKitToken } from "@/actions/livekit"
import "@livekit/components-styles"
import { IconLoader } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { InterviewConference } from "./interview-conference"

interface LiveKitRoomComponentProps {
    roomName: string
    participantName: string
    autoDispatchAgent?: boolean
}

export default function LiveKitRoomComponent({
    roomName,
    participantName,
    autoDispatchAgent = true,
}: LiveKitRoomComponentProps) {
    const [token, setToken] = useState<string>("")
    const [wsUrl, setWsUrl] = useState<string>("")
    const [agentDispatched, setAgentDispatched] = useState(false)
    const [error, setError] = useState<string>("")
    const [isPending, startTransition] = useTransition()
    const tokenGenerated = useRef(false)

    // Получение токена при загрузке
    useEffect(() => {
        // Предотвращаем повторную генерацию токена
        if (tokenGenerated.current || token) {
            return
        }

        tokenGenerated.current = true

        startTransition(async () => {
            try {
                const result = await generateLiveKitToken(
                    roomName,
                    participantName
                )

                if (result.success) {
                    setToken(result.token || "")
                    setWsUrl(result.wsUrl || "")
                } else {
                    setError(result.error || "Failed to get token")
                }
            } catch (err) {
                console.error("Failed to generate token:", err)
                setError("Failed to generate token")
                tokenGenerated.current = false // Сбрасываем флаг при ошибке
            }
        })
    }, [roomName, participantName, token])

    // Функция для диспатча агента
    const handleDispatchAgent = async () => {
        if (agentDispatched || isPending) {
            return
        }

        startTransition(async () => {
            try {
                await dispatchAgent(roomName)
                setAgentDispatched(true)
            } catch (err) {
                console.error("Failed to dispatch agent:", err)
            }
        })
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h2 className="mb-2 font-semibold text-red-800">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Попробовать снова
                    </Button>
                </div>
            </div>
        )
    }

    if (!(token && wsUrl) || isPending) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-2">
                <IconLoader className="size-8 animate-spin" />
                <p>Подключение к cобеседованию</p>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen">
            <LiveKitRoom
                audio={true}
                className="h-screen"
                data-lk-theme="default"
                lang="ru"
                onConnected={() => {
                    console.log("Connected to room")
                    if (autoDispatchAgent && !agentDispatched) {
                        handleDispatchAgent()
                    }
                }}
                onDisconnected={() => {
                    console.log("Disconnected from room")
                }}
                serverUrl={wsUrl}
                token={token}
                video={false}
            >
                <InterviewConference />
            </LiveKitRoom>
        </div>
    )
}
