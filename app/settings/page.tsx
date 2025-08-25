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

export default function SettingsPage() {
  const { user, logout, detachGoogleAccount } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDetaching, setIsDetaching] = useState(false);
  const [showDetachModal, setShowDetachModal] = useState(false);
  const [detachEmail, setDetachEmail] = useState('');
  const [detachPassword, setDetachPassword] = useState('');
  const [detachConfirmPassword, setDetachConfirmPassword] = useState('');
  const [detachError, setDetachError] = useState('');
  const [detachSuccess, setDetachSuccess] = useState(false);
  
  // Extract user information
  const userEmail = user?.email || '';
  const displayName = user?.displayName || '';
  const firstName = displayName.split(' ')[0] || '';
  const lastName = displayName.split(' ').slice(1).join(' ') || '';
  const photoURL = user?.photoURL || '';
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
                  {photoURL && (
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={photoURL} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">From Google Account</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={firstName} disabled={isGoogleUser} />
                      {isGoogleUser && (
                        <p className="text-xs text-muted-foreground">Managed by Google Account</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={lastName} disabled={isGoogleUser} />
                      {isGoogleUser && (
                        <p className="text-xs text-muted-foreground">Managed by Google Account</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userEmail} disabled />
                    {emailVerified && (
                      <p className="text-xs text-green-600 flex items-center">
                        ✓ Email verified
                      </p>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="pt-4 border-t space-y-2">
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

                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-display">Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <h3 className="font-display text-sm">Trade Notifications</h3>
                        <p className="text-xs text-muted-foreground">Get notified when trades are executed</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Bot Status Updates</h3>
                        <p className="text-xs text-muted-foreground">Alerts when bots start, stop, or encounter errors</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Market Alerts</h3>
                        <p className="text-xs text-muted-foreground">Price alerts and market movement notifications</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Weekly Reports</h3>
                        <p className="text-xs text-muted-foreground">Weekly performance summary emails</p>
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
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm">Login Notifications</h3>
                        <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
