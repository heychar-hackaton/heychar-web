"use client"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useActionState } from "react"
import { createOrganisation } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import FormSegmentHeader from "@/components/form/form-segment-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewOrganisation() {
    const [data, dispatch] = useActionState(createOrganisation, {})

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            info={
                <>
                    <h3 className="font-bold">
                        Для получения ключей воспользуйтесь официальной
                        документацией:
                    </h3>
                    <ul className="ml-6 list-disc">
                        <li>
                            <Link
                                className="flex items-center gap-1 text-primary hover:underline"
                                href="https://yandex.cloud/ru/docs/iam/operations/authentication/manage-api-keys#create-api-key"
                                target="_blank"
                            >
                                Создание API ключа{" "}
                                <IconExternalLink className="size-4" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-1 text-primary hover:underline"
                                href="https://yandex.cloud/ru/docs/resource-manager/operations/folder/get-id"
                                target="_blank"
                            >
                                Получение ID каталога{" "}
                                <IconExternalLink className="size-4" />
                            </Link>
                        </li>
                    </ul>
                </>
            }
            headerDescription={
                <span>
                    Информация об организации помогает агенту лучше разбираться
                    в вопросах, связанных с ней. <br />
                    Агент использует API Яндекс для общения с кадидатами.
                </span>
            }
            headerTitle="Создание организации"
        >
            <FormBody>
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
                        required
                        type="text"
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
                        placeholder="Напишите описание организации, чтобы агент имел представление о ней во время разговора"
                        required
                    />
                </FormField>
                <FormSegmentHeader
                    description={
                        <span>
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
                        name="yandexApiKey"
                        placeholder="Ключ API Яндекс"
                        required
                        type="password"
                    />
                </FormField>
                <FormField>
                    <Input
                        autoComplete="off"
                        name="yandexFolderId"
                        placeholder="ID каталога Яндекс"
                        required
                        type="password"
                    />
                </FormField>
            </FormBody>
            <FormFooter submitLabel="Создать" />
        </Form>
    )
}
