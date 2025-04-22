"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "@/components/ui/chart"

const data = [
  { name: "Low", value: 8, color: "#22c55e" },
  { name: "Medium", value: 10, color: "#eab308" },
  { name: "High", value: 4, color: "#f97316" },
  { name: "Urgent", value: 2, color: "#ef4444" },
]

export function TasksByPriority() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
