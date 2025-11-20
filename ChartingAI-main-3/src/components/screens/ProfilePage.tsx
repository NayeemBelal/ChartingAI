import { 
  User, 
  Settings, 
  LogOut, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  Activity,
  Edit,
  Mail,
  Phone,
  MapPin,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export function ProfilePage() {
  const navigate = useNavigate()
  
  // Mock user data
  const userData = {
    name: "Dr. Nayeem Belal",
    email: "nayeem.belal@chartingai.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    role: "Medical Practitioner",
    joinDate: "March 2024",
    avatar: "/api/placeholder/128/128"
  }

  // Mock usage statistics
  const monthlyUsage = [
    { month: 'Jan', charts: 12, accuracy: 94 },
    { month: 'Feb', charts: 19, accuracy: 96 },
    { month: 'Mar', charts: 28, accuracy: 95 },
    { month: 'Apr', charts: 35, accuracy: 97 },
    { month: 'May', charts: 42, accuracy: 98 },
    { month: 'Jun', charts: 38, accuracy: 96 }
  ]

  const chartTypes = [
    { name: 'Physical Exams', value: 45, color: '#3b82f6' },
    { name: 'Lab Reports', value: 25, color: '#10b981' },
    { name: 'Consultation Notes', value: 20, color: '#f59e0b' },
    { name: 'Discharge Summaries', value: 10, color: '#ef4444' }
  ]

  const weeklyActivity = [
    { day: 'Mon', processed: 8 },
    { day: 'Tue', processed: 12 },
    { day: 'Wed', processed: 15 },
    { day: 'Thu', processed: 10 },
    { day: 'Fri', processed: 14 },
    { day: 'Sat', processed: 6 },
    { day: 'Sun', processed: 3 }
  ]

  const handleLogout = () => {
    alert('Logging out...')
    // In real app, handle logout logic
  }

  const handleEditProfile = () => {
    alert('Edit profile modal would open here')
  }

  const handleSettings = () => {
    alert('Settings page would open here')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Navigation */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/success')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Success Page
          </Button>
        </div>

        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{userData.name}</CardTitle>
                  <CardDescription className="text-lg">{userData.role}</CardDescription>
                  <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditProfile}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{userData.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Total Charts Processed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">174</div>
                <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Average Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">96.2%</div>
                <p className="text-sm text-gray-500 mt-1">+1.8% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Avg Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">1.2m</div>
                <p className="text-sm text-gray-500 mt-1">-15s from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Usage Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monthly Usage & Accuracy
              </CardTitle>
              <CardDescription>
                Charts processed and accuracy rate over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="charts" fill="#3b82f6" opacity={0.7} />
                    <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Chart Types Processed
              </CardTitle>
              <CardDescription>
                Distribution of different medical chart types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span>{type.name}</span>
                    <span className="text-gray-500">({type.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Charts processed per day this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="processed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Total this week: {weeklyActivity.reduce((sum, day) => sum + day.processed, 0)} charts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Security & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your account security and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="justify-start text-red-600 hover:text-red-700" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
