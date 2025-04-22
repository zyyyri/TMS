"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { NotificationsPanel } from "@/components/notifications/notifications-panel"

type Notification = {
  id: string
  title: string
  message: string
  date: Date
  read: boolean
  type: "reminder" | "system" | "update"
}

type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  openNotifications: () => void
  closeNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  clearNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task Reminder",
      message: "Your task 'Create marketing presentation' is due tomorrow",
      date: new Date(),
      read: false,
      type: "reminder",
    },
    {
      id: "2",
      title: "Welcome to nexu.sphere",
      message: "Thank you for using our task management system",
      date: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      type: "system",
    },
  ])
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const openNotifications = useCallback(() => setIsOpen(true), [])
  const closeNotifications = useCallback(() => setIsOpen(false), [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "date" | "read">) => {
    setNotifications((prev) => [
      {
        ...notification,
        id: Date.now().toString(),
        date: new Date(),
        read: false,
      },
      ...prev,
    ])
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        openNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
      <NotificationsPanel />
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
