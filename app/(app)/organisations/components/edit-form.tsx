'use client';

import { useActionState } from 'react';
import { updateOrganisation } from '@/actions/organisations';
import { Form } from '@/components/form';
import FormBody from '@/components/form/form-body';
import { FormField } from '@/components/form/form-field';
import FormFooter from '@/components/form/form-footer';
import FormSegmentHeader from '@/components/form/form-segment-header';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Organisation = {
  id: string;
  name: string;
  description: string | null;
};

export function EditOrganisationForm({ org }: { org: Organisation }) {
  const [data, dispatch] = useActionState(updateOrganisation, {});

  return (
    <Form
      action={dispatch}
      errors={data.errors}
      headerTitle="Редактирование организации"
    >
      <FormBody>
        <input name="id" type="hidden" value={org.id} />
        <FormField>
          <Label className="shrink-0 basis-3/12" htmlFor="name" required>
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
            defaultValue={org.description ?? ''}
            name="description"
            placeholder="Опишите организацию"
            required
          />
        </FormField>
        <FormSegmentHeader
          description={
            <span>
              Роли сервисного аккаунта в каталоге:
              <div className="mb-2 flex gap-1">
                <Badge variant="secondary">ai.speechkit-stt.user</Badge>
                <Badge variant="secondary">ai.speechkit-tts.user</Badge>
                <Badge variant="secondary">ai.languageModels.user</Badge>
              </div>
              Область действия API ключа:
              <div className="flex gap-1">
                <Badge variant="secondary">yc.ai.speechkitTts.execute</Badge>
                <Badge variant="secondary">yc.ai.languageModels.execute</Badge>
                <Badge variant="secondary">yc.ai.speechkitStt.execute</Badge>
              </div>
            </span>
          }
          label="API Яндекс"
        />
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
      <FormFooter cancelLabel="Назад" submitLabel="Сохранить" />
    </Form>
  );
}
