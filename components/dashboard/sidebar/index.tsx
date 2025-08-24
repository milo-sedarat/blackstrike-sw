"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import BracketsIcon from "@/components/icons/brackets"
import ProcessorIcon from "@/components/icons/proccesor"
import CuteRobotIcon from "@/components/icons/cute-robot"
import EmailIcon from "@/components/icons/email"
import GearIcon from "@/components/icons/gear"
import LightningIcon from "@/components/icons/lightning"
import DotsVerticalIcon from "@/components/icons/dots-vertical"
import { Bullet } from "@/components/ui/bullet"
import LockIcon from "@/components/icons/lock"
import Image from "next/image"
import { useIsV0 } from "@/lib/v0-context"

const data = {
  navMain: [
    {
      title: "Trading",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: BracketsIcon,
          isActive: false,
        },
        {
          title: "My Bots",
          url: "/bots",
          icon: CuteRobotIcon,
          isActive: false,
        },
        {
          title: "Exchanges",
          url: "/exchanges",
          icon: ProcessorIcon,
          isActive: false,
        },
        {
          title: "DeFi Positions",
          url: "/defi",
          icon: EmailIcon,
          isActive: false,
        },
        {
          title: "Portfolio",
          url: "/portfolio",
          icon: BracketsIcon,
          isActive: false,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: ProcessorIcon,
          isActive: false,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: GearIcon,
          isActive: false,
        },
      ],
    },
  ],
  desktop: {
    title: "Desktop (Online)",
    status: "online",
  },
  user: {
    name: "TRADER",
    email: "trader@blackstrike.io",
    avatar: "/avatars/user_krimson.png",
  },
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const isV0 = useIsV0()
  const pathname = usePathname()

  const navItems = data.navMain[0].items.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  return (
    <Sidebar {...props} className={cn("py-sides", className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
          <Image
            src="/assets/blackstrike-logo.png"
            alt="BlackStrike Logo"
            width={32}
            height={32}
            className="group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-2xl font-display">BlackStrike</span>
          <span className="text-xs uppercase">Crypto Trading Platform</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="rounded-t-none">
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            Trading
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(item.locked && "pointer-events-none opacity-50")}
                  data-disabled={item.locked}
                >
                  <SidebarMenuButton
                    asChild={!item.locked}
                    isActive={item.isActive}
                    disabled={item.locked}
                    className={cn("disabled:cursor-not-allowed", item.locked && "pointer-events-none")}
                  >
                    {item.locked ? (
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  {item.locked && (
                    <SidebarMenuBadge>
                      <LockIcon className="size-5 block" />
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger className="flex gap-0.5 w-full group cursor-pointer">
                    <div className="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                      <Image
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                        width={120}
                        height={120}
                      />
                    </div>
                    <div className="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xl font-display">{data.user.name}</span>
                        <span className="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                          {data.user.email}
                        </span>
                      </div>
                      <DotsVerticalIcon className="ml-auto size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={4}>
                    <div className="flex flex-col">
                      <button className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <LightningIcon className="mr-2 h-4 w-4" />
                        Account
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <GearIcon className="mr-2 h-4 w-4" />
                        Settings
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
