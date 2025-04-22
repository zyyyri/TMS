"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns"

// Sample task data with start and end dates
const tasks = [
  {
    id: "TASK-8782",
    title: "Create marketing presentation",
    status: "done",
    priority: "medium",
    startDate: "2023-04-25",
    endDate: "2023-04-28",
  },
  {
    id: "TASK-7878",
    title: "Review Q1 financial reports",
    status: "in-progress",
    priority: "high",
    startDate: "2023-04-27",
    endDate: "2023-04-30",
  },
  {
    id: "TASK-7839",
    title: "Update website content",
    status: "not-started",
    priority: "low",
    startDate: "2023-05-02",
    endDate: "2023-05-05",
  },
  {
    id: "TASK-8123",
    title: "Prepare for client meeting",
    status: "in-progress",
    priority: "urgent",
    startDate: "2023-04-28",
    endDate: "2023-04-29",
  },
  {
    id: "TASK-8456",
    title: "Research competitors",
    status: "not-started",
    priority: "medium",
    startDate: "2023-05-08",
    endDate: "2023-05-10",
  },
  {
    id: "TASK-8789",
    title: "Plan team building event",
    status: "not-started",
    priority: "low",
    startDate: "2023-05-12",
    endDate: "2023-05-15",
  },
]

// Format tasks for the Gantt chart
const formatTasksForGantt = (tasks: any[], timeRange: string) => {
  const today = new Date()
  let startDate, endDate

  // Set date range based on selected time range
  if (timeRange === "week") {
    startDate = startOfWeek(today)
    endDate = endOfWeek(today)
  } else if (timeRange === "month") {
    startDate = startOfMonth(today)
    endDate = endOfMonth(today)
  } else {
    startDate = startOfQuarter(today)
    endDate = endOfQuarter(today)
  }

  // Filter tasks that fall within the selected time range
  const filteredTasks = tasks.filter((task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    return taskStart <= endDate && taskEnd >= startDate
  })

  return filteredTasks.map((task, index) => ({
    name: task.title,
    id: task.id,
    start: new Date(task.startDate).getTime(),
    end: new Date(task.endDate).getTime(),
    status: task.status,
    priority: task.priority,
    y: index, // Position on the y-axis
  }))
}

// Custom tooltip for the Gantt chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <p className="font-medium">{data.name}</p>
        <p>Start: {new Date(data.start).toLocaleDateString()}</p>
        <p>End: {new Date(data.end).toLocaleDateString()}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            className={cn(
              data.priority === "low" && "bg-green-100 hover:bg-green-100 text-green-800",
              data.priority === "medium" && "bg-yellow-100 hover:bg-yellow-100 text-yellow-800",
              data.priority === "high" && "bg-orange-100 hover:bg-orange-100 text-orange-800",
              data.priority === "urgent" && "bg-red-100 hover:bg-red-100 text-red-800",
            )}
          >
            {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              data.status === "done" && "border-green-500 text-green-700",
              data.status === "in-progress" && "border-blue-500 text-blue-700",
              data.status === "not-started" && "border-gray-500 text-gray-700",
            )}
          >
            {data.status === "done" && "Completed"}
            {data.status === "in-progress" && "In Progress"}
            {data.status === "not-started" && "Not Started"}
          </Badge>
        </div>
      </div>
    )
  }
  return null
}

export function Timeline() {
  const [timeRange, setTimeRange] = useState("month")
  const ganttData = formatTasksForGantt(tasks, timeRange)

  // Get today's date for the reference line
  const today = new Date().getTime()

  // Generate date ticks for the x-axis based on the selected time range
  const generateDateTicks = () => {
    const today = new Date()
    const ticks = []
    let startDate, endDate, increment

    if (timeRange === "week") {
      startDate = startOfWeek(today)
      endDate = endOfWeek(today)
      increment = 1 // 1 day
    } else if (timeRange === "month") {
      startDate = startOfMonth(today)
      endDate = endOfMonth(today)
      increment = 2 // Every 2 days
    } else {
      startDate = startOfQuarter(today)
      endDate = endOfQuarter(today)
      increment = 7 // Every week
    }

    let currentDate = startDate
    while (currentDate <= endDate) {
      ticks.push(currentDate.getTime())
      currentDate = addDays(currentDate, increment)
    }

    return ticks
  }

  const dateTicks = generateDateTicks()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Timeline</CardTitle>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ganttData}
              layout="vertical"
              barSize={20}
              margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
            >
              <XAxis
                type="number"
                dataKey="start"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) => format(new Date(tick), "MMM dd")}
                ticks={dateTicks}
              />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={today} stroke="#6D28D9" label={{ value: "Today", position: "top", fill: "#6D28D9" }} />
              <Bar
                dataKey="end"
                fill="#3b82f6"
                minPointSize={2}
                background={{ fill: "#eee" }}
                // Custom shape to create a Gantt bar
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props
                  const start = payload.start
                  const end = payload.end
                  const barWidth = end - start

                  // Color based on status
                  let fill = "#94a3b8" // Not started (gray)
                  if (payload.status === "done") {
                    fill = "#22c55e" // Done (green)
                  } else if (payload.status === "in-progress") {
                    fill = "#3b82f6" // In progress (blue)
                  }

                  // Color based on priority
                  let strokeColor = "#94a3b8" // Default
                  if (payload.priority === "urgent") {
                    strokeColor = "#ef4444" // Red for urgent
                    fill = payload.status === "done" ? "#22c55e" : "#ef4444"
                  } else if (payload.priority === "high") {
                    strokeColor = "#f97316" // Orange for high
                  }

                  return (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill={fill}
                      stroke={strokeColor}
                      strokeWidth={payload.priority === "urgent" || payload.priority === "high" ? 2 : 0}
                      rx={4}
                      ry={4}
                    />
                  )
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
            <span className="text-xs">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div>
            <span className="text-xs">Not Started</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-[#ef4444]"></div>
            <span className="text-xs">Urgent Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
