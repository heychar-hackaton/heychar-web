"use client"
import { useActionState } from "react"
import { createOrganisation } from "@/actions/organisations"
import { getProviders } from "@/actions/providers"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

export default function NewOrganisation() {
    const [data, dispatch] = useActionState(createOrganisation, {})

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerDescription={
                <span>
                    Информация об организации помогает агенту лучше разбираться
                    в вопросах, связанных с ней. <br />
                    Выберите провайдера для работы с AI.
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
                        className="wrap-anywhere h-[228px] max-h-[328px] resize-none"
                        name="description"
                        placeholder="Напишите описание организации, чтобы агент имел представление о ней во время разговора"
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
                        getOptions={getProviders}
                        name="providerId"
                        required
                    />
                </FormField>
            </FormBody>
            <FormFooter submitLabel="Создать" />
        </Form>
    )
}
