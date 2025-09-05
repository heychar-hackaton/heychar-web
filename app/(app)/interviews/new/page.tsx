"use client"

import { useActionState, useEffect, useState } from "react"
import { getCandidatesByJobId } from "@/actions/candidates"
import { createInterviews } from "@/actions/interviews"
import { getJobs } from "@/actions/jobs"
import { Form } from "@/components/form"
import FormBody from "@/components/form/form-body"
import { FormField } from "@/components/form/form-field"
import FormFooter from "@/components/form/form-footer"
import { FormSelect } from "@/components/form/form-select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import SwitchBlock from "@/components/ui/switch-block"

export default function NewInterviewPage() {
    const [jobId, setJobId] = useState("")
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
    const [candidates, setCandidates] = useState<
        Awaited<ReturnType<typeof getCandidatesByJobId>>
    >([])
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
    const [data, dispatch] = useActionState(createInterviews, {})

    // Загружаем кандидатов при выборе вакансии
    useEffect(() => {
        const loadCandidates = async () => {
            if (!jobId) {
                setCandidates([])
                setSelectedCandidates([])
                return
            }

            setIsLoadingCandidates(true)
            try {
                const candidatesData = await getCandidatesByJobId(jobId)
                setCandidates(candidatesData)
                setSelectedCandidates([])
            } catch {
                setCandidates([])
            } finally {
                setIsLoadingCandidates(false)
            }
        }

        loadCandidates()
    }, [jobId])

    const handleCandidateToggle = (candidateId: string) => {
        setSelectedCandidates((prev) =>
            prev.includes(candidateId)
                ? prev.filter((id) => id !== candidateId)
                : [...prev, candidateId]
        )
    }

    const handleSelectAll = () => {
        if (selectedCandidates.length === candidates.length) {
            setSelectedCandidates([])
        } else {
            setSelectedCandidates(candidates.map((c) => c.id))
        }
    }

    return (
        <Form
            action={dispatch}
            errors={data.errors}
            headerDescription={
                <span>
                    Выберите вакансию и кандидатов для создания интервью. <br />
                    Для каждого выбранного кандидата будет создано отдельное
                    интервью.
                </span>
            }
            headerTitle="Новые интервью"
        >
            <FormBody>
                <FormField>
                    <Label
                        className="shrink-0 basis-3/12"
                        htmlFor="jobId"
                        required
                    >
                        Вакансия
                    </Label>
                    <FormSelect
                        getOptions={getJobs}
                        name="jobId"
                        onValueChange={(value) => setJobId(value)}
                        value={jobId}
                    />
                </FormField>

                {jobId && (
                    <FormField className="items-start">
                        <Label className="mt-1 shrink-0 basis-3/12">
                            Кандидаты
                        </Label>
                        <div className="flex-1 space-y-4">
                            {isLoadingCandidates && (
                                <div className="text-muted-foreground text-sm">
                                    Загрузка кандидатов...
                                </div>
                            )}
                            {!isLoadingCandidates &&
                                candidates.length === 0 && (
                                    <div className="text-muted-foreground text-sm">
                                        Для выбранной вакансии нет активных
                                        кандидатов
                                    </div>
                                )}
                            {!isLoadingCandidates && candidates.length > 0 && (
                                <>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            aria-label="Выбрать всех кандидатов"
                                            checked={
                                                selectedCandidates.length ===
                                                candidates.length
                                            }
                                            name="select-all"
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <Label
                                            htmlFor="select-all"
                                            onClick={handleSelectAll}
                                        >
                                            Выбрать всех
                                        </Label>
                                    </div>

                                    <div className="grid gap-3">
                                        {candidates.map((candidate) => (
                                            <SwitchBlock
                                                checked={selectedCandidates.includes(
                                                    candidate.id
                                                )}
                                                description={
                                                    <div className="flex gap-4 text-muted-foreground text-xs">
                                                        <div>
                                                            {candidate.phone}
                                                        </div>
                                                        <div>
                                                            {candidate.email}
                                                        </div>
                                                    </div>
                                                }
                                                key={candidate.id}
                                                label={
                                                    candidate.name ||
                                                    "Без имени"
                                                }
                                                onCheckedChange={() =>
                                                    handleCandidateToggle(
                                                        candidate.id
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </FormField>
                )}

                {/* Скрытые поля для отправки данных */}
                {selectedCandidates.map((candidateId) => (
                    <input
                        key={candidateId}
                        name="candidateIds"
                        type="hidden"
                        value={candidateId}
                    />
                ))}
            </FormBody>
            <FormFooter
                submitLabel={`Создать интервью (${selectedCandidates.length})`}
            />
        </Form>
    )
}
