"use client"

import { useActionState } from "react"
import { updateOrganisation } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Organisation = {
  id: string
  name: string
  description: string | null
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
        <input type="hidden" name="id" value={org.id} />
        <FormField>
          <Label className="flex-5/12" htmlFor="name" required>
            Наименование
          </Label>
          <Input
            autoComplete="off"
            name="name"
            required
            type="text"
            defaultValue={org.name}
          />
        </FormField>
        <FormField className="flex-col">
          <Label htmlFor="description" required>
            Описание
          </Label>
          <Textarea
            className="max-h-[328px] min-h-[228px] resize-none"
            name="description"
            placeholder="Опишите организацию"
            required
            defaultValue={org.description ?? ""}
          />
        </FormField>
        <FormField>
          <Input
            autoComplete="off"
            name="yandexApiKey"
            placeholder="Ключ API Яндекс (оставьте пустым, чтобы не менять)"
            type="password"
          />
        </FormField>
        <FormField>
          <Input
            autoComplete="off"
            name="yandexFolderId"
            placeholder="ID каталога Яндекс (оставьте пустым, чтобы не менять)"
            type="password"
          />
        </FormField>
      </FormBody>
      <FormFooter submitLabel="Сохранить" cancelLabel="Назад" />
    </Form>
  )
}
