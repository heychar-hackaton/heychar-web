"use client"

import {
    ConnectionStateToast,
    LiveKitRoom,
    RoomAudioRenderer,
    VideoConference,
} from "@livekit/components-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { dispatchAgent, generateLiveKitToken } from "@/actions/livekit"
import "@livekit/components-styles"
import { Button } from "../../../components/ui/button"

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
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    if (!(token && wsUrl) || isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
                    <p>Connecting to LiveKit...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <LiveKitRoom
                audio={true}
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
                style={{ height: "100vh" }}
                token={token}
                video={false}
            >
                <VideoConference />
                <RoomAudioRenderer />
                <ConnectionStateToast />

                {/* Кнопка для ручного диспатча агента */}
                {!(autoDispatchAgent || agentDispatched) && (
                    <div className="absolute top-4 right-4 z-10">
                        <Button
                            disabled={isPending}
                            onClick={handleDispatchAgent}
                        >
                            {isPending ? "Calling Agent..." : "Call AI Agent"}
                        </Button>
                    </div>
                )}
            </LiveKitRoom>
        </div>
    )
}
