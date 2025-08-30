import {
  IconBuilding,
  IconHexagonLetterHFilled,
  IconPhone,
  IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { SidebarMenuButton as SidebarMenuButtonLink } from "./sidebar-menu-button"

const menuItems = [
  {
    title: "Собеседования",
    href: "/interviews",
    icon: IconPhone,
  },
  {
    title: "Кандидаты",
    href: "/candidates",
    icon: IconUsers,
  },
  {
    title: "Организации",
    href: "/organisations",
    icon: IconBuilding,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconHexagonLetterHFilled className="!size-5" />
                <span className="font-semibold text-base">Heychar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonLink tooltip={item.title} url={item.href}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButtonLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
