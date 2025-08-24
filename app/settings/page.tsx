import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GearIcon from "@/components/icons/gear"
import LockIcon from "@/components/icons/lock"

export default function SettingsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Settings",
        description: "Manage your account and platform preferences",
        icon: GearIcon,
      }}
    >
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Trader" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="trader@blackstrike.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
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
        <TabsContent value="notifications" className="space-y-6">
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
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm">Two-Factor Authentication</h3>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <LockIcon className="mr-2 size-4" />
                    Enable 2FA
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
    </DashboardPageLayout>
  )
}
