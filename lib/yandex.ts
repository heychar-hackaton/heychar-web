"use server"

type YandexRole = "system" | "user" | "assistant"

export type YandexMessage = {
    role: YandexRole
    text: string
}

export type YandexCompletionRequest = {
    messages: YandexMessage[]
    modelUri?: string
    completionOptions?: {
        stream?: boolean
    }
    jsonObject?: boolean
    jsonSchema?: {
        schema: unknown
    }
}

export type YandexCompletionSuccess<T = unknown> = {
    ok: true
    data: T
}

export type YandexCompletionError = {
    ok: false
    error: string
}

const YC_TOKEN = process.env.YANDEX_API_KEY
const YC_FOLDER_ID = process.env.YANDEX_FOLDER_ID

const YC_COMPLETIONS_URL =
    "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

export const yandexComplete = async <T = unknown>(
    body: YandexCompletionRequest
): Promise<YandexCompletionSuccess<T> | YandexCompletionError> => {
    if (!YC_TOKEN) {
        return {
            ok: false,
            error: "YANDEX_API_KEY is not set",
        }
    }

    const modelUri =
        body.modelUri ?? (YC_FOLDER_ID ? `gpt://${YC_FOLDER_ID}/yandexgpt/latest` : undefined)

    if (!modelUri) {
        return {
            ok: false,
            error: "YANDEX_FOLDER_ID is not set and modelUri was not provided",
        }
    }

    const response = await fetch(YC_COMPLETIONS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${YC_TOKEN}`,
        },
        body: JSON.stringify({
            ...body,
            modelUri,
        }),
    })

    if (!response.ok) {
        return {
            ok: false,
            error: await response.text(),
        }
    }

    const result = (await response.json()) as T

    return {
        ok: true,
        data: result,
    }
}


