import Link from "next/link"
import { getDashboardData } from "@/actions/dashboard"
import { hasAnyOrganisation } from "@/actions/organisations"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Statistics from "@/components/ui/statistics"
import { EmptyOrganisationsState } from "./organisations/components/empty-state"

export default async function Home() {
    const hasOrganisations = await hasAnyOrganisation()

    if (!hasOrganisations) {
        return <EmptyOrganisationsState />
    }

    const data = await getDashboardData()

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.stats.map((stat) => (
                    <Link href={stat.link} key={stat.label}>
                        <Card
                            className="group relative flex h-44 flex-col justify-between overflow-hidden transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1"
                            key={stat.label}
                        >
                            <div className="absolute top-4 right-4 flex items-center justify-center">
                                <div className="z-30 flex size-8 items-center justify-center rounded-full bg-primary/80 text-white transition-all ease-card-icon group-hover:scale-150 group-hover:bg-primary dark:text-white/60">
                                    <span className="[&>svg]:size-4">
                                        <stat.icon className="size-4" />
                                    </span>
                                </div>
                                <div className="absolute z-20 size-8 rounded-full transition-all delay-75 ease-card-icon group-hover:size-36 group-hover:bg-primary/30" />
                                <div className="absolute z-10 size-4 rounded-full transition-all ease-card-icon group-hover:size-24 group-hover:bg-primary/20" />
                            </div>
                            <CardHeader className="pb-0 font-semibold">
                                <span className="leading-none">
                                    {stat.label}
                                </span>
                                <span className="font-normal text-muted-foreground text-sm leading-none" />
                            </CardHeader>
                            <CardContent className="flex gap-10">
                                <Statistics
                                    description={
                                        stat.value
                                            ? stat.description
                                            : `нет ${stat.description}`
                                    }
                                    value={stat.value}
                                />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
