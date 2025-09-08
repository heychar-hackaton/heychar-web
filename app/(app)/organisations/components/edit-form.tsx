"use client"

import { useActionState } from "react"
import { updateOrganisation } from "@/actions/organisations"
import { getProviders } from "@/actions/providers"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Organisation = {
    id: string
    name: string
    description: string | null
    providerId: string
    provider?: {
        id: string
        name: string
        type: "yandex" | "openai"
    } | null
}

export function EditOrganisationForm({ org }: { org: Organisation }) {
    const [data, dispatch] = useActionState(updateOrganisation, {})

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerTitle="Редактирование организации"
        >
            <FormBody>
                <input name="id" type="hidden" value={org.id} />
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
                        defaultValue={org.name}
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
                        defaultValue={org.description ?? ""}
                        name="description"
                        placeholder="Опишите организацию"
                        required
                    />
                </FormField>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="providerId"
                        required
                    >
                        AI провайдер
                    </Label>
                    <FormSelect
                        defaultValue={org.providerId}
                        getOptions={getProviders}
                        name="providerId"
                        required
                    />
                </FormField>
            </FormBody>
            <FormFooter cancelLabel="Назад" submitLabel="Сохранить" />
        </Form>
    )
}
