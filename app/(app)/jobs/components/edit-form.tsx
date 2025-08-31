"use client"

import { useActionState } from "react"
import { updateJob } from "@/actions/jobs"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormSelect } from "@/components/form/form-select"
import { getOrganisations } from "@/actions/organisations"

type Job = {
  id: string
  name: string
  description: string | null
  organisationId: string | null
}

export function EditJobForm({ job }: { job: Job }) {
  const [data, dispatch] = useActionState(updateJob, {})

  return (
    <Form
      action={dispatch}
      errors={data.errors}
      headerTitle="Редактирование вакансии"
    >
      <FormBody>
        <input type="hidden" name="id" value={job.id} />
        <FormField>
          <Label
            className="basis-3/12 shrink-0"
            htmlFor="organisationId"
            required
          >
            Организация
          </Label>
          <FormSelect
            name="organisationId"
            defaultValue={job.organisationId ?? undefined}
            getOptions={getOrganisations}
          />
        </FormField>
        <FormField>
          <Label className="basis-3/12 shrink-0" htmlFor="name" required>
            Наименование
          </Label>
          <Input
            autoComplete="off"
            name="name"
            required
            type="text"
            defaultValue={job.name}
          />
        </FormField>
        <FormField className="items-start">
          <Label
            className="basis-3/12 shrink-0 mt-1"
            htmlFor="description"
            required
          >
            Описание
          </Label>
          <Textarea
            className="max-h-[328px] min-h-[228px] resize-none"
            name="description"
            placeholder="Опишите вакансию"
            required
            defaultValue={job.description ?? ""}
          />
        </FormField>
      </FormBody>
      <FormFooter submitLabel="Сохранить" cancelLabel="Назад" />
    </Form>
  )
}
