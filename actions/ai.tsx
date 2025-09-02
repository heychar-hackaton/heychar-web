"use server"

import { toJSONSchema, z } from "zod"
import { getTextFromFile } from "@/lib/file-parser"

const YC_TOKEN = process.env.YANDEX_API_KEY
const YC_FOLDER_ID = process.env.YANDEX_FOLDER_ID

export const generateJobDescription = async (formData: FormData) => {
    const file = formData.get("file") as File | null

    if (!file) {
        return {
            success: false,
            text: "Файл не выбран",
            data: null,
        }
    }

    const data = await getTextFromFile(file)

    if (!data.success) {
        return {
            ...data,
            data: null,
        }
    }
    const jsonSchema = z.object({
        name: z.string(),
        description: z.string(),
        recommendation: z.array(z.string()),
    })

    const requestBody = {
        messages: [
            {
                role: "system",
                text: "Ты ассистент, который помогает в рефакторинге вакансий.",
            },
            {
                role: "user",
                text: `Создай подробное описание вакансии в текстовом формате. 
        Ничего не придумывай, используй только эту информацию.
        Если какие-то поля не заполнены, просто так и напиши - что нет специальных требований.
        Не пиши информацию о компаннии, не пиши как подать заявку.
        
        Ты должен вернуть только JSON-объект, без других текстов.
        Поле name - это название вакансии без города с большой буквы.
        Поле description - это описание вакансии без таблиц, без наименования вакансии, без рекомендаций. Только текст без markdown-разметки, разбитый по разделам - параграфам.
        Разделы всегда должны быть разделены пустой строкой.
        Напиши подробное описание вакансии: место, график работы, зарплата, обязанности, требования,  условия работы - бери все из информации о вакансии.
        
        Поле recommendation - это список рекомендаций для улучшения вакансии, если они есть. Это массив строк.
        
         
        Информация о вакансии: 
        ${data.text}`,
            },
        ],
        modelUri: `gpt://${YC_FOLDER_ID}/yandexgpt/latest`,
        completionOptions: {
            stream: false,
        },
        jsonObject: true,
        jsonSchema: {
            schema: toJSONSchema(jsonSchema),
        },
    }

    const response = await fetch(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${YC_TOKEN}`,
            },
            body: JSON.stringify(requestBody),
        }
    )

    if (!response.ok) {
        return {
            success: false,
            text: "Не удалось сгенерировать вакансию",
            data: await response.text(),
        }
    }

    const result = await response.json()

    return {
        success: true,
        data: result,
        text: "",
    }
}
