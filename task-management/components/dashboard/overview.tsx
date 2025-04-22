"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    total: 5,
    completed: 3,
  },
  {
    name: "Feb",
    total: 8,
    completed: 5,
  },
  {
    name: "Mar",
    total: 12,
    completed: 7,
  },
  {
    name: "Apr",
    total: 10,
    completed: 8,
  },
  {
    name: "May",
    total: 15,
    completed: 10,
  },
  {
    name: "Jun",
    total: 18,
    completed: 12,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Total Tasks" />
        <Bar dataKey="completed" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Completed" />
      </BarChart>
    </ResponsiveContainer>
  )
}
