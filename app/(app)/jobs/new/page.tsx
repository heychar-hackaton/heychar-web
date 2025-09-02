"use client"

import { IconUpload } from "@tabler/icons-react"
import { useActionState, useState } from "react"
import { generateJobDescription } from "@/actions/ai"
import { createJob } from "@/actions/jobs"
import { getOrganisations } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAIFileImport } from "@/hooks/use-ai-file-import"

export default function NewJobPage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [recommendation, setRecommendation] = useState<string[]>([])

    const [data, dispatch] = useActionState(createJob, {})
    const {
        isLoading,
        fileInputRef,
        acceptString,
        handleFileChange,
        handleOpenFileDialog,
        handleFileDrop,
    } = useAIFileImport({
        generate: generateJobDescription,
        mapMessageToData: (messageText: string) => {
            const parsed = JSON.parse(messageText) as {
                name: string
                description: string
                recommendation: string[]
            }
            return parsed
        },
        onSuccess: (parsed) => {
            setName(parsed.name)
            setDescription(parsed.description)
            setRecommendation(parsed.recommendation)
        },
        generalErrorMessage: "Не удалось обработать файл",
    })

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerActions={
                <>
                    <input
                        accept={acceptString}
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        type="file"
                    />
                    <Button
                        onClick={handleOpenFileDialog}
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <IconUpload className="mr-2 size-4" />
                        Загрузить из файла
                    </Button>
                </>
            }
            headerDescription={
                <span>
                    Информация о вакансии помогает агенту лучше разбираться в
                    вопросах, связанных с ней. <br />
                    Опишите как можно подробнее вакансию - требования,
                    обязанности, опыт, образование, навыки, зарплатные ожидания
                    и т.д.
                </span>
            }
            headerTitle="Новая вакансия"
            info={
                recommendation.length > 0 && (
                    <>
                        <h3 className="font-bold">Рекомендации по улучшению</h3>
                        <ul className="list-disc">
                            {recommendation.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </>
                )
            }
            isLoading={isLoading}
            onFileDrop={handleFileDrop}
        >
            <FormBody>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="name"
                        required
                    >
                        Организация
                    </Label>
                    <FormSelect
                        getOptions={getOrganisations}
                        name="organisationId"
                    />
                </FormField>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="name"
                        required
                    >
                        Наименование
                    </Label>
                    <Input
                        autoComplete="off"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        required
                        type="text"
                        value={name}
                    />
                </FormField>
                <FormField className="items-start">
                    <Label
                        className="mt-1 shrink-0 basis-3/12"
                        htmlFor="description"
                        required
                    >
                        Описание
                    </Label>

                    <Textarea
                        className="max-h-[328px] min-h-[228px] resize-none"
                        name="description"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Напишите описание вакансии, чтобы агент имел представление о ней во время разговора"
                        required
                        value={description}
                    />
                </FormField>
            </FormBody>
            <FormFooter submitLabel="Создать" />
        </Form>
    )
}
