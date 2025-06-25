"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, Check, Trash2, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { UpdateProfileData, UpdatePasswordData } from "@/types/auth"
import { validatePassword } from "@/utils/validation"

export default function ProfileForm() {
  const { user, updateProfile, updatePassword, deleteAccount, logoutAllDevices, loading } = useAuth()

  const [profileData, setProfileData] = useState<UpdateProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
    },
  })

  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [messages, setMessages] = useState({
    profile: { success: "", error: "" },
    password: { success: "", error: "" },
    account: { success: "", error: "" },
  })

  const [isSubmitting, setIsSubmitting] = useState({
    profile: false,
    password: false,
    delete: false,
    logout: false,
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting((prev) => ({ ...prev, profile: true }))
    setMessages((prev) => ({ ...prev, profile: { success: "", error: "" } }))

    try {
      const result = await updateProfile(profileData)

      if (result.success) {
        setMessages((prev) => ({
          ...prev,
          profile: { success: "Profile updated successfully!", error: "" },
        }))
      } else {
        setMessages((prev) => ({
          ...prev,
          profile: { success: "", error: result.error || "Failed to update profile" },
        }))
      }
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        profile: { success: "", error: "An unexpected error occurred" },
      }))
    } finally {
      setIsSubmitting((prev) => ({ ...prev, profile: false }))
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting((prev) => ({ ...prev, password: true }))
    setMessages((prev) => ({ ...prev, password: { success: "", error: "" } }))

    const passwordValidation = validatePassword(passwordData.newPassword)
    if (!passwordValidation.isValid) {
      setMessages((prev) => ({
        ...prev,
        password: { success: "", error: passwordValidation.errors[0] },
      }))
      setIsSubmitting((prev) => ({ ...prev, password: false }))
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessages((prev) => ({
        ...prev,
        password: { success: "", error: "New passwords do not match" },
      }))
      setIsSubmitting((prev) => ({ ...prev, password: false }))
      return
    }

    try {
      const result = await updatePassword(passwordData)

      if (result.success) {
        setMessages((prev) => ({
          ...prev,
          password: { success: "Password updated successfully!", error: "" },
        }))
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setMessages((prev) => ({
          ...prev,
          password: { success: "", error: result.error || "Failed to update password" },
        }))
      }
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        password: { success: "", error: "An unexpected error occurred" },
      }))
    } finally {
      setIsSubmitting((prev) => ({ ...prev, password: false }))
    }
  }

  const handleLogoutAllDevices = async () => {
    setIsSubmitting((prev) => ({ ...prev, logout: true }))
    setMessages((prev) => ({ ...prev, account: { success: "", error: "" } }))

    try {
      await logoutAllDevices()
      setMessages((prev) => ({
        ...prev,
        account: { success: "Logged out from all devices successfully!", error: "" },
      }))
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        account: { success: "", error: "Failed to logout from all devices" },
      }))
    } finally {
      setIsSubmitting((prev) => ({ ...prev, logout: false }))
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsSubmitting((prev) => ({ ...prev, delete: true }))
    setMessages((prev) => ({ ...prev, account: { success: "", error: "" } }))

    try {
      const result = await deleteAccount()

      if (result.success) {
        setMessages((prev) => ({
          ...prev,
          account: { success: "Account deleted successfully. You will be redirected shortly.", error: "" },
        }))
      } else {
        setMessages((prev) => ({
          ...prev,
          account: { success: "", error: result.error || "Failed to delete account" },
        }))
      }
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        account: { success: "", error: "An unexpected error occurred" },
      }))
    } finally {
      setIsSubmitting((prev) => ({ ...prev, delete: false }))
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                {messages.profile.success && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>{messages.profile.success}</AlertDescription>
                  </Alert>
                )}

                {messages.profile.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{messages.profile.error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                      disabled={isSubmitting.profile || loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                      disabled={isSubmitting.profile || loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      disabled={isSubmitting.profile || loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={isSubmitting.profile || loading}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address</h3>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street address</Label>
                    <Input
                      id="street"
                      name="street"
                      type="text"
                      value={profileData.address?.street || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address!, street: e.target.value },
                        }))
                      }
                      placeholder="Enter street address"
                      disabled={isSubmitting.profile || loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={profileData.address?.city || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address!, city: e.target.value },
                          }))
                        }
                        placeholder="Enter city"
                        disabled={isSubmitting.profile || loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        value={profileData.address?.state || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address!, state: e.target.value },
                          }))
                        }
                        placeholder="Enter state"
                        disabled={isSubmitting.profile || loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={profileData.address?.zipCode || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address!, zipCode: e.target.value },
                          }))
                        }
                        placeholder="Enter ZIP code"
                        disabled={isSubmitting.profile || loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting.profile || loading}>
                    {isSubmitting.profile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password and manage security preferences</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                {messages.password.success && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>{messages.password.success}</AlertDescription>
                  </Alert>
                )}

                {messages.password.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{messages.password.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      disabled={isSubmitting.password || loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                      disabled={isSubmitting.password || loading}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      disabled={isSubmitting.password || loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                      disabled={isSubmitting.password || loading}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      disabled={isSubmitting.password || loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      disabled={isSubmitting.password || loading}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting.password || loading}>
                    {isSubmitting.password ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={profileData.notificationPreferences.email}
                  onCheckedChange={(checked) =>
                    setProfileData((prev) => ({
                      ...prev,
                      notificationPreferences: { ...prev.notificationPreferences, email: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via text message</p>
                </div>
                <Switch
                  checked={profileData.notificationPreferences.sms}
                  onCheckedChange={(checked) =>
                    setProfileData((prev) => ({
                      ...prev,
                      notificationPreferences: { ...prev.notificationPreferences, sms: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push notifications</Label>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={profileData.notificationPreferences.push}
                  onCheckedChange={(checked) =>
                    setProfileData((prev) => ({
                      ...prev,
                      notificationPreferences: { ...prev.notificationPreferences, push: checked },
                    }))
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSubmit} disabled={isSubmitting.profile || loading}>
                  {isSubmitting.profile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {messages.account.success && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>{messages.account.success}</AlertDescription>
                </Alert>
              )}

              {messages.account.error && (
                <Alert variant="destructive">
                  <AlertDescription>{messages.account.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Logout from all devices</Label>
                    <p className="text-sm text-gray-600">Sign out from all devices and browsers</p>
                  </div>
                  <Button variant="outline" onClick={handleLogoutAllDevices} disabled={isSubmitting.logout || loading}>
                    {isSubmitting.logout ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout All
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="space-y-0.5">
                    <Label className="text-red-700">Delete account</Label>
                    <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting.delete || loading}>
                    {isSubmitting.delete ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
