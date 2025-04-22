"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

const initialTasks = [
  {
    id: "TASK-001",
    title: "Create marketing presentation",
    status: "done",
    priority: "medium",
    dueDate: "2023-04-28",
    description: "Prepare slides for the upcoming marketing meeting",
  },
  {
    id: "TASK-002",
    title: "Review Q1 financial reports",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-04-30",
    description: "Analyze Q1 performance and prepare summary",
  },
  {
    id: "TASK-003",
    title: "Update website content",
    status: "not-started",
    priority: "low",
    dueDate: "2023-05-05",
    description: "Refresh the product descriptions and add new testimonials",
  },
  {
    id: "TASK-004",
    title: "Prepare for client meeting",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2023-04-29",
    description: "Gather materials and prepare agenda for the client call",
  },
  {
    id: "TASK-005",
    title: "Research competitors",
    status: "not-started",
    priority: "medium",
    dueDate: "2023-05-10",
    description: "Analyze top 3 competitors and their recent product updates",
  },
  {
    id: "TASK-006",
    title: "Plan team building event",
    status: "not-started",
    priority: "low",
    dueDate: "2023-05-15",
    description: "Research venues and activities for the quarterly team event",
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
  { id: "dueDate", label: "Due Date" },
  { id: "description", label: "Description" },
]

export function TaskList() {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const [visibleProperties, setVisibleProperties] = useState<string[]>(["status", "priority", "dueDate", "description"])
  const [taskItems, setTaskItems] = useState([...initialTasks])

  // Navigate to task detail page
  const navigateToTask = (taskId: string) => {
    router.push(`/task/${taskId}`)
  }

  // Reset tasks to initial state when filters change
  useEffect(() => {
    // Sort the tasks based on current sort settings
    const sorted = [...initialTasks]
    if (sortColumn) {
      sorted.sort((a, b) => {
        const aValue = a[sortColumn as keyof typeof a]
        const bValue = b[sortColumn as keyof typeof b]

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : 1
        } else {
          return aValue > bValue ? -1 : 1
        }
      })
    }

    setTaskItems(sorted)
  }, [sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredTasks = taskItems.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(task.status)

    // Priority filter
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(task.priority)

    return matchesSearch && matchesStatus && matchesPriority
  })

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(taskItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTaskItems(items)
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

  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const currentYear = new Date().getFullYear()

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

          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-medium"
                    onClick={() => handleSort("title")}
                  >
                    Name
                    {renderSortIcon("title")}
                  </Button>
                </TableHead>
                {isPropertyVisible("status") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 font-medium"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {renderSortIcon("status")}
                    </Button>
                  </TableHead>
                )}
                {isPropertyVisible("priority") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 font-medium"
                      onClick={() => handleSort("priority")}
                    >
                      Priority
                      {renderSortIcon("priority")}
                    </Button>
                  </TableHead>
                )}
                {isPropertyVisible("dueDate") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 font-medium"
                      onClick={() => handleSort("dueDate")}
                    >
                      Deadline
                      {renderSortIcon("dueDate")}
                    </Button>
                  </TableHead>
                )}
                {isPropertyVisible("description") && <TableHead>Description</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <Droppable droppableId="tasks" type="task-list">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigateToTask(task.id)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox id={`select-${task.id}`} />
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{task.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{task.title}</div>
                          </TableCell>
                          {isPropertyVisible("status") && (
                            <TableCell>
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
                            </TableCell>
                          )}
                          {isPropertyVisible("priority") && (
                            <TableCell>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  task.priority === "low" && "bg-green-100 hover:bg-green-100 text-green-800",
                                  task.priority === "medium" && "bg-yellow-100 hover:bg-yellow-100 text-yellow-800",
                                  task.priority === "high" && "bg-orange-100 hover:bg-orange-100 text-orange-800",
                                  task.priority === "urgent" && "bg-red-100 hover:bg-red-100 text-red-800",
                                )}
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            </TableCell>
                          )}
                          {isPropertyVisible("dueDate") && (
                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                          )}
                          {isPropertyVisible("description") && (
                            <TableCell className="max-w-[300px] truncate">{task.description}</TableCell>
                          )}
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </div>
      </DragDropContext>
    </div>
  )
}
