"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: string
    dueDate: string
  }
  showProperties: string[]
  onClick?: () => void
}

export function TaskCard({ task, showProperties, onClick }: TaskCardProps) {
  const router = useRouter()
  const isPropertyVisible = (property: string) => showProperties.includes(property)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClick) {
      onClick()
    } else {
      router.push(`/task/${task.id}`)
    }
  }

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={handleClick}>
      <CardContent className="p-3">
        <div className="space-y-2">
          {isPropertyVisible("id") && <div className="font-mono text-xs text-muted-foreground">{task.id}</div>}
          <h3 className="font-medium">{task.title}</h3>
          {isPropertyVisible("description") && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        {isPropertyVisible("dueDate") && (
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
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
        {!isPropertyVisible("priority") && !isPropertyVisible("dueDate") && <div></div>}
      </CardFooter>
    </Card>
  )
}
