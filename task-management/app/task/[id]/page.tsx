import { TaskDetail } from "@/components/task/task-detail"

export default function TaskPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <TaskDetail id={params.id} />
    </div>
  )
}
