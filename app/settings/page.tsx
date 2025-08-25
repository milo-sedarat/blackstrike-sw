'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import GearIcon from "@/components/icons/gear"
import LockIcon from "@/components/icons/lock"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function SettingsPage() {
  const { user, logout, detachGoogleAccount, changeEmail, changePassword } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDetaching, setIsDetaching] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  
  // Detach Google modal states
  const [showDetachModal, setShowDetachModal] = useState(false);
  const [detachEmail, setDetachEmail] = useState('');
  const [detachPassword, setDetachPassword] = useState('');
  const [detachConfirmPassword, setDetachConfirmPassword] = useState('');
  const [detachError, setDetachError] = useState('');
  const [detachSuccess, setDetachSuccess] = useState(false);
  
  // Change password modal states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Extract user information
  const userEmail = user?.email || '';
  const displayName = user?.displayName || '';
  const firstName = displayName.split(' ')[0] || '';
  const lastName = displayName.split(' ').slice(1).join(' ') || '';
  const photoURL = user?.photoURL || '/avatars/user_krimson.png';
  const emailVerified = user?.emailVerified || false;
  const createdAt = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '';
  const lastSignIn = user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : '';
  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // TODO: Implement save functionality
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleEditName = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement name update functionality
      setTimeout(() => {
        setIsSaving(false);
        setIsEditingName(false);
      }, 1000);
    } catch (error) {
      console.error('Save name error:', error);
      setIsSaving(false);
    }
  };

  const handleEditEmail = () => {
    setEditEmail(userEmail);
    setEmailPassword('');
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    if (!editEmail || !emailPassword) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      return;
    }

    if (editEmail === userEmail) {
      setIsEditingEmail(false);
      return;
    }

    setIsChangingEmail(true);
    try {
      const result = await changeEmail(editEmail, emailPassword);
      
      if (result.success) {
        setIsEditingEmail(false);
        setEditEmail('');
        setEmailPassword('');
        // Refresh the page to show updated user state
        window.location.reload();
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Failed to change email';
        console.error('Change email error:', errorMessage);
      }
    } catch (error) {
      console.error('Change email error:', error);
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setPasswordSuccess(true);
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setPasswordError('');
          setPasswordSuccess(false);
        }, 3000);
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Failed to change password';
        setPasswordError(errorMessage);
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDetachGoogle = async () => {
    // Reset error state
    setDetachError('');
    
    // Validation
    if (!detachEmail || !detachPassword || !detachConfirmPassword) {
      setDetachError('Please fill in all fields');
      return;
    }
    
    if (detachPassword !== detachConfirmPassword) {
      setDetachError('Passwords do not match');
      return;
    }

    if (detachPassword.length < 6) {
      setDetachError('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(detachEmail)) {
      setDetachError('Please enter a valid email address');
      return;
    }

    setIsDetaching(true);
    try {
      const result = await detachGoogleAccount(detachEmail, detachPassword);
      
      if (result.success) {
        setDetachSuccess(true);
        setTimeout(() => {
          setShowDetachModal(false);
          setDetachEmail('');
          setDetachPassword('');
          setDetachConfirmPassword('');
          setDetachError('');
          setDetachSuccess(false);
          // Refresh the page to show updated user state
          window.location.reload();
        }, 3000);
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Failed to detach Google account';
        setDetachError(errorMessage);
      }
    } catch (error) {
      console.error('Detach error:', error);
      setDetachError('An unexpected error occurred');
    } finally {
      setIsDetaching(false);
    }
  };

  return (
    <div className="flex flex-col relative w-full min-h-full">
      {/* Header */}
      <div className="flex items-center lg:items-baseline gap-2.5 md:gap-4 px-4 md:px-6 py-3 md:pb-4 lg:pt-7 ring-2 ring-pop sticky top-header-mobile lg:top-0 bg-background z-10">
        <div className="max-lg:contents rounded bg-primary size-7 md:size-9 flex items-center justify-center my-auto">
          <GearIcon className="ml-1 lg:ml-0 opacity-50 md:opacity-100 size-5" />
        </div>
        <h1 className="text-xl lg:text-4xl font-display leading-[1] mb-1">
          Settings
        </h1>
        <span className="ml-auto text-xs md:text-sm text-muted-foreground block">
          Manage your account and platform preferences
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 lg:px-6 py-6 md:py-10 ring-2 ring-pop bg-background">
        <div className="w-full">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={photoURL}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Profile Picture</p>
                      <p className="text-xs text-muted-foreground">
                        {isGoogleUser ? 'From Google Account' : 'Default avatar'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Name Fields */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Name</Label>
                      {!isEditingName && !isGoogleUser && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleEditName}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditingName ? (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="editFirstName">First Name</Label>
                            <Input 
                              id="editFirstName" 
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              placeholder="First name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editLastName">Last Name</Label>
                            <Input 
                              id="editLastName" 
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveName}
                            disabled={isSaving}
                            size="sm"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingName(false)}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">First Name</p>
                          <p className="text-sm font-medium">{firstName || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Name</p>
                          <p className="text-sm font-medium">{lastName || 'Not set'}</p>
                        </div>
                      </div>
                    )}
                    
                    {isGoogleUser && (
                      <p className="text-xs text-muted-foreground">Name is managed by Google Account</p>
                    )}
                  </div>

                  <Separator />

                  {/* Email Field */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Email</Label>
                      {!isEditingEmail && !isGoogleUser && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleEditEmail}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditingEmail ? (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-2">
                          <Label htmlFor="editEmail">New Email Address</Label>
                          <Input 
                            id="editEmail" 
                            type="email" 
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="Enter new email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailPassword">Current Password</Label>
                          <Input 
                            id="emailPassword" 
                            type="password" 
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveEmail}
                            disabled={isChangingEmail}
                            size="sm"
                          >
                            {isChangingEmail ? 'Changing...' : 'Change Email'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingEmail(false)}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">{userEmail}</p>
                        {emailVerified && (
                          <p className="text-xs text-green-600 flex items-center mt-1">
                            ✓ Email verified
                          </p>
                        )}
                      </div>
                    )}
                    
                    {isGoogleUser && (
                      <p className="text-xs text-muted-foreground">Email is managed by Google Account</p>
                    )}
                  </div>

                  <Separator />

                  {/* Account Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account Created:</span>
                      <span>{createdAt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sign In:</span>
                      <span>{lastSignIn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sign-in Provider:</span>
                      <span className="capitalize">
                        {isGoogleUser ? 'Google' : 'Email/Password'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isGoogleUser && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Change Password</h3>
                        <p className="text-xs text-muted-foreground">Update your password</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowChangePasswordModal(true)}
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-sm">Sign Out</h3>
                      <p className="text-xs text-muted-foreground">Sign out of your current session</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                    </Button>
                  </div>
                  
                  {isGoogleUser && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Google Account</h3>
                        <p className="text-xs text-muted-foreground">Detach from Google and use email/password</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDetachModal(true)}
                        disabled={isDetaching}
                      >
                        {isDetaching ? 'Detaching...' : 'Detach Google Account'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">API Key Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <h3 className="font-display text-sm">Binance API</h3>
                        <p className="text-xs text-muted-foreground">Connected • Last used 2 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <h3 className="font-display text-sm">Coinbase API</h3>
                        <p className="text-xs text-muted-foreground">Connected • Last used 1 day ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button>
                    <GearIcon className="mr-2 size-4" />
                    Add New API Key
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Email Notifications</h3>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Push Notifications</h3>
                        <p className="text-xs text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Trading Alerts</h3>
                        <p className="text-xs text-muted-foreground">Get notified about trading opportunities</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Security Alerts</h3>
                        <p className="text-xs text-muted-foreground">Get notified about security events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isGoogleUser && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="Enter current password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  )}

                  {isGoogleUser && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <h3 className="font-display text-sm text-blue-900 mb-2">Google Account Security</h3>
                      <p className="text-xs text-blue-700">
                        Your account security is managed through your Google account. 
                        To change your password or enable 2FA, please visit your Google Account settings.
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Two-Factor Authentication</h3>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" size="sm" disabled={isGoogleUser}>
                        <LockIcon className="mr-2 size-4" />
                        {isGoogleUser ? 'Managed by Google' : 'Enable 2FA'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            {!passwordSuccess ? (
              <>
                <h3 className="text-lg font-display mb-4">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your current password and choose a new password.
                </p>
                
                {passwordError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordInput">Current Password</Label>
                    <Input 
                      id="currentPasswordInput" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPasswordInput">New Password</Label>
                    <Input 
                      id="newPasswordInput" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPasswordInput">Confirm New Password</Label>
                    <Input 
                      id="confirmNewPasswordInput" 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setPasswordError('');
                    }}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-display mb-2">Password Changed!</h3>
                <p className="text-sm text-muted-foreground">
                  Your password has been updated successfully.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detach Google Modal */}
      {showDetachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            {!detachSuccess ? (
              <>
                <h3 className="text-lg font-display mb-4">Detach Google Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To detach your Google account, you need to set up a new email and password for your account.
                </p>
                
                {detachError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                    <p className="text-sm text-red-700">{detachError}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="detachEmail">New Email Address</Label>
                    <Input 
                      id="detachEmail" 
                      type="email" 
                      value={detachEmail}
                      onChange={(e) => setDetachEmail(e.target.value)}
                      placeholder="Enter new email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="detachPassword">New Password</Label>
                    <Input 
                      id="detachPassword" 
                      type="password" 
                      value={detachPassword}
                      onChange={(e) => setDetachPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="detachConfirmPassword">Confirm Password</Label>
                    <Input 
                      id="detachConfirmPassword" 
                      type="password" 
                      value={detachConfirmPassword}
                      onChange={(e) => setDetachConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowDetachModal(false);
                      setDetachEmail('');
                      setDetachPassword('');
                      setDetachConfirmPassword('');
                      setDetachError('');
                    }}
                    disabled={isDetaching}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDetachGoogle}
                    disabled={isDetaching}
                  >
                    {isDetaching ? 'Detaching...' : 'Detach Account'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-display mb-2">Success!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your Google account has been detached successfully. 
                  A verification email has been sent to your new email address.
                </p>
                <p className="text-xs text-muted-foreground">
                  Please check your email and click the verification link to complete the process.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
