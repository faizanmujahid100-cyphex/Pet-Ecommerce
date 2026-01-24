'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// In a real app, this data would come from a secure backend
const initialAdmins = [
  { id: '1', email: 'admin@example.com' },
  { id: '2', email: 'cat840695@gmail.com' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState(initialAdmins);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Placeholder function for making a user an admin.
  // In a real app, this would securely call a backend function.
  const makeAdmin = (email: string) => {
    if (!email.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    if (admins.find((admin) => admin.email === email)) {
      toast({
        variant: 'destructive',
        title: 'User is already an admin',
        description: `${email} already has admin privileges.`,
      });
      return;
    }

    console.log(`Request to make ${email} an admin.`);
    toast({
      title: 'Admin Action (Simulated)',
      description: `In a real app, a request would be sent to make ${email} an admin. For now, we'll add them to the local list.`,
    });

    // This is a mock implementation
    setAdmins([...admins, { id: Date.now().toString(), email }]);
    setNewAdminEmail('');
  };

  // Placeholder function for removing admin rights.
  // In a real app, this would securely call a backend function.
  const removeAdmin = (email: string) => {
    // Can't remove the default admin for this demo
    if (email === 'admin@example.com') {
      toast({
        variant: 'destructive',
        title: 'Cannot Remove Default Admin',
        description: 'This admin cannot be removed in the demo.',
      });
      return;
    }

    console.log(`Request to remove admin rights from ${email}.`);
    toast({
      title: 'Admin Action (Simulated)',
      description: `In a real app, a request would be sent to remove admin rights from ${email}.`,
    });

    // This is a mock implementation
    setAdmins(admins.filter((admin) => admin.email !== email));
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved (Simulated)',
      description: 'Your site settings have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your store's appearance and details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Update your site's logo and name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Website Name</Label>
            <Input id="site-name" defaultValue="Feline & Friend" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" />
            <p className="text-sm text-muted-foreground">
              Upload a new logo. Recommended size: 128x128px.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Hero Slider</CardTitle>
          <CardDescription>
            Manage the images and videos on your homepage slider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Slider Images</Label>
            <Input id="slider-images" type="file" multiple />
            <p className="text-sm text-muted-foreground">
              Upload one or more images for the slider.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-links">YouTube Video Links</Label>
            <Textarea
              id="youtube-links"
              placeholder="Enter one YouTube URL per line"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Add YouTube videos to your slider.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>
            Add or remove administrators. Users must have an existing account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="new-admin-email">New Admin Email</Label>
            <div className="flex gap-2">
              <Input
                id="new-admin-email"
                type="email"
                placeholder="user@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
              <Button onClick={() => makeAdmin(newAdminEmail)}>
                Make Admin
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Current Admins</Label>
            <div className="space-y-2 rounded-md border">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0"
                >
                  <span className="text-sm font-medium">{admin.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdmin(admin.email)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  );
}