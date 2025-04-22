import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-switzer">Help Center</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about using nexu.sphere</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a new task?</AccordionTrigger>
                <AccordionContent>
                  You can create a new task by clicking the "New Task" button in the sidebar. This will open a dialog
                  where you can enter task details like title, description, deadline, and more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I change the view of my tasks?</AccordionTrigger>
                <AccordionContent>
                  nexu.sphere offers multiple views for your tasks. You can switch between Dashboard, Calendar, List,
                  and Kanban views using the navigation links in the sidebar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I customize the appearance?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can switch between Light, Dark, and System themes using the appearance button in the sidebar.
                  More customization options are available in the Settings page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I set task reminders?</AccordionTrigger>
                <AccordionContent>
                  When creating or editing a task, you can enable reminders by toggling the "Set reminder" switch.
                  You'll receive notifications based on your notification settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I organize tasks in the Kanban board?</AccordionTrigger>
                <AccordionContent>
                  In the Kanban view, you can drag and drop tasks between columns to change their status. You can also
                  archive completed tasks by using the menu on each task card.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Need more help? Reach out to our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you can't find the answer to your question in our FAQ, please contact our support team. We're here to
              help!
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-24">Email:</span>
                <span>support@nexusphere.com</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Phone:</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Hours:</span>
                <span>Monday - Friday, 9am - 5pm EST</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Tutorials</CardTitle>
          <CardDescription>Learn how to use nexu.sphere with these helpful videos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Getting Started Video</span>
              </div>
              <h3 className="font-medium">Getting Started with nexu.sphere</h3>
              <p className="text-sm text-muted-foreground">Learn the basics of task management with nexu.sphere</p>
            </div>
            <div className="space-y-2">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Advanced Features Video</span>
              </div>
              <h3 className="font-medium">Advanced Task Management</h3>
              <p className="text-sm text-muted-foreground">Discover powerful features for power users</p>
            </div>
            <div className="space-y-2">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Customization Video</span>
              </div>
              <h3 className="font-medium">Customizing Your Workspace</h3>
              <p className="text-sm text-muted-foreground">Learn how to personalize nexu.sphere to fit your workflow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
