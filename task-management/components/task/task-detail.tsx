"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, Trash, Maximize2, Minimize2, Archive } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TaskEditor } from "@/components/task/task-editor"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Mock task data
const task = {
  id: "TASK-8782",
  title: "Create marketing presentation",
  status: "in-progress",
  priority: "medium",
  dueDate: new Date("2023-04-28"),
  dueTime: "14:00",
  reminder: true,
  description: "Prepare slides for the upcoming marketing meeting",
  attachments: [
    { name: "marketing-brief.pdf", url: "#" },
    { name: "brand-guidelines.pdf", url: "#" },
  ],
  urls: [
    { title: "Brand Website", url: "https://example.com" },
    { title: "Competitor Analysis", url: "https://example.com/analysis" },
  ],
  tags: ["Marketing", "Presentation", "Q2"],
}

interface TaskDetailProps {
  id: string
}

export function TaskDetail({ id }: TaskDetailProps) {
  const [taskData, setTaskData] = useState(task)
  const [date, setDate] = useState<Date | undefined>(taskData.dueDate)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  const handleClose = () => {
    setIsDialogOpen(false)
    // In a real app, you would navigate back or handle the close action
  }

  const TaskDetailContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={taskData.status}
              onValueChange={(value) => setTaskData({ ...taskData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              defaultValue={taskData.priority}
              onValueChange={(value) => setTaskData({ ...taskData, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>

              <Select defaultValue={taskData.dueTime}>
                <SelectTrigger className="w-[120px]">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="reminder"
              checked={taskData.reminder}
              onCheckedChange={(checked) => setTaskData({ ...taskData, reminder: checked })}
            />
            <Label htmlFor="reminder">Set reminder</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a short description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {taskData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm">{attachment.name}</div>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add File
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">URLs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {taskData.urls.map((url, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm">{url.title}</div>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add URL
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {taskData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {tag}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a tag" className="flex-1" />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-base">Task Content</Label>
        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <TaskEditor />
          </TabsContent>
          <TabsContent value="preview">
            <div className="border rounded-md p-4 min-h-[300px]">
              <h3 className="text-lg font-medium mb-2">Marketing Presentation</h3>
              <p className="mb-4">This presentation should cover the following topics:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Q1 Performance Review</li>
                <li>New Product Launch Strategy</li>
                <li>Competitive Analysis</li>
                <li>Q2 Marketing Goals</li>
              </ul>
              <p>The presentation should be ready by April 28th for the executive team review.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="bg-secondary hover:bg-secondary/90 text-white">Save</Button>
      </div>
    </div>
  )

  if (isFullScreen) {
    return (
      <div className="p-6">
        <TaskDetailContent />
      </div>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <TaskDetailContent />
      </DialogContent>
    </Dialog>
  )
}
