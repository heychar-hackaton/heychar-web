"use client"
import { useFormState } from "react-dom"
import { createOrganisation } from "@/actions/organisations"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import FormFooter from "@/components/form/form-footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/form/form-field"
import { useActionState } from "react"
import { Label } from "@/components/ui/label"
import FormSegmentHeader from "@/components/form/form-segment-header"
import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

export default function NewOrganisation() {
  const [data, dispatch] = useActionState(createOrganisation, {})

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Enter" || e.key === "NumpadEnter")
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <Form
      action={dispatch}
      errors={data.errors}
      headerDescription={
        <span>
          Информация об организации помогает агенту лучше разбираться в
          вопросах, связанных с ней. <br />
          Агент использует API Яндекс для общения с кадидатами. <br />
          <br />
          Для получения ключей воспользуйтесь официальной документацией:
          <br />
          <ul className="list-disc ml-6">
            <li>
              <Link
                href="https://yandex.cloud/ru/docs/iam/operations/authentication/manage-api-keys#create-api-key"
                target="_blank"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Создание API ключа <IconExternalLink className="size-4" />
              </Link>
            </li>
            <li>
              <Link
                href="https://yandex.cloud/ru/docs/resource-manager/operations/folder/get-id"
                target="_blank"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Получение ID каталога <IconExternalLink className="size-4" />
              </Link>
            </li>
          </ul>
        </span>
      }
      headerTitle="Создание организации"
    >
      <FormBody>
        <FormField>
          <Label htmlFor="name" className="flex-5/12" required>
            Наименование
          </Label>
          <Input name="name" required type="text" autoComplete="off" />
        </FormField>
        <FormField className="flex-col">
          <Label htmlFor="description" required>
            Описание
          </Label>
          <Textarea
            name="description"
            className="resize-none min-h-[228px] max-h-[328px]"
            required
            placeholder="Напишите описание организации, чтобы агент имел представление о ней во время разговора"
          />
        </FormField>
        <FormSegmentHeader
          label="API Яндекс"
          description={
            <span>
              Роли сервисного аккаунта в каталоге:
              <div className="flex  gap-1">
                <Badge variant="secondary">ai.speechkit-stt.user</Badge>
                <Badge variant="secondary">ai.speechkit-tts.user</Badge>
                <Badge variant="secondary">ai.languageModels.user</Badge>
              </div>
              <br />
              Область действия API ключа:
              <div className="flex  gap-1">
                <Badge variant="secondary">yc.ai.speechkitTts.execute</Badge>
                <Badge variant="secondary">yc.ai.languageModels.execute</Badge>
                <Badge variant="secondary">yc.ai.speechkitStt.execute</Badge>
              </div>
            </span>
          }
        />
        <FormField>
          <Input
            name="yandexApiKey"
            required
            type="password"
            placeholder="Ключ API Яндекс"
            autoComplete="off"
          />
        </FormField>
        <FormField>
          <Input
            name="yandexFolderId"
            required
            type="password"
            placeholder="ID каталога Яндекс"
            autoComplete="off"
          />
        </FormField>
      </FormBody>
      <FormFooter submitLabel="Создать" />
    </Form>
  )
}
