"use client"

import { IconUpload } from "@tabler/icons-react"
import { useActionState, useRef, useState } from "react"
import { toast } from "sonner"
import { generateCandidateDescription } from "@/actions/ai"
import { createCandidate } from "@/actions/candidates"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewCandidatePage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [data, dispatch] = useActionState(createCandidate, {})

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const ACCEPTED_MIME_TYPES = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/rtf",
        "text/rtf",
    ] as const
    const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".rtf", ".txt"] as const

    const isFileTypeAccepted = (file: File) => {
        const byMime = file.type
            ? ACCEPTED_MIME_TYPES.includes(
                  file.type as (typeof ACCEPTED_MIME_TYPES)[number]
              )
            : false
        if (byMime) {
            return true
        }
        const filename = file.name.toLowerCase()
        return ACCEPTED_EXTENSIONS.some((ext) => filename.endsWith(ext))
    }

    const processFile = async (file: File) => {
        if (!isFileTypeAccepted(file)) {
            toast.error(
                "Неподдерживаемый тип файла. Допустимо: PDF, DOCX, RTF, TXT",
                {
                    position: "top-center",
                }
            )
            return
        }
        setIsLoading(true)
        try {
            const fd = new FormData()
            fd.set("file", file)
            const result = await generateCandidateDescription(fd)

            if (!result.success) {
                toast.error(result.text, { position: "top-center" })
                setIsLoading(false)
                return
            }

            const parsed = JSON.parse(
                result.data.result.alternatives[0].message.text
            ) as {
                name: string
                email: string
                phone: string
                description: string
            }

            setName(parsed.name ?? "")
            setEmail(parsed.email ?? "")
            setPhone(parsed.phone.replace(/[^\d]/g, "") ?? "")
            setDescription(parsed.description ?? "")
        } catch {
            toast.error("Не удалось обработать файл", {
                position: "top-center",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        await processFile(file)
        e.target.value = ""
    }

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerActions={
                <>
                    <input
                        accept=".pdf,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
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
                    Загрузите файл резюме (PDF/DOCX/RTF/TXT), чтобы
                    автоматически заполнить поля кандидата. Можно перетащить
                    файл в область формы.
                </span>
            }
            headerTitle="Новый кандидат"
            isLoading={isLoading}
            onFileDrop={(file) => {
                processFile(file)
            }}
        >
            <FormBody>
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
