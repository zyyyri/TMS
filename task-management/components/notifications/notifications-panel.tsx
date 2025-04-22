"use client"

import { format } from "date-fns"
import { Bell, Check, CheckCheck } from "lucide-react"
import { useNotifications } from "@/components/notifications/notifications-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export function NotificationsPanel() {
  const { notifications, isOpen, closeNotifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } =
    useNotifications()

  return (
    <Sheet open={isOpen} onOpenChange={closeNotifications}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </SheetTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearNotifications}>
              Clear all
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">You're all caught up! No notifications to display.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-4 pr-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? "bg-background" : "bg-secondary/5 border-secondary/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 h-auto text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(notification.date, "MMM d, h:mm a")}
                      </span>
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0.5 h-auto text-xs ${
                          notification.type === "reminder"
                            ? "border-orange-500 text-orange-600"
                            : notification.type === "system"
                              ? "border-blue-500 text-blue-600"
                              : "border-green-500 text-green-600"
                        }`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
