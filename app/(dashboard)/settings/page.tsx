"use client"

import { useState } from "react"
import { Loader2, User, Bell, Shield, Palette } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useEffect } from "react"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [role, setRole] = useState("")
useEffect(() => {

  setName(
    localStorage.getItem("user_name") || ""
  )

  setEmail(
    localStorage.getItem("user_email") || ""
  )

  setRole(
    localStorage.getItem("role") || ""
  )

}, [])

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [approvalNotifications, setApprovalNotifications] = useState(true)
  const [disbursementNotifications, setDisbursementNotifications] = useState(true)

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

const handleSaveProfile = async (
  e: React.FormEvent
) => {

  e.preventDefault()

  setIsSubmitting(true)

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/api/update-profile",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          user_id:
            localStorage.getItem("user_id"),

          name,
        }),
      }
    )

    const data = await response.json()

    if (data.status === "success") {

      localStorage.setItem(
        "user_name",
        data.user.name
      )

      toast.success(
        "Profile updated",
        {
          description:
            "Your profile has been updated successfully.",
        }
      )

      window.location.reload()

    } else {

      toast.error("Failed update profile")
    }

  } catch (error) {

    toast.error("Server error")

  } finally {

    setIsSubmitting(false)
  }
}
  const handleSaveNotifications = () => {
    toast.success("Preferences saved", {
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start bg-accent text-accent-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="ghost" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Button>
            <Button variant="ghost" className="justify-start">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </Button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Input
                      value={role}
                      disabled
                      className="capitalize"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact administrator to change your role
                    </p>
                  </Field>
                </FieldGroup>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Approval Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your request is approved or rejected
                  </p>
                </div>
                <Switch
                  checked={approvalNotifications}
                  onCheckedChange={setApprovalNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Disbursement Alerts
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when funds are disbursed
                  </p>
                </div>
                <Switch
                  checked={disbursementNotifications}
                  onCheckedChange={setDisbursementNotifications}
                />
              </div>

              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
