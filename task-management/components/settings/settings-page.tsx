"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      username: "User",
      email: "user@example.com",
      language: "english",
      timezone: "utc",
    },
    appearance: {
      theme: "system",
      fontSize: 16,
      reducedMotion: false,
      highContrast: false,
    },
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true,
      reminderTime: "30min",
    },
    privacy: {
      shareTaskStats: false,
      allowAnalytics: true,
      storeHistory: true,
    },
    integrations: [
      { id: "google", name: "Google Calendar", connected: true },
      { id: "outlook", name: "Microsoft Outlook", connected: false },
      { id: "slack", name: "Slack", connected: false },
    ],
  })

  const handleGeneralChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [key]: value,
      },
    })
  }

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    })
  }

  const handleNotificationsChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    })
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    })
  }

  const toggleIntegration = (id: string) => {
    setSettings({
      ...settings,
      integrations: settings.integrations.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration,
      ),
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-switzer">Settings</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={settings.general.username}
                  onChange={(e) => handleGeneralChange("username", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.general.email}
                  onChange={(e) => handleGeneralChange("email", e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => handleGeneralChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => handleGeneralChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how nexu.sphere looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">Font Size ({settings.appearance.fontSize}px)</Label>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[settings.appearance.fontSize]}
                  onValueChange={(value) => handleAppearanceChange("fontSize", value[0])}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Reduce the amount of animations in the interface.</p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={settings.appearance.reducedMotion}
                    onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={settings.appearance.highContrast}
                    onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive task reminders via email.</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationsChange("email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your devices.</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleNotificationsChange("push", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications on your desktop.</p>
                  </div>
                  <Switch
                    id="desktop-notifications"
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => handleNotificationsChange("desktop", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-notifications">Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play a sound when notifications arrive.</p>
                  </div>
                  <Switch
                    id="sound-notifications"
                    checked={settings.notifications.sound}
                    onCheckedChange={(checked) => handleNotificationsChange("sound", checked)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Default Reminder Time</Label>
                <Select
                  value={settings.notifications.reminderTime}
                  onValueChange={(value) => handleNotificationsChange("reminderTime", value)}
                >
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Select reminder time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10min">10 minutes before</SelectItem>
                    <SelectItem value="30min">30 minutes before</SelectItem>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy and data preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-stats">Share Task Statistics</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage statistics to be shared.</p>
                  </div>
                  <Switch
                    id="share-stats"
                    checked={settings.privacy.shareTaskStats}
                    onCheckedChange={(checked) => handlePrivacyChange("shareTaskStats", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-analytics">Allow Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve nexu.sphere with anonymous usage data.</p>
                  </div>
                  <Switch
                    id="allow-analytics"
                    checked={settings.privacy.allowAnalytics}
                    onCheckedChange={(checked) => handlePrivacyChange("allowAnalytics", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="store-history">Store Task History</Label>
                    <p className="text-sm text-muted-foreground">Keep a history of completed and archived tasks.</p>
                  </div>
                  <Switch
                    id="store-history"
                    checked={settings.privacy.storeHistory}
                    onCheckedChange={(checked) => handlePrivacyChange("storeHistory", checked)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button variant="destructive">Delete All Data</Button>
                <p className="text-xs text-muted-foreground">
                  This will permanently delete all your tasks, settings, and personal data.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect nexu.sphere with other services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.connected ? "Connected and syncing" : "Not connected"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.connected ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Connected
                      </Badge>
                    ) : null}
                    <Button
                      variant={integration.connected ? "destructive" : "secondary"}
                      onClick={() => toggleIntegration(integration.id)}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add New Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
