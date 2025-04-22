"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
} from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Filter, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

// Sample task data
const initialTasks = [
  {
    id: "TASK-001",
    title: "Create marketing presentation",
    status: "done",
    priority: "medium",
    dueDate: "2023-04-28",
  },
  {
    id: "TASK-002",
    title: "Review Q1 financial reports",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-04-30",
  },
  {
    id: "TASK-003",
    title: "Update website content",
    status: "not-started",
    priority: "low",
    dueDate: "2023-05-05",
  },
  {
    id: "TASK-004",
    title: "Prepare for client meeting",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2023-04-29",
  },
  {
    id: "TASK-005",
    title: "Research competitors",
    status: "not-started",
    priority: "medium",
    dueDate: "2023-05-10",
  },
  {
    id: "TASK-006",
    title: "Plan team building event",
    status: "not-started",
    priority: "low",
    dueDate: "2023-05-15",
  },
]

const statusOptions = [
  { label: "Not Started", value: "not-started" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
]

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
]

// Property visibility options
const propertyOptions = [
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
]

export function Calendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const [visibleProperties, setVisibleProperties] = useState<string[]>(["status", "priority"])
  const [taskItems, setTaskItems] = useState([...initialTasks])

  // Get days in the current view
  const getViewDays = () => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const firstDay = startOfWeek(monthStart)
      const lastDay = endOfWeek(monthEnd)
      return eachDayOfInterval({ start: firstDay, end: lastDay })
    } else {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    }
  }

  const viewDays = getViewDays()

  // Navigate to task detail page
  const navigateToTask = (taskId: string) => {
    router.push(`/task/${taskId}`)
  }

  // Filter tasks
  const filteredTasks = taskItems.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(task.status)

    // Priority filter
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(task.priority)

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Navigation functions
  const prevView = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const nextView = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return filteredTasks.filter((task) => {
      const taskDate = parseISO(task.dueDate)
      return isSameDay(taskDate, day)
    })
  }

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const sourceDate = new Date(source.droppableId)
    const destDate = new Date(destination.droppableId)

    if (isSameDay(sourceDate, destDate)) return

    const updatedTasks = taskItems.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          dueDate: format(destDate, "yyyy-MM-dd"),
        }
      }
      return task
    })

    setTaskItems(updatedTasks)
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const togglePriorityFilter = (priority: string) => {
    setPriorityFilters((prev) => (prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]))
  }

  const togglePropertyVisibility = (property: string) => {
    setVisibleProperties((prev) => (prev.includes(property) ? prev.filter((p) => p !== property) : [...prev, property]))
  }

  const isPropertyVisible = (property: string) => visibleProperties.includes(property)

  const currentMonth = format(currentDate, "MMMM")
  const currentYear = format(currentDate, "yyyy")

  return (
    <div className="space-y-4">
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
        <p className="text-muted-foreground">
          Here's a list of your tasks for {currentMonth} {currentYear}.
        </p>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search a task"
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {statusFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={statusFilters.includes(option.value)}
                      onCheckedChange={() => toggleStatusFilter(option.value)}
                    />
                    <label
                      htmlFor={`status-${option.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Priority
                {priorityFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {priorityFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${option.value}`}
                      checked={priorityFilters.includes(option.value)}
                      onCheckedChange={() => togglePriorityFilter(option.value)}
                    />
                    <label
                      htmlFor={`priority-${option.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Properties
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                {propertyOptions.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <label
                      htmlFor={`property-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                    <Switch
                      id={`property-${option.id}`}
                      checked={isPropertyVisible(option.id)}
                      onCheckedChange={() => togglePropertyVisibility(option.id)}
                    />
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>{format(currentDate, viewMode === "month" ? "MMMM yyyy" : "'Week of' MMM d, yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "month" | "week")}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" onClick={prevView}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextView}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-medium text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {viewDays.map((day) => {
                const dayTasks = getTasksForDay(day)
                const isToday = isSameDay(day, new Date())
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentDate)

                return (
                  <Droppable key={day.toString()} droppableId={day.toISOString()}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "h-24 p-1 border rounded-md overflow-hidden cursor-pointer hover:border-primary/50 transition-colors",
                          isToday && "border-primary/50 bg-primary/5",
                          isSelected && "ring-2 ring-primary ring-offset-2",
                          !isCurrentMonth && viewMode === "month" && "opacity-50",
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="flex justify-between items-start">
                          <span className={cn("text-sm font-medium", isToday && "text-primary")}>
                            {format(day, "d")}
                          </span>
                          {dayTasks.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {dayTasks.length}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 space-y-1 overflow-hidden">
                          {dayTasks.slice(0, 2).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "text-xs truncate rounded px-1 py-0.5",
                                    task.priority === "low" && "bg-green-100 text-green-800",
                                    task.priority === "medium" && "bg-yellow-100 text-yellow-800",
                                    task.priority === "high" && "bg-orange-100 text-orange-800",
                                    task.priority === "urgent" && "bg-red-100 text-red-800",
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigateToTask(task.id)
                                  }}
                                >
                                  <div className="font-mono text-[10px] text-muted-foreground">{task.id}</div>
                                  <div className="font-medium truncate">{task.title}</div>
                                  {isPropertyVisible("status") && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] px-1 py-0",
                                          task.status === "done" && "border-green-500 text-green-700",
                                          task.status === "in-progress" && "border-blue-500 text-blue-700",
                                          task.status === "not-started" && "border-gray-500 text-gray-700",
                                        )}
                                      >
                                        {task.status === "done" && "Done"}
                                        {task.status === "in-progress" && "In Progress"}
                                        {task.status === "not-started" && "Not Started"}
                                      </Badge>
                                    </div>
                                  )}
                                  {isPropertyVisible("priority") && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Badge
                                        className={cn(
                                          "text-[10px] px-1 py-0",
                                          task.priority === "low" && "bg-green-100 text-green-800",
                                          task.priority === "medium" && "bg-yellow-100 text-yellow-800",
                                          task.priority === "high" && "bg-orange-100 text-orange-800",
                                          task.priority === "urgent" && "bg-red-100 text-red-800",
                                        )}
                                      >
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-muted-foreground px-1">+{dayTasks.length - 2} more</div>
                          )}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              })}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Selected date tasks */}
      {getTasksForDay(selectedDate).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getTasksForDay(selectedDate).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigateToTask(task.id)}
                >
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{task.id}</div>
                    <div className="font-medium">{task.title}</div>
                    {isPropertyVisible("status") && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            task.status === "done" && "border-green-500 text-green-700",
                            task.status === "in-progress" && "border-blue-500 text-blue-700",
                            task.status === "not-started" && "border-gray-500 text-gray-700",
                          )}
                        >
                          {task.status === "done" && "Completed"}
                          {task.status === "in-progress" && "In Progress"}
                          {task.status === "not-started" && "Not Started"}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {isPropertyVisible("priority") && (
                    <Badge
                      className={cn(
                        task.priority === "low" && "bg-green-100 hover:bg-green-100 text-green-800",
                        task.priority === "medium" && "bg-yellow-100 hover:bg-yellow-100 text-yellow-800",
                        task.priority === "high" && "bg-orange-100 hover:bg-orange-100 text-orange-800",
                        task.priority === "urgent" && "bg-red-100 hover:bg-red-100 text-red-800",
                      )}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
