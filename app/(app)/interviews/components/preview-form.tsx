import { IconBriefcaseFilled, IconUserFilled } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TInterviewInfo } from "@/db/types"

const getSkillVariant = (skillValue: number) => {
    if (skillValue > 70) {
        return "success"
    }
    if (skillValue > 50) {
        return "secondary"
    }
    return "destructive"
}

const getDuration = (startTime?: Date | null, endTime?: Date | null) => {
    if (!startTime) {
        return "Еще не началось"
    }
    if (!endTime) {
        return "Еще не закончилось"
    }
    const diffMs = endTime.getTime() - startTime.getTime()
    if (diffMs < 0) {
        return "Ошибка времени"
    }
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours} ч ${minutes} мин`
}

export const PreviewForm = ({ interview }: { interview: TInterviewInfo }) => {
    return (
        <div className="flex max-w-7xl gap-10">
            <div className="flex max-w-md flex-4/12 flex-col gap-5 rounded-xl border border-border bg-sidebar p-6">
                <div className="flex items-center gap-4">
                    <div className="flex aspect-square w-12 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 text-background transition-colors hover:via-foreground/60">
                        <IconUserFilled className="size-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-xl leading-none">
                            {interview.candidate?.name}
                        </h3>
                        <p className="flex gap-2 text-sm">
                            <span>{interview.candidate?.email}</span>
                            <span>{interview.candidate?.phone}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {interview.candidate?.skills.map((skill) => (
                        <Card className="p-4 shadow-none" key={skill.id}>
                            <CardContent className="flex flex-col gap-1.5 px-0">
                                <div className="flex justify-between">
                                    <p className="font-medium text-sm">
                                        {skill.name}
                                    </p>

                                    <Badge
                                        variant={getSkillVariant(
                                            Number(skill.value)
                                        )}
                                    >
                                        {skill.value}
                                    </Badge>
                                </div>
                                <Progress
                                    className="h-1"
                                    max={100}
                                    value={Number(skill.value) ?? 0}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="flex-6/12 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex aspect-square w-12 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 text-background transition-colors hover:via-foreground/60">
                            <IconBriefcaseFilled className="size-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-xl leading-none">
                                {interview.job?.name}
                            </h3>
                            <p className="flex gap-2 text-sm">
                                <Badge variant="outline">
                                    {interview.startTime?.toLocaleDateString(
                                        "ru-RU"
                                    )}
                                </Badge>
                                {getDuration(
                                    interview.startTime,
                                    interview.endTime
                                )}
                            </p>
                        </div>
                    </div>
                    <Badge
                        className="p-3 font-bold text-3xl"
                        variant={getSkillVariant(
                            Number(interview.matchPercentage)
                        )}
                    >
                        {Number(interview.matchPercentage)?.toFixed(0)}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
