"use client"

import { useActionState } from "react"
import { createJob } from "@/actions/jobs"
import { getOrganisations } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewJobPage() {
  const [data, dispatch] = useActionState(createJob, {})

  return (
    <Form
      action={dispatch}
      errors={data.errors}
      headerDescription={
        <span>
          Информация об организации помогает агенту лучше разбираться в
          вопросах, связанных с ней. <br />
          Опишите как можно подробнее вакансию - требования, обязанности, опыт,
          образование, навыки, зарплатные ожидания и т.д.
        </span>
      }
      headerTitle="Новая вакансия"
    >
      <FormBody>
        <FormField>
          <Label className="shrink-0 basis-3/12" htmlFor="name" required>
            Организация
          </Label>
          <FormSelect getOptions={getOrganisations} name="organisationId" />
        </FormField>
        <FormField>
          <Label className="shrink-0 basis-3/12" htmlFor="name" required>
            Наименование
          </Label>
          <Input autoComplete="off" name="name" required type="text" />
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
            placeholder="Напишите описание вакансии, чтобы агент имел представление о ней во время разговора"
            required
          />
        </FormField>
      </FormBody>
      <FormFooter submitLabel="Создать" />
    </Form>
  )
}
