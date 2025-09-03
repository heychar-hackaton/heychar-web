"use client"

import { IconUpload } from "@tabler/icons-react"
import { useActionState, useState } from "react"
import { generateCandidateDescription } from "@/actions/ai"
import { createCandidate } from "@/actions/candidates"
import { getJobs } from "@/actions/jobs"
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

export default function NewCandidatePage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [description, setDescription] = useState("")
    const [jobId, setJobId] = useState("")
    const [data, dispatch] = useActionState(createCandidate, {})
    const {
        isLoading,
        fileInputRef,
        acceptString,
        handleFileChange,
        handleOpenFileDialog,
        handleFileDrop,
    } = useAIFileImport({
        generate: generateCandidateDescription,
        mapMessageToData: (messageText: string) => {
            const parsed = JSON.parse(messageText) as {
                name?: string
                email?: string
                phone?: string
                description: string
                jobId?: string
            }
            return {
                name: parsed.name ?? "",
                email: parsed.email ?? "",
                phone: (parsed.phone ?? "").replace(/[^\d]/g, ""),
                description: parsed.description ?? "",
                jobId: parsed.jobId ?? "",
            }
        },
        onSuccess: (parsed) => {
            setName(parsed.name)
            setEmail(parsed.email)
            setPhone(parsed.phone)
            setDescription(parsed.description)
            setJobId(parsed.jobId)
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
                    Загрузите файл резюме (PDF/DOCX/RTF/TXT), чтобы
                    автоматически заполнить поля кандидата. Можно перетащить
                    файл в область формы.
                </span>
            }
            headerTitle="Новый кандидат"
            isLoading={isLoading}
            onFileDrop={handleFileDrop}
        >
            <FormBody>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="jobId"
                        required
                    >
                        Вакансия
                    </Label>
                    <FormSelect
                        getOptions={getJobs}
                        name="jobId"
                        onValueChange={(value) => setJobId(value)}
                        value={jobId}
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="name">
                        Имя
                    </Label>
                    <Input
                        autoComplete="off"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        autoComplete="off"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        value={email}
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="phone">
                        Телефон
                    </Label>
                    <Input
                        autoComplete="off"
                        name="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        value={phone}
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
                        placeholder="Опишите кандидата"
                        required
                        value={description}
                    />
                </FormField>
            </FormBody>
            <FormFooter submitLabel="Создать" />
        </Form>
    )
}
