import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Site Settings</h1>
                <p className="text-muted-foreground">Manage your store's appearance and details.</p>
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
                        <p className="text-sm text-muted-foreground">Upload a new logo. Recommended size: 128x128px.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Homepage Hero Slider</CardTitle>
                    <CardDescription>Manage the images and videos on your homepage slider.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Slider Images</Label>
                        <Input id="slider-images" type="file" multiple />
                        <p className="text-sm text-muted-foreground">Upload one or more images for the slider.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube-links">YouTube Video Links</Label>
                        <Textarea id="youtube-links" placeholder="Enter one YouTube URL per line" rows={3}/>
                         <p className="text-sm text-muted-foreground">Add YouTube videos to your slider.</p>
                    </div>
                </CardContent>
            </Card>
            
            <Button>Save Changes</Button>
        </div>
    )
}
