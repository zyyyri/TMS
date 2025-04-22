import { CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const tasks = [
  {
    id: "TASK-8782",
    title: "Create marketing presentation",
    status: "done",
    priority: "medium",
    dueDate: "2023-04-28",
  },
  {
    id: "TASK-7878",
    title: "Review Q1 financial reports",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-04-30",
  },
  {
    id: "TASK-7839",
    title: "Update website content",
    status: "not-started",
    priority: "low",
    dueDate: "2023-05-05",
  },
  {
    id: "TASK-8123",
    title: "Prepare for client meeting",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2023-04-29",
  },
]

export function RecentTasks() {
  return (
    <div className="space-y-8">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{task.title}</p>
            <div className="flex items-center pt-2">
              {task.status === "done" && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                  <span>Completed</span>
                </div>
              )}
              {task.status === "in-progress" && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3 text-blue-500" />
                  <span>In Progress</span>
                </div>
              )}
              {task.status === "not-started" && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3 text-gray-500" />
                  <span>Not Started</span>
                </div>
              )}
              <div
                className={cn(
                  "ml-4 text-xs px-2 py-0.5 rounded-full",
                  task.priority === "low" && "bg-green-100 text-green-800",
                  task.priority === "medium" && "bg-yellow-100 text-yellow-800",
                  task.priority === "high" && "bg-orange-100 text-orange-800",
                  task.priority === "urgent" && "bg-red-100 text-red-800",
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
