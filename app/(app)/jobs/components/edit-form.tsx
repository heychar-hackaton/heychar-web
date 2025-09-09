"use client"

import { useActionState, useState } from "react"
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
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import type { TJob } from "@/db/types"

export function EditJobForm({ job }: { job: TJob }) {
    const [data, dispatch] = useActionState(updateJob, {})
    const [hardSkillsScore, setHardSkillsScore] = useState(
        job.hardSkillsScore ?? 0.5
    )
    const [softSkillsScore, setSoftSkillsScore] = useState(
        job.softSkillsScore ?? 0.5
    )

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerDescription={
                <span>
                    Информация о вакансии помогает агенту лучше разбираться в
                    вопросах, связанных с ней. <br />
                    Опишите как можно подробнее вакансию - требования,
                    обязанности, опыт, образование, навыки, зарплатные ожидания
                    и т.д.
                </span>
            }
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
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="hardSkillsScore"
                        required
                    >
                        Hard skills
                    </Label>
                    <div className="w-full">
                        <span
                            aria-hidden="true"
                            className="mb-3 flex w-full justify-between font-medium text-muted-foreground text-xs"
                        >
                            <span>
                                Важность технических навыков, 0 - не важны, 1 -
                                очень важны
                            </span>
                            <span className="font-bold font-mono">
                                {hardSkillsScore}
                            </span>
                        </span>
                        <Slider
                            max={1}
                            min={0}
                            name="hardSkillsScore"
                            onValueChange={(e) => setHardSkillsScore(e[0])}
                            showTooltip
                            step={0.1}
                            value={[hardSkillsScore]}
                        />
                    </div>
                </FormField>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="softSkillsScore"
                        required
                    >
                        Soft skills
                    </Label>
                    <div className="w-full">
                        <span
                            aria-hidden="true"
                            className="mb-3 flex w-full justify-between font-medium text-muted-foreground text-xs"
                        >
                            <span>
                                Важность soft навыков, 0 - не важны, 1 - очень
                                важны
                            </span>
                            <span className="font-bold font-mono">
                                {softSkillsScore}
                            </span>
                        </span>
                        <Slider
                            max={1}
                            min={0}
                            name="softSkillsScore"
                            onValueChange={(e) => setSoftSkillsScore(e[0])}
                            showTooltip
                            step={0.1}
                            value={[softSkillsScore]}
                        />
                    </div>
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
