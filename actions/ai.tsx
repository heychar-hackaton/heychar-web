"use server"

import { toJSONSchema, z } from "zod"
import { getTextFromFile } from "@/lib/file-parser"
import { type YandexCompletionRequest, yandexComplete } from "@/lib/yandex"

type YandexTextResult = {
    result: {
        alternatives: { message: { text: string } }[]
    }
}

type GenerateJobDescriptionSuccess = {
    success: true
    data: YandexTextResult
    text: string
}

type GenerateJobDescriptionError = {
    success: false
    data: string | null
    text: string
}

export type GenerateJobDescriptionResponse =
    | GenerateJobDescriptionSuccess
    | GenerateJobDescriptionError

export const generateJobDescription = async (
    formData: FormData
): Promise<GenerateJobDescriptionResponse> => {
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
            success: false,
            text: data.text,
            data: null,
        }
    }
    const jsonSchema = z.object({
        name: z.string(),
        description: z.string(),
        recommendation: z.array(z.string()),
    })

    const requestBody: YandexCompletionRequest = {
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
        
        Поле recommendation - это список рекомендаций для улучшения вакансии, если они есть. Например, указать бонусы, зарплатные ожидания, если они не указаны, условия работы и т.д. Это массив строк.
        
         
        Информация о вакансии: 
        ${data.text}`,
            },
        ],
        completionOptions: {
            stream: false,
        },
        jsonObject: true,
        jsonSchema: {
            schema: toJSONSchema(jsonSchema),
        },
    }

    const response = await yandexComplete<YandexTextResult>(requestBody)

    if (!response.ok) {
        return {
            success: false,
            text: "Не удалось сгенерировать вакансию",
            data: response.error,
        }
    }

    const result = response.data

    return {
        success: true,
        data: result,
        text: "",
    }
}

export const generateCandidateDescription = async (
    formData: FormData
): Promise<GenerateJobDescriptionResponse> => {
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
            success: false,
            text: data.text,
            data: null,
        }
    }
    const jsonSchema = z.object({
        name: z.string().optional().default(""),
        email: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        description: z.string(),
    })

    const requestBody: YandexCompletionRequest = {
        messages: [
            {
                role: "system",
                text: "Ты ассистент, который помогает в рефакторинге резюме.",
            },
            {
                role: "user",
                text: `Создай подробное описание резюме в текстовом формате. 
        Ничего не придумывай, используй только эту информацию.
        Если какие-то поля не заполнены, просто так и напиши - что нет специальных требований.
        Не пиши информацию о компаннии, не пиши как подать заявку.
        
        Ты должен вернуть только JSON-объект, без других текстов.
        Поле name - это имя кандидата, если нет, то пустая строка.
        Поле email - это email кандидата, если нет, то пустая строка.
        Поле phone - это телефон кандидата, если нет, то пустая строка.
        Поле description - это описание из резюме. Только текст без markdown-разметки, разбитый по разделам - параграфам.
        Разделы всегда должны быть разделены пустой строкой.
        Выяви опыт работы, места работы, должности, обязанности, результаты работы, навыки, образования, место жительства, возможность переезда.
        
        Информация о резюме: 
        ${data.text}`,
            },
        ],
        completionOptions: {
            stream: false,
        },
        jsonObject: true,
        jsonSchema: {
            schema: toJSONSchema(jsonSchema),
        },
    }

    const response = await yandexComplete<YandexTextResult>(requestBody)

    if (!response.ok) {
        return {
            success: false,
            text: "Не удалось сгенерировать резюме",
            data: response.error,
        }
    }

    const result = response.data

    return {
        success: true,
        data: result,
        text: "",
    }
}
