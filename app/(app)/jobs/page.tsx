import type { Metadata } from "next"
import { getJobs } from "@/actions/jobs"
import { EmptyJobsState } from "./components/empty-state"
import { JobList } from "./components/list"

export const metadata: Metadata = {
  title: "Вакансии",
}

export default async function Page() {
  const jobs = await getJobs()

  if (!jobs.length) {
    return <EmptyJobsState />
  }

  return <JobList jobs={jobs} />
}
