"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  KanbanSquare,
  Settings,
  HelpCircle,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  ChevronLeft,
  BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useNotifications } from "@/components/notifications/notifications-provider"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-secondary",
  },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/analytics",
    color: "text-secondary",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-secondary",
  },
  {
    label: "List View",
    icon: ListTodo,
    href: "/list",
    color: "text-secondary",
  },
  {
    label: "Kanban Board",
    icon: KanbanSquare,
    href: "/kanban",
    color: "text-secondary",
  },
]

const bottomRoutes = [
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    label: "Get Help",
    icon: HelpCircle,
    href: "/help",
  },
]

// Sample notifications for the popup
const recentNotifications = [
  {
    id: "1",
    title: "Task Reminder",
    message: "Your task 'Create marketing presentation' is due tomorrow",
    time: "10 min ago",
  },
  {
    id: "2",
    title: "Task Completed",
    message: "Task 'Update website content' was marked as completed",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "New Task Assigned",
    message: "You've been assigned a new task: 'Review Q2 reports'",
    time: "3 hours ago",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { openNotifications } = useNotifications()
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Unread notification count - in a real app, this would come from useNotifications()
  const unreadCount = 3

  // Helper function to get the theme icon
  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-5 w-5" />
    if (theme === "light") return <Sun className="h-5 w-5" />
    return <Laptop className="h-5 w-5" />
  }

  // Toggle through themes
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setActivePopover(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "relative h-full bg-muted/40 border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <div className="flex flex-col h-full py-4">
          {/* Logo and name */}
          <div className="px-3 mb-2 flex items-center">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            {!isCollapsed && (
              <h2 className="ml-2 text-lg font-switzer font-semibold truncate">
                nexu<span className="text-secondary">.sphere</span>
              </h2>
            )}
          </div>

          <Separator className="my-4" />

          {/* Quick actions row */}
          <div className={cn("px-3 mb-6", !isCollapsed ? "flex" : "")}>
            <TooltipProvider>
              {!isCollapsed ? (
                <div className="grid grid-cols-5 w-full gap-1">
                  <Button
                    className="col-span-3 bg-secondary hover:bg-secondary/90 text-white"
                    onClick={() => setCreateTaskOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                  <Button variant="outline" size="icon" onClick={openNotifications} className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {getThemeIcon()}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full bg-secondary hover:bg-secondary/90 text-white"
                        size="icon"
                        onClick={() => setCreateTaskOpen(true)}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">New Task</TooltipContent>
                  </Tooltip>

                  <Popover open={activePopover === "notifications"} onOpenChange={() => {}}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative"
                        onMouseEnter={() => setActivePopover("notifications")}
                        onMouseLeave={() => setActivePopover(null)}
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-80 p-0"
                      onMouseEnter={() => setActivePopover("notifications")}
                      onMouseLeave={() => setActivePopover(null)}
                    >
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-medium">Recent Notifications</h3>
                        <Badge variant="secondary" className="ml-2">
                          {unreadCount} new
                        </Badge>
                      </div>
                      <div className="max-h-[300px] overflow-auto">
                        {recentNotifications.map((notification) => (
                          <div key={notification.id} className="p-3 border-b hover:bg-muted/50">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 flex justify-end border-t">
                        <Button variant="ghost" size="sm" onClick={openNotifications}>
                          View All
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={toggleTheme}>
                        {getThemeIcon()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {theme === "light" ? "Light Mode" : theme === "dark" ? "Dark Mode" : "System Mode"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </TooltipProvider>
          </div>

          {/* Main navigation */}
          <div className="space-y-1 px-3">
            <TooltipProvider>
              {routes.map((route) => (
                <div key={route.href} className="relative">
                  {isCollapsed ? (
                    <Popover open={activePopover === route.href} onOpenChange={() => {}}>
                      <PopoverTrigger asChild>
                        <Link
                          href={route.href}
                          className={cn(
                            "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                            pathname === route.href ? "text-secondary bg-secondary/10" : "text-muted-foreground",
                            "justify-center px-0",
                          )}
                          onMouseEnter={() => setActivePopover(route.href)}
                          onMouseLeave={() => setActivePopover(null)}
                        >
                          <route.icon className={cn("h-5 w-5", route.color)} />
                        </Link>
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="p-0 w-40"
                        onMouseEnter={() => setActivePopover(route.href)}
                        onMouseLeave={() => setActivePopover(null)}
                      >
                        <Link
                          href={route.href}
                          className={cn(
                            "flex items-center rounded-lg py-2 px-4 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                            pathname === route.href ? "text-secondary bg-secondary/10" : "text-foreground",
                          )}
                        >
                          <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
                          {route.label}
                        </Link>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                        pathname === route.href ? "text-secondary bg-secondary/10" : "text-muted-foreground",
                        "px-3",
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      <span className="ml-3">{route.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </TooltipProvider>
          </div>

          {/* Bottom navigation */}
          <div className="mt-auto space-y-1 px-3">
            <TooltipProvider>
              {bottomRoutes.map((route) => (
                <div key={route.href} className="relative">
                  {isCollapsed ? (
                    <Popover open={activePopover === route.href} onOpenChange={() => {}}>
                      <PopoverTrigger asChild>
                        <Link
                          href={route.href}
                          className={cn(
                            "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                            pathname === route.href ? "text-secondary bg-secondary/10" : "text-muted-foreground",
                            "justify-center px-0",
                          )}
                          onMouseEnter={() => setActivePopover(route.href)}
                          onMouseLeave={() => setActivePopover(null)}
                        >
                          <route.icon className={cn("h-5 w-5", route.color)} />
                        </Link>
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="p-0 w-40"
                        onMouseEnter={() => setActivePopover(route.href)}
                        onMouseLeave={() => setActivePopover(null)}
                      >
                        <Link
                          href={route.href}
                          className={cn(
                            "flex items-center rounded-lg py-2 px-4 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                            pathname === route.href ? "text-secondary bg-secondary/10" : "text-foreground",
                          )}
                        >
                          <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
                          {route.label}
                        </Link>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:text-secondary hover:bg-secondary/10",
                        pathname === route.href ? "text-secondary bg-secondary/10" : "text-muted-foreground",
                        "px-3",
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      <span className="ml-3">{route.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </>
  )
}
