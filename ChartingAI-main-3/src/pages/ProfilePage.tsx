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
  Shield,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Award
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
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import type { Role } from '@/types'
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
  Cell,
  Legend
} from 'recharts'

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  organization?: string;
}

export function ProfilePage() {
  const navigate = useNavigate()
  const [email] = useLocalStorage<string | null>("chartingai.email", null)
  const [role] = useLocalStorage<Role | null>("chartingai.role", null)
  const [userData, setUserData] = useState<UserData | null>(null)

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      // Get current email from localStorage
      const storedEmailItem = localStorage.getItem("chartingai.email")
      const currentEmail = storedEmailItem ? JSON.parse(storedEmailItem) : email
      
      if (!currentEmail) {
        return
      }

      const storedUserData = localStorage.getItem("chartingai.userData")
      
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData)
          // Always check if email matches - if not, update userData
          if (parsedData.email === currentEmail) {
            // Email matches, use stored data
            setUserData(parsedData)
          } else {
            // Email changed, create new userData from current email
            const userName = currentEmail.split('@')[0]
            const firstName = userName.charAt(0).toUpperCase() + userName.slice(1)
            const newUserData: UserData = {
              firstName: firstName,
              lastName: parsedData.lastName || '',
              email: currentEmail,
              phone: parsedData.phone || '',
              location: parsedData.location || '',
              organization: parsedData.organization || ''
            }
            setUserData(newUserData)
            localStorage.setItem("chartingai.userData", JSON.stringify(newUserData))
          }
        } catch (e) {
          console.error("Error parsing user data:", e)
          // Create new userData from email
          const userName = currentEmail.split('@')[0]
          const firstName = userName.charAt(0).toUpperCase() + userName.slice(1)
          const defaultUserData: UserData = {
            firstName: firstName,
            lastName: '',
            email: currentEmail,
            phone: '',
            location: '',
            organization: ''
          }
          setUserData(defaultUserData)
          localStorage.setItem("chartingai.userData", JSON.stringify(defaultUserData))
        }
      } else {
        // No userData exists, create from email
        const userName = currentEmail.split('@')[0]
        const firstName = userName.charAt(0).toUpperCase() + userName.slice(1)
        const defaultUserData: UserData = {
          firstName: firstName,
          lastName: '',
          email: currentEmail,
          phone: '',
          location: '',
          organization: ''
        }
        setUserData(defaultUserData)
        localStorage.setItem("chartingai.userData", JSON.stringify(defaultUserData))
      }
    }
    
    loadUserData()
    
    // Listen for userData updates from EditProfile
    const handleUserDataUpdate = () => {
      loadUserData()
    }
    
    window.addEventListener('userDataUpdated', handleUserDataUpdate)
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate)
    }
  }, [email])

  // Get display name
  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`
    }
    if (userData?.firstName) {
      return userData.firstName
    }
    if (email) {
      return email.split('@')[0]
    }
    return 'User'
  }

  // Get initials for avatar
  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
    }
    if (userData?.firstName) {
      return userData.firstName[0].toUpperCase()
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
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
    { name: 'Physical Exams', value: 45, color: '#2563eb' },
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

  // Enterprise metrics
  const metrics = [
    { 
      label: "Total Charts", 
      value: "174", 
      change: "+12%", 
      trend: "up",
      icon: FileText,
      color: "blue"
    },
    { 
      label: "Accuracy Rate", 
      value: "96.2%", 
      change: "+1.8%", 
      trend: "up",
      icon: Award,
      color: "green"
    },
    { 
      label: "Avg. Time", 
      value: "1.2m", 
      change: "-15s", 
      trend: "down",
      icon: Clock,
      color: "blue"
    },
    { 
      label: "Time Saved", 
      value: "847 hrs", 
      change: "+23%", 
      trend: "up",
      icon: TrendingUp,
      color: "green"
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("chartingai.role")
    localStorage.removeItem("chartingai.email")
    localStorage.removeItem("chartingai.userData")
    localStorage.removeItem("chartingai.rememberMe")
    navigate("/login")
  }

  const handleEditProfile = () => {
    navigate("/profile/edit")
  }

  const handleSettings = () => {
    navigate("/profile/settings")
  }

  const handlePrivacySettings = () => {
    navigate("/profile/privacy")
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email && !role) {
      navigate("/login")
    }
  }, [email, role, navigate])

  if (!email && !role) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex flex-col">
      {/* Enterprise Header */}
      <header className="w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-40 shadow-apple">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <Button 
              variant="ghost"
              onClick={() => navigate("/marketplace-new")}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 h-9 px-3 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
          </Button>
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Profile Dashboard
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-0.5">
                Account & Analytics
              </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 px-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
                  </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800">
              <DropdownMenuItem onClick={handleEditProfile} className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <Edit className="mr-2 h-4 w-4" />
                <span className="text-neutral-900 dark:text-neutral-100">Edit Profile</span>
                  </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <Settings className="mr-2 h-4 w-4" />
                <span className="text-neutral-900 dark:text-neutral-100">Account Settings</span>
                  </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
                    <LogOut className="mr-2 h-4 w-4" />
                Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 space-y-6 overflow-y-auto">
        
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-neutral-100 dark:border-neutral-800">
                <AvatarImage src={userData?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${getDisplayName()}` : undefined} />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-600 dark:text-blue-400 border-4 border-white dark:border-neutral-900">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">
                    {role === "Physician" ? `Dr. ${getDisplayName()}` : getDisplayName()}
                  </h2>
                  <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                    {role || "Medical Professional"}
                  </p>
                </div>
                {userData?.organization && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 font-light">
                    <Building2 className="w-4 h-4" />
                    <span>{userData.organization}</span>
              </div>
                )}
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 font-light">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {email || userData?.email || "No email"}
                  </span>
                  {userData?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {userData.phone}
                    </span>
                  )}
                  {userData?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {userData.location}
                    </span>
                  )}
              </div>
              </div>
            </div>
            <Button
              onClick={handleEditProfile}
              variant="outline"
              className="h-10 px-4 text-sm font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Enterprise Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple hover:shadow-apple-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${
                    metric.color === 'blue' 
                      ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50' 
                      : 'bg-green-50 dark:bg-green-950/50 border border-green-200/50 dark:border-green-900/50'
                  } flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${
                      metric.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    metric.trend === 'up'
                      ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-900/50'
                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{metric.label}</p>
                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                    {metric.value}
                  </h3>
                </div>
              </motion.div>
            )
          })}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-visible">
          {/* Monthly Usage Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg overflow-visible"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                Monthly Usage & Accuracy
                </h3>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Charts processed and accuracy rate over the last 6 months
              </p>
            </div>
            <div className="h-72 w-full min-h-[288px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={288}>
                <LineChart data={monthlyUsage} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <defs>
                    <style>{`
                      .recharts-cartesian-grid-horizontal line,
                      .recharts-cartesian-grid-vertical line {
                        stroke: hsl(var(--border));
                      }
                    `}</style>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    style={{ fontSize: '11px' }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    width={40}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                      padding: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="charts" 
                    fill="#2563eb" 
                    opacity={0.7}
                    radius={[4, 4, 0, 0]}
                    name="Charts"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Accuracy %"
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </motion.div>
          
          {/* Chart Types Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg overflow-visible"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                Chart Types Processed
                </h3>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Distribution of different medical chart types
              </p>
            </div>
            <div className="w-full" style={{ height: '360px', minHeight: '360px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartTypes}
                      cx="50%"
                      cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                      dataKey="value"
                    >
                      {chartTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                      padding: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
                {chartTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: type.color }}
                    />
                  <span className="text-neutral-900 dark:text-white font-medium text-xs">{type.name}</span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-light ml-auto text-xs">{type.value}%</span>
                  </div>
                ))}
              </div>
          </motion.div>
        </section>

          {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                Weekly Activity
                </h3>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Total: <span className="font-semibold text-neutral-900 dark:text-white">
                  {weeklyActivity.reduce((sum, day) => sum + day.processed, 0)}
                </span> charts
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
              Charts processed per day this week
            </p>
          </div>
          <div className="h-72 w-full min-h-[288px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={288}>
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <style>{`
                    .recharts-cartesian-grid-horizontal line,
                    .recharts-cartesian-grid-vertical line {
                      stroke: hsl(var(--border));
                    }
                  `}</style>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [`${value} charts`, 'Processed']}
                />
                <Bar 
                  dataKey="processed" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]}
                  opacity={0.8}
                  name="Charts Processed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Account Security & Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-6 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                Account Security & Settings
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
              Manage your account security and preferences
            </p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-12 justify-start border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100" 
              onClick={handleSettings}
            >
              <Settings className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Account Settings</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Manage preferences</div>
              </div>
              </Button>
            <Button 
              variant="outline" 
              className="h-12 justify-start border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
              onClick={handlePrivacySettings}
            >
              <Shield className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Privacy Settings</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Control data access</div>
              </div>
              </Button>
            <Button 
              variant="outline" 
              className="h-12 justify-start border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-800 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Sign Out</div>
                <div className="text-xs font-light opacity-75">Log out of your account</div>
              </div>
            </Button>
          </div>
        </motion.div>

      </main>
    </div>
  )
}
