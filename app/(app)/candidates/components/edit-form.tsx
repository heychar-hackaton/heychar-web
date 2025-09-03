"use client"

import { useActionState } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { updateCandidate } from "@/actions/candidates"
import { getJobs } from "@/actions/jobs"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TCandidateInfo } from "@/db/types"

export function EditCandidateForm({
    candidate,
}: {
    candidate: TCandidateInfo
}) {
    const [data, dispatch] = useActionState(updateCandidate, {})

    const chartConfig = {
        value: {
            label: "Значение",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <div className="flex flex-wrap gap-4">
            <Form
                action={dispatch}
                errors={data.errors}
                headerTitle="Редактирование кандидата"
            >
                <FormBody>
                    <input name="id" type="hidden" value={candidate.id} />
                    <FormField>
                        <Label
                            className="shrink-0 basis-3/12"
                            htmlFor="jobId"
                            required
                        >
                            Вакансия
                        </Label>
                        <FormSelect
                            defaultValue={candidate.job?.id ?? undefined}
                            getOptions={getJobs}
                            name="jobId"
                        />
                    </FormField>
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
                    <FormField>
                        <Label
                            className="shrink-0 basis-3/12"
                            htmlFor="archived"
                        >
                            В архиве
                        </Label>
                        <Checkbox
                            defaultChecked={candidate.archived}
                            name="archived"
                        />
                    </FormField>
                </FormBody>
                <FormFooter cancelLabel="Назад" submitLabel="Сохранить" />
            </Form>
            <ChartContainer
                className="mx-auto aspect-square max-h-[600px] min-h-[300px] lg:aspect-video"
                config={chartConfig}
            >
                <RadarChart className="aspect-square" data={candidate.skills}>
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                    />
                    <PolarAngleAxis className="text-xs" dataKey="name" />
                    <PolarGrid />
                    <Radar
                        dataKey="value"
                        fill="var(--color-primary)"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ChartContainer>
        </div>
    )
}
