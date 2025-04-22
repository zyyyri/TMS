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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Color constants - strictly using electric indigo and green
const ELECTRIC_INDIGO = "#6D28D9" // Secondary color
const ELECTRIC_GREEN = "#20F40D" // Accent color

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
  { name: "Not Started", value: 15, color: ELECTRIC_INDIGO, opacity: 0.7 },
  { name: "In Progress", value: 25, color: ELECTRIC_INDIGO },
  { name: "Completed", value: 45, color: ELECTRIC_GREEN },
]

// Sample data for priority distribution
const priorityData = [
  { name: "Low", value: 20, fill: ELECTRIC_GREEN },
  { name: "Medium", value: 35, fill: ELECTRIC_GREEN, opacity: 0.7 },
  { name: "High", value: 30, fill: ELECTRIC_INDIGO },
  { name: "Urgent", value: 15, fill: ELECTRIC_INDIGO, opacity: 0.7 },
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

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("month")
  const [chartView, setChartView] = useState("all")

  // Chart 1 - Bar Chart
  const [barXAxis, setBarXAxis] = useState("month")
  const [barYAxis, setBarYAxis] = useState("status")

  // Chart 2 - Line Chart
  const [lineXAxis, setLineXAxis] = useState("month")
  const [lineYAxis, setLineYAxis] = useState("tasks")

  // Chart 3 - Pie Chart
  const [pieDataType, setPieDataType] = useState("status")

  // Chart 4 - Radial Chart
  const [radialDataType, setRadialDataType] = useState("priority")

  // Calculate total tasks
  const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs value={chartView} onValueChange={setChartView} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Charts</TabsTrigger>
            <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
            <TabsTrigger value="trend">Completion Trend</TabsTrigger>
            <TabsTrigger value="status">Task Status</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        {(chartView === "all" || chartView === "distribution") && (
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
                    <Select value={barXAxis} onValueChange={setBarXAxis}>
                      <SelectTrigger id="bar-x-axis" className="w-[100px] h-8">
                        <SelectValue placeholder="X" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bar-y-axis" className="text-sm">
                      Y:
                    </Label>
                    <Select value={barYAxis} onValueChange={setBarYAxis}>
                      <SelectTrigger id="bar-y-axis" className="w-[100px] h-8">
                        <SelectValue placeholder="Y" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
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
                  <Bar dataKey="notStarted" name="Not Started" stackId="a" fill={ELECTRIC_INDIGO} fillOpacity={0.7} />
                  <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={ELECTRIC_INDIGO} />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill={ELECTRIC_GREEN} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Line Chart */}
        {(chartView === "all" || chartView === "trend") && (
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
                    <Select value={lineXAxis} onValueChange={setLineXAxis}>
                      <SelectTrigger id="line-x-axis" className="w-[100px] h-8">
                        <SelectValue placeholder="X" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="line-y-axis" className="text-sm">
                      Y:
                    </Label>
                    <Select value={lineYAxis} onValueChange={setLineYAxis}>
                      <SelectTrigger id="line-y-axis" className="w-[100px] h-8">
                        <SelectValue placeholder="Y" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tasks">Tasks</SelectItem>
                        <SelectItem value="efficiency">Efficiency</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
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
                  {(lineYAxis === "both" || lineYAxis === "efficiency") && (
                    <YAxis yAxisId="right" orientation="right" />
                  )}
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend />
                  {(lineYAxis === "both" || lineYAxis === "tasks") && (
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
                  )}
                  {(lineYAxis === "both" || lineYAxis === "efficiency") && (
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
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Pie Chart */}
        {(chartView === "all" || chartView === "status") && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Task Status</CardTitle>
                  <CardDescription>Current distribution by status</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pie-data-type" className="text-sm">
                      Data:
                    </Label>
                    <Select value={pieDataType} onValueChange={setPieDataType}>
                      <SelectTrigger id="pie-data-type" className="w-[100px] h-8">
                        <SelectValue placeholder="Data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataType === "status" ? statusData : priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {(pieDataType === "status" ? statusData : priorityData).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || entry.fill}
                        fillOpacity={entry.opacity !== undefined ? entry.opacity : 1}
                      />
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
        )}

        {/* Radial Chart */}
        {(chartView === "all" || chartView === "priority") && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Tasks by priority level</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="radial-data-type" className="text-sm">
                      Data:
                    </Label>
                    <Select value={radialDataType} onValueChange={setRadialDataType}>
                      <SelectTrigger id="radial-data-type" className="w-[100px] h-8">
                        <SelectValue placeholder="Data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  data={radialDataType === "priority" ? priorityData : statusData}
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
        )}
      </div>
    </div>
  )
}
