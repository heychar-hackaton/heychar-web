"use client"

import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useActionState, useState } from "react"
import { createProvider } from "@/actions/providers"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import FormSegmentHeader from "@/components/form/form-segment-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function NewProvider() {
    const [data, dispatch] = useActionState(createProvider, {})
    const [providerType, setProviderType] = useState<"yandex" | "openai" | "">(
        ""
    )

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerDescription={
                <span>
                    Создайте провайдера для работы с AI сервисами. <br />
                    Провайдер будет использоваться в организациях для обработки
                    речи и текста.
                </span>
            }
            headerTitle="Создание провайдера"
        >
            <FormBody>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="name"
                        required
                    >
                        Название
                    </Label>
                    <Input
                        autoComplete="off"
                        name="name"
                        placeholder="Например: Основной Яндекс провайдер"
                        required
                        type="text"
                    />
                </FormField>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="type"
                        required
                    >
                        Тип провайдера
                    </Label>
                    <Select
                        name="type"
                        onValueChange={(value) =>
                            setProviderType(value as "yandex" | "openai")
                        }
                        required
                        value={providerType}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите тип провайдера" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yandex">Яндекс</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
                {providerType === "yandex" && (
                    <>
                        <FormSegmentHeader
                            description={
                                <span>
                                    <div className="mb-2">
                                        Получите ключ и ID каталога в{" "}
                                        <div className="flex gap-3">
                                            <Link
                                                className="flex items-center gap-1 text-primary hover:underline"
                                                href="https://yandex.cloud/ru/docs/iam/operations/authentication/manage-api-keys#create-api-key"
                                                target="_blank"
                                            >
                                                Создание API ключа{" "}
                                                <IconExternalLink className="size-4" />
                                            </Link>
                                            <Link
                                                className="flex items-center gap-1 text-primary hover:underline"
                                                href="https://yandex.cloud/ru/docs/resource-manager/operations/folder/get-id"
                                                target="_blank"
                                            >
                                                Получение ID каталога{" "}
                                                <IconExternalLink className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                    Роли сервисного аккаунта в каталоге:
                                    <div className="mb-2 flex gap-1">
                                        <Badge variant="secondary">
                                            ai.speechkit-stt.user
                                        </Badge>
                                        <Badge variant="secondary">
                                            ai.speechkit-tts.user
                                        </Badge>
                                        <Badge variant="secondary">
                                            ai.languageModels.user
                                        </Badge>
                                    </div>
                                    Область действия API ключа:
                                    <div className="flex gap-1">
                                        <Badge variant="secondary">
                                            yc.ai.speechkitTts.execute
                                        </Badge>
                                        <Badge variant="secondary">
                                            yc.ai.languageModels.execute
                                        </Badge>
                                        <Badge variant="secondary">
                                            yc.ai.speechkitStt.execute
                                        </Badge>
                                    </div>
                                </span>
                            }
                            label="API Яндекс"
                        />
                        <FormField>
                            <Input
                                autoComplete="off"
                                name="apiKey"
                                placeholder="Ключ API Яндекс"
                                required
                                type="password"
                            />
                        </FormField>
                        <FormField>
                            <Input
                                autoComplete="off"
                                name="folderId"
                                placeholder="ID каталога Яндекс"
                                required
                                type="password"
                            />
                        </FormField>
                    </>
                )}
                {providerType === "openai" && (
                    <>
                        <FormSegmentHeader
                            description={
                                <span>
                                    OpenAI API используется для языковых моделей
                                    и обработки текста. Получите API ключ в{" "}
                                    <Link
                                        className="flex items-center gap-1 text-primary hover:underline"
                                        href="https://platform.openai.com/api-keys"
                                        target="_blank"
                                    >
                                        OpenAI Platform{" "}
                                        <IconExternalLink className="size-4" />
                                    </Link>
                                </span>
                            }
                            label="API OpenAI"
                        />
                        <FormField>
                            <Input
                                autoComplete="off"
                                name="apiKey"
                                placeholder="Ключ API OpenAI"
                                required
                                type="password"
                            />
                        </FormField>
                    </>
                )}
            </FormBody>
            <FormFooter submitLabel="Создать" />
        </Form>
    )
}
