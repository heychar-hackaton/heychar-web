"use client"

import { IconHexagonLetterHFilled } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

const BreadcrumbsPages = {
  interviews: "Собеседования",
  candidates: "Кандидаты",
  jobs: "Вакансии",
  organisations: "Организации",
  new: "Создание",
}

export const AppBreadcrumbs = () => {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      href: string
      text: string
    }[]
  >([])

  useEffect(() => {
    const asPathNestedRoutes = pathname?.split("/").filter((v) => v.length > 0)

    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      const href = `/${asPathNestedRoutes.slice(0, idx + 1).join("/")}`
      const text = subpath
      return { href, text }
    })

    setBreadcrumbs([{ href: "/", text: "Home" }, ...crumblist])
  }, [pathname])

  const getTitle = (id: string) => {
    return (
      BreadcrumbsPages[id as keyof typeof BreadcrumbsPages] || document.title
    )
  }

  if (breadcrumbs.length === 1) {
    return "Главная"
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          if (index < breadcrumbs.length - 1) {
            return (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>
                      {crumb.href === "/" ? (
                        <IconHexagonLetterHFilled className="size-4" />
                      ) : (
                        getTitle(crumb.text)
                      )}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            )
          }
          return (
            <BreadcrumbPage key={crumb.href}>
              {getTitle(crumb.text)}
            </BreadcrumbPage>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
