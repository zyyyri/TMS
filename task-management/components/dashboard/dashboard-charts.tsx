"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Color constants - strictly electric indigo and green
const ELECTRIC_INDIGO = "#6D28D9" // Secondary color
const ELECTRIC_GREEN = "#20F40D" // Accent color
const ELECTRIC_INDIGO_LIGHT = "rgba(109, 40, 217, 0.7)" // Secondary color with opacity
const ELECTRIC_GREEN_LIGHT = "rgba(32, 244, 13, 0.7)" // Accent color with opacity

// Sample data for monthly task status
const monthlyStatusData = [
  { month: "Jan", notStarted: 5, inProgress: 3, completed: 8 },
  { month: "Feb", notStarted: 7, inProgress: 5, completed: 10 },
  { month: "Mar", notStarted: 4, inProgress: 8, completed: 12 },
  { month: "Apr", notStarted: 6, inProgress: 9, completed: 15 },
  { month: "May", notStarted: 8, inProgress: 7, completed: 14 },
  { month: "Jun", notStarted: 5, inProgress: 10, completed: 18 },
]

// Sample data for completed tasks trend
const completedTasksData = [
  { month: "Jan", tasks: 8, efficiency: 60 },
  { month: "Feb", tasks: 10, efficiency: 65 },
  { month: "Mar", tasks: 12, efficiency: 70 },
  { month: "Apr", tasks: 15, efficiency: 75 },
  { month: "May", tasks: 14, efficiency: 72 },
  { month: "Jun", tasks: 18, efficiency: 80 },
]

// Sample data for task status
const statusData = [
  { name: "Not Started", value: 15, color: ELECTRIC_INDIGO_LIGHT },
  { name: "In Progress", value: 25, color: ELECTRIC_INDIGO },
  { name: "Completed", value: 45, color: ELECTRIC_GREEN },
]

// Sample data for priority distribution
const priorityData = [
  { name: "Low", value: 20, fill: ELECTRIC_GREEN },
  { name: "Medium", value: 35, fill: ELECTRIC_GREEN_LIGHT },
  { name: "High", value: 30, fill: ELECTRIC_INDIGO },
  { name: "Urgent", value: 15, fill: ELECTRIC_INDIGO_LIGHT },
]

// Custom tooltip for the bar chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></div>
            <span>{entry.name}: </span>
            <span className="font-medium">{entry.value} tasks</span>
          </div>
        ))}
        <div className="mt-1 pt-1 border-t">
          <div className="flex items-center gap-2">
            <span>Total: </span>
            <span className="font-medium">{payload.reduce((sum, entry) => sum + entry.value, 0)} tasks</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

// Custom tooltip for the line chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.stroke }}></div>
            <span>{entry.name}: </span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Custom tooltip for the pie chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.color }}></div>
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Tasks:</span>
          <span className="font-medium">{data.value}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Percentage:</span>
          <span className="font-medium">{(data.percent * 100).toFixed(0)}%</span>
        </div>
      </div>
    )
  }
  return null
}

// Custom tooltip for the radial chart
const CustomRadialTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.fill }}></div>
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Tasks:</span>
          <span className="font-medium">{data.value}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Percentage:</span>
          <span className="font-medium">{((data.value / 100) * 100).toFixed(0)}%</span>
        </div>
      </div>
    )
  }
  return null
}

// Chart configuration options
const xAxisOptions = [
  { value: "month", label: "Month" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
]

const yAxisOptions = [
  { value: "count", label: "Count" },
  { value: "percentage", label: "Percentage" },
]

export function DashboardCharts() {
  // State for each chart's axis selection
  const [barChartAxes, setBarChartAxes] = useState({ x: "month", y: "count" })
  const [lineChartAxes, setLineChartAxes] = useState({ x: "month", y: "count" })
  const [pieChartType, setPieChartType] = useState("status")
  const [radialChartType, setRadialChartType] = useState("priority")

  // Calculate total tasks
  const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>Monthly task status breakdown</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bar-x-axis" className="text-sm">
                  X:
                </Label>
                <Select
                  value={barChartAxes.x}
                  onValueChange={(value) => setBarChartAxes({ ...barChartAxes, x: value })}
                >
                  <SelectTrigger id="bar-x-axis" className="w-[100px] h-8">
                    <SelectValue placeholder="X" />
                  </SelectTrigger>
                  <SelectContent>
                    {xAxisOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="bar-y-axis" className="text-sm">
                  Y:
                </Label>
                <Select
                  value={barChartAxes.y}
                  onValueChange={(value) => setBarChartAxes({ ...barChartAxes, y: value })}
                >
                  <SelectTrigger id="bar-y-axis" className="w-[100px] h-8">
                    <SelectValue placeholder="Y" />
                  </SelectTrigger>
                  <SelectContent>
                    {yAxisOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar dataKey="notStarted" name="Not Started" stackId="a" fill={ELECTRIC_INDIGO_LIGHT} />
              <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={ELECTRIC_INDIGO} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill={ELECTRIC_GREEN} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Completion Trend</CardTitle>
              <CardDescription>Tasks completed and efficiency over time</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="line-x-axis" className="text-sm">
                  X:
                </Label>
                <Select
                  value={lineChartAxes.x}
                  onValueChange={(value) => setLineChartAxes({ ...lineChartAxes, x: value })}
                >
                  <SelectTrigger id="line-x-axis" className="w-[100px] h-8">
                    <SelectValue placeholder="X" />
                  </SelectTrigger>
                  <SelectContent>
                    {xAxisOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="line-y-axis" className="text-sm">
                  Y:
                </Label>
                <Select
                  value={lineChartAxes.y}
                  onValueChange={(value) => setLineChartAxes({ ...lineChartAxes, y: value })}
                >
                  <SelectTrigger id="line-y-axis" className="w-[100px] h-8">
                    <SelectValue placeholder="Y" />
                  </SelectTrigger>
                  <SelectContent>
                    {yAxisOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completedTasksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomLineTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tasks"
                name="Tasks Completed"
                stroke={ELECTRIC_INDIGO}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                name="Efficiency (%)"
                stroke={ELECTRIC_GREEN}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Status</CardTitle>
              <CardDescription>Current distribution by status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pie-type" className="text-sm">
                Type:
              </Label>
              <Select value={pieChartType} onValueChange={setPieChartType}>
                <SelectTrigger id="pie-type" className="w-[100px] h-8">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartType === "status" ? statusData : priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {(pieChartType === "status" ? statusData : priorityData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
              {/* Center text showing total */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-5" className="text-lg font-medium">
                  {totalTasks}
                </tspan>
                <tspan x="50%" dy="20" className="text-xs">
                  Total Tasks
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radial Chart (Full Circle) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks by priority level</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="radial-type" className="text-sm">
                Type:
              </Label>
              <Select value={radialChartType} onValueChange={setRadialChartType}>
                <SelectTrigger id="radial-type" className="w-[100px] h-8">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="80%"
              barSize={20}
              data={radialChartType === "priority" ? priorityData : statusData}
              startAngle={0}
              endAngle={360}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise={true}
                dataKey="value"
                cornerRadius={10}
                label={{ fill: "#666", position: "insideStart" }}
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip content={<CustomRadialTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
