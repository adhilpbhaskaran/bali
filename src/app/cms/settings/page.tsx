'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCMSStore } from '@/lib/store/cms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Globe,
  Upload,
  Shield,
  Clock,
  Eye,
  Trash2,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    createBackup,
    restoreBackup,
    deleteBackup,
    revalidateCache,
  } = useCMSStore()

  const [formData, setFormData] = useState({
    defaultLanguage: 'en',
    autoSave: true,
    autoSaveInterval: 30,
    enableVersioning: true,
    maxVersions: 10,
    enableScheduledPublishing: true,
    enablePreviewMode: true,
    siteUrl: 'https://bali-tourism.com',
    mediaUploadPath: '/uploads',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'pdf'],
  })

  const [backups, setBackups] = useState([
    {
      id: '1',
      name: 'Daily Backup - 2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      size: '2.5 MB',
      type: 'automatic',
    },
    {
      id: '2',
      name: 'Manual Backup - Before Update',
      createdAt: '2024-01-14T15:30:00Z',
      size: '2.3 MB',
      type: 'manual',
    },
  ])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (settings) {
      setFormData({
        defaultLanguage: settings.defaultLanguage || 'en',
        autoSave: settings.autoSave || false,
        autoSaveInterval: settings.autoSaveInterval || 30,
        enableVersioning: settings.enableVersioning || false,
        maxVersions: settings.maxVersions || 10,
        enableScheduledPublishing: settings.enableScheduledPublishing || false,
        enablePreviewMode: settings.enablePreviewMode || false,
        siteUrl: settings.siteUrl || '',
        mediaUploadPath: settings.mediaUploadPath || '/uploads',
        maxFileSize: settings.maxFileSize || 10,
        allowedFileTypes: settings.allowedFileTypes || [],
      })
    }
  }, [settings])

  const handleSave = async () => {
    try {
      await updateSettings(formData)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleCreateBackup = async () => {
    try {
      await createBackup()
      toast.success('Backup created successfully')
    } catch (error) {
      toast.error('Failed to create backup')
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    try {
      await restoreBackup(backupId)
      toast.success('Backup restored successfully')
    } catch (error) {
      toast.error('Failed to restore backup')
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      await deleteBackup(backupId)
      setBackups(backups.filter(backup => backup.id !== backupId))
      toast.success('Backup deleted successfully')
    } catch (error) {
      toast.error('Failed to delete backup')
    }
  }

  const handleRevalidateCache = async () => {
    try {
      await revalidateCache()
      toast.success('Cache revalidated successfully')
    } catch (error) {
      toast.error('Failed to revalidate cache')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your CMS settings and preferences
          </p>
        </div>
        <Button 
          onClick={handleSave}
          aria-label="Save all CMS settings changes"
        >
          <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic configuration for your CMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={formData.siteUrl}
                    onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                    placeholder="https://your-site.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select
                    value={formData.defaultLanguage}
                    onValueChange={(value) => setFormData({ ...formData, defaultLanguage: value })}
                  >
                    <SelectTrigger aria-label="Select default website language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Preview Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow content preview before publishing
                    </p>
                  </div>
                  <Switch
                    checked={formData.enablePreviewMode}
                    onCheckedChange={(checked) => setFormData({ ...formData, enablePreviewMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Scheduled Publishing</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable content scheduling for future publication
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableScheduledPublishing}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableScheduledPublishing: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Configure content management features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save content while editing
                  </p>
                </div>
                <Switch
                  checked={formData.autoSave}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoSave: checked })}
                />
              </div>

              {formData.autoSave && (
                <div className="space-y-2">
                  <Label htmlFor="autoSaveInterval">Auto Save Interval (seconds)</Label>
                  <Input
                    id="autoSaveInterval"
                    type="number"
                    value={formData.autoSaveInterval}
                    onChange={(e) => setFormData({ ...formData, autoSaveInterval: parseInt(e.target.value) })}
                    min="10"
                    max="300"
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Content Versioning</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep track of content changes and revisions
                  </p>
                </div>
                <Switch
                  checked={formData.enableVersioning}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableVersioning: checked })}
                />
              </div>

              {formData.enableVersioning && (
                <div className="space-y-2">
                  <Label htmlFor="maxVersions">Maximum Versions to Keep</Label>
                  <Input
                    id="maxVersions"
                    type="number"
                    value={formData.maxVersions}
                    onChange={(e) => setFormData({ ...formData, maxVersions: parseInt(e.target.value) })}
                    min="1"
                    max="50"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Settings */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Settings</CardTitle>
              <CardDescription>
                Configure media upload and storage settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mediaUploadPath">Upload Path</Label>
                  <Input
                    id="mediaUploadPath"
                    value={formData.mediaUploadPath}
                    onChange={(e) => setFormData({ ...formData, mediaUploadPath: e.target.value })}
                    placeholder="/uploads"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={formData.maxFileSize}
                    onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Textarea
                  id="allowedFileTypes"
                  value={formData.allowedFileTypes.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    allowedFileTypes: e.target.value.split(',').map(type => type.trim()).filter(Boolean)
                  })}
                  placeholder="jpg, jpeg, png, gif, webp, mp4, pdf"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Separate file extensions with commas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin access
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>API Rate Limiting</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger aria-label="Select API rate limiting level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1000 requests/hour)</SelectItem>
                    <SelectItem value="moderate">Moderate (500 requests/hour)</SelectItem>
                    <SelectItem value="strict">Strict (100 requests/hour)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Settings</CardTitle>
                <CardDescription>
                  Manage your content backups and restoration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Create daily backups automatically
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="space-y-2">
                  <Label>Backup Retention</Label>
                  <Select defaultValue="30">
                  <SelectTrigger aria-label="Select backup retention period">
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCreateBackup}
                  aria-label="Create a manual backup of all CMS data"
                >
                  <Database className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Manual Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Backups</CardTitle>
                <CardDescription>
                  Restore or delete existing backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{backup.name}</h4>
                          <Badge variant={backup.type === 'automatic' ? 'default' : 'secondary'}>
                            {backup.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(backup.createdAt).toLocaleString()} • {backup.size}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreBackup(backup.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Backup?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the backup.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBackup(backup.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration and maintenance tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed error logging and debugging
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Cache Management</h4>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRevalidateCache}
                    aria-label="Clear all cached data to improve performance"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                    Clear Cache
                  </Button>
                  <Button 
                    variant="outline"
                    aria-label="Optimize database for better performance"
                  >
                    <Database className="h-4 w-4 mr-2" aria-hidden="true" />
                    Optimize Database
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">System Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CMS Version:</span>
                    <span className="ml-2 font-medium">1.0.0</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Node.js Version:</span>
                    <span className="ml-2 font-medium">18.17.0</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Database:</span>
                    <span className="ml-2 font-medium">PostgreSQL 15</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="ml-2 font-medium">7 days, 3 hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}