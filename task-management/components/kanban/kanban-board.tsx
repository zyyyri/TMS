"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal, Archive, Search, Filter, SlidersHorizontal } from "lucide-react"
import { TaskCard } from "@/components/kanban/task-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

// Initial data for the kanban board
const initialData = {
  tasks: {
    "TASK-001": {
      id: "TASK-001",
      title: "Create marketing presentation",
      description: "Prepare slides for the upcoming marketing meeting",
      priority: "medium",
      dueDate: "2023-04-28",
    },
    "TASK-002": {
      id: "TASK-002",
      title: "Review Q1 financial reports",
      description: "Analyze Q1 performance and prepare summary",
      priority: "high",
      dueDate: "2023-04-30",
    },
    "TASK-003": {
      id: "TASK-003",
      title: "Update website content",
      description: "Refresh the product descriptions and add new testimonials",
      priority: "low",
      dueDate: "2023-05-05",
    },
    "TASK-004": {
      id: "TASK-004",
      title: "Prepare for client meeting",
      description: "Gather materials and prepare agenda for the client call",
      priority: "urgent",
      dueDate: "2023-04-29",
    },
    "TASK-005": {
      id: "TASK-005",
      title: "Research competitors",
      description: "Analyze top 3 competitors and their recent product updates",
      priority: "medium",
      dueDate: "2023-05-10",
    },
    "TASK-006": {
      id: "TASK-006",
      title: "Plan team building event",
      description: "Research venues and activities for the quarterly team event",
      priority: "low",
      dueDate: "2023-05-15",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Not Started",
      taskIds: ["TASK-003", "TASK-005", "TASK-006"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["TASK-002", "TASK-004"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["TASK-001"],
    },
    "column-4": {
      id: "column-4",
      title: "Archived",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
}

const statusOptions = [
  { label: "Not Started", value: "column-1" },
  { label: "In Progress", value: "column-2" },
  { label: "Done", value: "column-3" },
]

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
]

// Property visibility options
const propertyOptions = [
  { id: "id", label: "ID" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "dueDate", label: "Due Date" },
  { id: "description", label: "Description" },
]

export function KanbanBoard() {
  const router = useRouter()
  const [boardData, setBoardData] = useState(initialData)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const [visibleProperties, setVisibleProperties] = useState<string[]>(["id", "status", "priority", "description"])
  const { toast } = useToast()

  const navigateToTask = (taskId: string) => {
    router.push(`/task/${taskId}`)
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result

    // If there's no destination or if the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Handle column reordering
    if (type === "column") {
      const newColumnOrder = Array.from(boardData.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setBoardData({
        ...boardData,
        columnOrder: newColumnOrder,
      })
      return
    }

    const sourceColumn = boardData.columns[source.droppableId]
    const destColumn = boardData.columns[destination.droppableId]

    // Moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      }

      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      }

      setBoardData(newState)
      return
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(source.index, 1)
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    }

    const destTaskIds = Array.from(destColumn.taskIds)
    destTaskIds.splice(destination.index, 0, draggableId)
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    }

    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    }

    // Show toast notification when moving to Done column
    if (destColumn.id === "column-3" && sourceColumn.id !== "column-3") {
      toast({
        title: "Task completed",
        description: `"${boardData.tasks[draggableId].title}" marked as done`,
      })
    }

    setBoardData(newState)
  }

  const handleArchiveTask = (taskId: string) => {
    // Find which column contains the task
    let sourceColumnId = null
    for (const columnId in boardData.columns) {
      if (boardData.columns[columnId].taskIds.includes(taskId)) {
        sourceColumnId = columnId
        break
      }
    }

    if (!sourceColumnId) return

    // Remove task from source column
    const sourceColumn = boardData.columns[sourceColumnId]
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    const taskIndex = sourceTaskIds.indexOf(taskId)
    sourceTaskIds.splice(taskIndex, 1)

    // Add task to archive column
    const archiveColumn = boardData.columns["column-4"]
    const archiveTaskIds = Array.from(archiveColumn.taskIds)
    archiveTaskIds.push(taskId)

    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [sourceColumnId]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
        "column-4": {
          ...archiveColumn,
          taskIds: archiveTaskIds,
        },
      },
    }

    setBoardData(newState)

    toast({
      title: "Task archived",
      description: `"${boardData.tasks[taskId].title}" has been archived`,
    })
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

  // Filter tasks based on search and filters
  const getFilteredTasks = (columnId: string, taskIds: string[]) => {
    // Apply status filter
    if (statusFilters.length > 0 && !statusFilters.includes(columnId)) {
      return []
    }

    return taskIds.filter((taskId) => {
      const task = boardData.tasks[taskId]

      // Apply search filter
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase())

      // Apply priority filter
      const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(task.priority)

      return matchesSearch && matchesPriority
    })
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
        <p className="text-muted-foreground">
          Here's a list of your tasks for {currentMonth} {currentYear}.
        </p>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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

          <Button onClick={() => setCreateTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {boardData.columnOrder.map((columnId, index) => {
            const column = boardData.columns[columnId]
            const filteredTaskIds = getFilteredTasks(columnId, column.taskIds)
            const isArchiveColumn = columnId === "column-4"

            // Hide archive column by default if empty
            if (isArchiveColumn && filteredTaskIds.length === 0) {
              return null
            }

            return (
              <div key={column.id} className="flex flex-col h-full">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-switzer">
                        {column.title}
                        <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                          {filteredTaskIds.length}
                        </span>
                      </CardTitle>
                      {!isArchiveColumn && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setActiveColumn(column.id)
                            setCreateTaskOpen(true)
                          }}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <Droppable droppableId={column.id} type="task">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-4 min-h-[200px]"
                          style={{ height: "100%" }} // Fixed height container
                        >
                          {filteredTaskIds.map((taskId, index) => {
                            const task = boardData.tasks[taskId]
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="group"
                                    style={{
                                      ...provided.draggableProps.style,
                                      // Prevent the dragged item from shifting the entire board
                                      position: snapshot.isDragging ? "absolute" : "relative",
                                    }}
                                  >
                                    <div className="relative">
                                      <TaskCard
                                        task={task}
                                        showProperties={visibleProperties}
                                        onClick={() => navigateToTask(task.id)}
                                      />
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => console.log("Edit task", task.id)}>
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleArchiveTask(task.id)}>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archive
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    {!isArchiveColumn && (
                      <Button
                        variant="ghost"
                        className="w-full mt-4 justify-start"
                        size="sm"
                        onClick={() => {
                          setActiveColumn(column.id)
                          setCreateTaskOpen(true)
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </>
  )
}
