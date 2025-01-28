'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SettingsType = {
  profile: { name: string; email: string };
  notifications: { emailNotifications: boolean; taskReminders: boolean };
  appearance: { darkMode: boolean };
  integrations: { googleCalendar: boolean };
};

type SectionKeys = keyof SettingsType;
type FieldKeys<T extends SectionKeys> = keyof SettingsType[T];

export default function SettingsPage() {
  // Add state for form values
  const [settings, setSettings] = useState<SettingsType>({
    profile: {
      name: '',
      email: '',
    },
    notifications: {
      emailNotifications: false,
      taskReminders: false,
    },
    appearance: {
      darkMode: false,
    },
    integrations: {
      googleCalendar: false,
    },
  });

  // Handle input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [id]: value,
      },
    }));
  };

  // Handle switch toggles
  const handleSwitchToggle = <T extends SectionKeys>(section: T, field: FieldKeys<T>) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  // Handle save changes
  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile changes
    console.log('Saving profile:', settings.profile);
  };

  // Handle integration connection
  const handleConnectGoogle = () => {
    // TODO: Implement Google Calendar OAuth flow
    console.log('Connecting to Google Calendar');
  };

  return (
    <div className="space-y-8 relative ">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={settings.profile.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={settings.profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={() => handleSwitchToggle('notifications', 'emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming tasks
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.taskReminders}
                  onCheckedChange={() => handleSwitchToggle('notifications', 'taskReminders')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch
                  checked={settings.appearance.darkMode}
                  onCheckedChange={() => handleSwitchToggle('appearance', 'darkMode')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync your calendar events
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleConnectGoogle}
                >
                  {settings.integrations.googleCalendar ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='flex flex-col gap-2 justify-center items-center '>
        <h2 className='text-2xl font-bold text-red-500'>Caution</h2>
        <p className='text-muted-foreground'>
          This page is for UI purposes only. It is not yet implemented.
        </p>
        <p className='text-muted-foreground'>
          Stay tuned for future updates!
        </p>
      </div>
    </div>
  );
}