'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import SafeContentRenderer from '@/components/SafeContentRenderer'
import { useCMSStore } from '@/lib/store/cms'
import { usePackagesStore } from '@/lib/store/packages'
import { useActivitiesStore } from '@/lib/store/activities'
import { useTestimonialsStore } from '@/lib/store/testimonials'
import { useMediaStore } from '@/lib/store/media'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Package,
  Activity,
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  Eye,
  Settings,
  Upload,
  RefreshCw,
  Database,
  Globe,
} from 'lucide-react'
import { format } from 'date-fns'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function CMSDashboard() {
  const {
    stats,
    settings,
    loading: cmsLoading,
    fetchStats,
    fetchSettings,
    migrateDemoData,
    revalidateCache,
  } = useCMSStore()

  const { packages, fetchPackages } = usePackagesStore()
  const { activities, fetchActivities } = useActivitiesStore()
  const { testimonials, fetchTestimonials } = useTestimonialsStore()
  const { media, fetchMedia } = useMediaStore()

  useEffect(() => {
    fetchStats()
    fetchSettings()
    fetchPackages({ limit: 5 })
    fetchActivities({ limit: 5 })
    fetchTestimonials({ limit: 5 })
    fetchMedia({ limit: 10 })
  }, [])

  const contentStats = [
    {
      name: 'Packages',
      total: stats.totalPackages,
      published: stats.publishedPackages,
      draft: stats.draftPackages,
      scheduled: stats.scheduledPackages,
      icon: Package,
      color: '#0088FE',
    },
    {
      name: 'Activities',
      total: stats.totalActivities,
      published: stats.publishedActivities,
      draft: stats.draftActivities,
      scheduled: stats.scheduledActivities,
      icon: Activity,
      color: '#00C49F',
    },
    {
      name: 'Testimonials',
      total: stats.totalTestimonials,
      published: stats.publishedTestimonials,
      draft: stats.draftTestimonials,
      scheduled: stats.scheduledTestimonials,
      icon: MessageSquare,
      color: '#FFBB28',
    },
    {
      name: 'Media',
      total: stats.totalMedia,
      published: stats.totalMedia,
      draft: 0,
      scheduled: 0,
      icon: ImageIcon,
      color: '#FF8042',
    },
  ]

  const chartData = contentStats.map((stat) => ({
    name: stat.name,
    published: stat.published,
    draft: stat.draft,
    scheduled: stat.scheduled,
  }))

  const pieData = contentStats.map((stat) => ({
    name: stat.name,
    value: stat.total,
    color: stat.color,
  }))

  const handleMigration = async () => {
    const success = await migrateDemoData()
    if (success) {
      fetchStats()
      fetchPackages({ limit: 5 })
      fetchActivities({ limit: 5 })
      fetchTestimonials({ limit: 5 })
    }
  }

  const handleRevalidate = async () => {
    await revalidateCache()
  }

  if (cmsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">CMS Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Bali Tourism content and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRevalidate} 
            variant="outline" 
            size="sm"
            aria-label="Revalidate cache to refresh content"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Revalidate Cache
          </Button>
          <Button 
            onClick={handleMigration} 
            variant="outline" 
            size="sm"
            aria-label="Migrate demo data to populate content"
          >
            <Database className="h-4 w-4 mr-2" aria-hidden="true" />
            Migrate Demo Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {contentStats.map((stat) => {
          const Icon = stat.icon
          const publishedPercentage = stat.total > 0 ? (stat.published / stat.total) * 100 : 0
          
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.total}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {stat.published} published
                  </Badge>
                  {stat.draft > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {stat.draft} draft
                    </Badge>
                  )}
                  {stat.scheduled > 0 && (
                    <Badge variant="default" className="text-xs">
                      {stat.scheduled} scheduled
                    </Badge>
                  )}
                </div>
                <Progress value={publishedPercentage} className="mt-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>
              Distribution of content by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="published" fill="#0088FE" name="Published" />
                <Bar dataKey="draft" fill="#FFBB28" name="Draft" />
                <Bar dataKey="scheduled" fill="#00C49F" name="Scheduled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>
              Total content by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>
            Latest updates across all content types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="packages" className="space-y-4">
              {packages.slice(0, 5).map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{pkg.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Updated {format(new Date(pkg.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={pkg.published ? 'default' : 'secondary'}>
                      {pkg.status}
                    </Badge>
                    <span className="text-sm font-medium">${pkg.price}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Updated {format(new Date(activity.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={activity.published ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                    <span className="text-sm font-medium">${activity.price}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="testimonials" className="space-y-4">
              {testimonials.slice(0, 5).map((testimonial) => (
                <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      <SafeContentRenderer 
                        content={testimonial.content.substring(0, 100) + '...'} 
                        type="text" 
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Updated {format(new Date(testimonial.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={testimonial.published ? 'default' : 'secondary'}>
                      {testimonial.status}
                    </Badge>
                    <div className="flex items-center">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {media.slice(0, 8).map((item) => (
                  <div key={item.id} className="border rounded-lg p-2">
                    <div className="aspect-square bg-muted rounded mb-2 flex items-center justify-center">
                      {item.mimeType.startsWith('image/') ? (
                        <Image
                          src={item.url}
                          alt={item.altText || item.filename}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{item.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {(item.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span>New Package</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              <span>New Activity</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              <span>Upload Media</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>CMS Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system configuration and health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-sm">Site URL: {settings.siteUrl}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                Preview Mode: {settings.enablePreviewMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                Scheduled Publishing: {settings.enableScheduledPublishing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                Auto Save: {settings.autoSave ? `Every ${settings.autoSaveInterval}s` : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Versioning: {settings.enableVersioning ? `Max ${settings.maxVersions}` : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                Max Upload: {settings.maxFileSize}MB
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}