"use client"

import { useActionState } from "react"
import { updateCandidate } from "@/actions/candidates"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TCandidate } from "@/db/types"

export function EditCandidateForm({ candidate }: { candidate: TCandidate }) {
    const [data, dispatch] = useActionState(updateCandidate, {})

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerTitle="Редактирование кандидата"
        >
            <FormBody>
                <input name="id" type="hidden" value={candidate.id} />
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="name">
                        Имя
                    </Label>
                    <Input
                        autoComplete="off"
                        defaultValue={candidate.name ?? ""}
                        name="name"
                        type="text"
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        autoComplete="off"
                        defaultValue={candidate.email ?? ""}
                        name="email"
                        type="email"
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="phone">
                        Телефон
                    </Label>
                    <Input
                        autoComplete="off"
                        defaultValue={candidate.phone ?? ""}
                        name="phone"
                        type="tel"
                    />
                </FormField>

                <FormField className="items-start">
                    <Label
                        className="mt-1 shrink-0 basis-3/12"
                        htmlFor="description"
                    >
                        Описание
                    </Label>
                    <Textarea
                        className="max-h-[328px] min-h-[228px] resize-none"
                        defaultValue={candidate.description ?? ""}
                        name="description"
                        placeholder="Опишите кандидата"
                    />
                </FormField>
            </FormBody>
            <FormFooter cancelLabel="Назад" submitLabel="Сохранить" />
        </Form>
    )
}
