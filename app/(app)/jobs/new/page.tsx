"use client"

import { IconUpload } from "@tabler/icons-react"
import { useActionState, useRef, useState } from "react"
import { toast } from "sonner"
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

export default function NewJobPage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [recommendation, setRecommendation] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [data, dispatch] = useActionState(createJob, {})
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsLoading(true)
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        const fd = new FormData()
        fd.set("file", file)
        const result = await generateJobDescription(fd)

        if (result.success) {
            const data = JSON.parse(
                result.data.result.alternatives[0].message.text
            ) as { name: string; description: string; recommendation: string[] }
            setName(data.name)
            setDescription(data.description)
            setRecommendation(data.recommendation)
        } else {
            toast.error(result.text, {
                position: "top-center",
            })
        }
        setIsLoading(false)
        e.target.value = ""
    }

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerActions={
                <>
                    <input
                        accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
                        className="hidden"
                        onChange={onFileChange}
                        ref={fileInputRef}
                        type="file"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
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
                    Информация об организации помогает агенту лучше разбираться
                    в вопросах, связанных с ней. <br />
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
