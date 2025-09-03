"use client"

import { useActionState } from "react"
import { updateJob } from "@/actions/jobs"
import { getOrganisations } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TJob } from "@/db/types"

export function EditJobForm({ job }: { job: TJob }) {
    const [data, dispatch] = useActionState(updateJob, {})

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerTitle="Редактирование вакансии"
        >
            <FormBody>
                <input name="id" type="hidden" value={job.id} />
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="organisationId"
                        required
                    >
                        Организация
                    </Label>
                    <FormSelect
                        defaultValue={job.organisation?.id ?? undefined}
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
                        defaultValue={job.name}
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
                        defaultValue={job.description ?? ""}
                        name="description"
                        placeholder="Опишите вакансию"
                        required
                    />
                </FormField>
                <FormField>
                    <Label className="shrink-0 basis-3/12" htmlFor="archived">
                        В архиве
                    </Label>
                    <Checkbox defaultChecked={job.archived} name="archived" />
                </FormField>
            </FormBody>
            <FormFooter cancelLabel="Назад" submitLabel="Сохранить" />
        </Form>
    )
}
