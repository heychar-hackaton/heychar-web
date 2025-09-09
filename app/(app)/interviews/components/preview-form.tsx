"use client"
import { Markdown } from "@react-email/components"
import {
    IconAi,
    IconBriefcaseFilled,
    IconUserFilled,
} from "@tabler/icons-react"
import type { VariantProps } from "class-variance-authority"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TInterviewInfo, TInterviewRecommendation } from "@/db/types"

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

const getRecommendation = (recommendation: TInterviewRecommendation) => {
    switch (recommendation) {
        case "next_stage":
            return "Следующий этап"
        case "rejection":
            return "Отказ"
        case "needs_clarification":
            return "Четкого решения нет, нужно уточнить"
        default:
            return "Нужно уточнить"
    }
}

const RecommendationBadge = ({
    recommendation,
}: {
    recommendation: TInterviewRecommendation
}) => {
    let variant: VariantProps<typeof badgeVariants>["variant"] = "outline"
    switch (recommendation) {
        case "next_stage":
            variant = "success"
            break
        case "rejection":
            variant = "destructive"
            break
        case "needs_clarification":
            variant = "secondary"
            break
        default:
            variant = "outline"
    }

    return <Badge variant={variant}>{getRecommendation(recommendation)}</Badge>
}

const chartConfig = {
    value: {
        label: "Уровень",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export const PreviewForm = ({ interview }: { interview: TInterviewInfo }) => {
    return (
        <div className="flex max-w-7xl gap-10">
            <div className="flex max-w-md flex-4/12 flex-col gap-5 self-start rounded-xl border border-border bg-sidebar p-6">
                <div className="flex items-center gap-4">
                    <div className="flex aspect-square w-12 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 text-background transition-colors hover:via-foreground/60">
                        <IconUserFilled className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-xl leading-none">
                            {interview.candidate?.name}
                        </h3>
                        <p className="flex gap-2 text-sm">
                            <span>{interview.candidate?.email}</span>
                            <span>{interview.candidate?.phone}</span>
                        </p>
                    </div>
                </div>

                <ChartContainer
                    className="mx-auto aspect-square max-h-[600px] min-h-[300px]"
                    config={chartConfig}
                >
                    <RadarChart
                        className="overflow-visible"
                        data={interview.candidate?.skills}
                    >
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={false}
                        />
                        <PolarAngleAxis
                            className="text-xs"
                            dataKey="name"
                            overflow="visible"
                        />
                        <PolarGrid />
                        <Radar
                            dataKey="value"
                            fill="var(--color-primary)"
                            fillOpacity={0.6}
                            overflow="visible"
                        />
                    </RadarChart>
                </ChartContainer>

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
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-xl leading-none">
                                {interview.job?.name}
                            </h3>
                            <p className="flex gap-2 text-sm">
                                <RecommendationBadge
                                    recommendation={
                                        interview.recommendation as TInterviewRecommendation
                                    }
                                />
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

                <Tabs className="mt-6 w-full" defaultValue="recommendation">
                    <TabsList className="w-full">
                        <TabsTrigger value="recommendation">Резюме</TabsTrigger>
                        <TabsTrigger value="chat">Диалог</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recommendation">
                        {interview.summary && (
                            <div className="mt-4">
                                <Markdown>{interview.summary}</Markdown>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="chat">
                        <ScrollArea className="h-[calc(100vh-250px)] w-full pr-4">
                            {interview.messages?.map((message, index) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: we need to use the index as the key
                                <Message from={message.role} key={index}>
                                    <MessageContent>
                                        {message.content}
                                    </MessageContent>
                                    <Avatar>
                                        <AvatarFallback>
                                            {message.role === "user" ? (
                                                <IconUserFilled className="size-4" />
                                            ) : (
                                                <IconAi />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </Message>
                            ))}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
