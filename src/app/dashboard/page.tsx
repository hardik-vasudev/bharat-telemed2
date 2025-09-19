'use client'

import {
  Calendar,
  Users,
  Activity,
  Clock,
  TrendingUp,
  Video,
  FileText,
  AlertCircle,
  Heart,
  Pill,
  Brain,
  Shield,
  ArrowRight,
  Phone,
  MessageSquare,
  BarChart3,
  TrendingDown,
  CheckCircle2
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useAuthRedirect";

const todayMetrics = [
  {
    title: "Active Consultations",
    value: "12",
    change: "+3 from yesterday",
    trend: "up",
    icon: Video,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700"
  },
  {
    title: "Patients Treated",
    value: "47",
    change: "+8 today",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700"
  },
  {
    title: "Prescriptions Issued",
    value: "23",
    change: "+5 pending",
    trend: "up",
    icon: Pill,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700"
  },
  {
    title: "Avg. Response Time",
    value: "2.3m",
    change: "-30s improved",
    trend: "down",
    icon: Clock,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700"
  }
];

const upcomingConsultations = [
  {
    id: 1,
    patient: "Sarah Johnson",
    time: "2:00 PM",
    type: "Follow-up",
    condition: "Diabetes Management",
    priority: "normal",
    avatar: "SJ",
    vitals: { bp: "120/80", hr: "72 bpm", temp: "98.6°F" }
  },
  {
    id: 2,
    patient: "Michael Chen",
    time: "2:30 PM",
    type: "Initial Consultation",
    condition: "Chest Pain",
    priority: "urgent",
    avatar: "MC",
    vitals: { bp: "140/90", hr: "88 bpm", temp: "99.1°F" }
  },
  {
    id: 3,
    patient: "Emily Davis",
    time: "3:00 PM",
    type: "Mental Health",
    condition: "Anxiety Follow-up",
    priority: "normal",
    avatar: "ED",
    vitals: { bp: "118/75", hr: "68 bpm", temp: "98.4°F" }
  }
];

const quickActions = [
  {
    title: "Start Emergency Consultation",
    description: "Immediate patient care",
    icon: AlertCircle,
    action: "emergency",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700"
  },
  {
    title: "Schedule New Appointment",
    description: "Book patient consultation",
    icon: Calendar,
    action: "schedule",
    color: "from-brand-500 to-brand-600",
    bgColor: "bg-brand-50",
    textColor: "text-brand-700"
  },
  {
    title: "Review Lab Results",
    description: "3 pending reports",
    icon: FileText,
    action: "labs",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700"
  },
  {
    title: "Patient Health Monitoring",
    description: "View vital trends",
    icon: BarChart3,
    action: "monitoring",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "consultation_completed",
    message: "Completed consultation with Maria Garcia",
    time: "15 minutes ago",
    icon: CheckCircle2,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "prescription_sent",
    message: "Prescription sent to John Smith",
    time: "32 minutes ago",
    icon: Pill,
    color: "text-purple-600"
  },
  {
    id: 3,
    type: "lab_reviewed",
    message: "Lab results reviewed for David Wilson",
    time: "1 hour ago",
    icon: FileText,
    color: "text-blue-600"
  },
  {
    id: 4,
    type: "appointment_scheduled",
    message: "New appointment scheduled with Lisa Brown",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-indigo-600"
  }
];

export default function DashboardPage() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">
            Good afternoon, {user?.user_metadata?.full_name || 'Doctor'}
          </h1>
          <p className="text-body mt-1">Here&apos;s your practice overview for today</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-outline flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>View Schedule</span>
          </button>
          <button className="btn btn-primary flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>Start Consultation</span>
          </button>
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayMetrics.map((metric) => (
          <div key={metric.title} className="glass-card card-hover p-6 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-caption uppercase tracking-wider text-gray-500 font-semibold">
                  {metric.title}
                </p>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className={`text-sm font-medium flex items-center space-x-1 ${
                    metric.trend === 'up' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`h-6 w-6 ${metric.textColor}`} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${metric.color}`} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Consultations */}
        <div className="lg:col-span-2 glass-card card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="heading-3">Today&apos;s Consultations</h2>
              <p className="text-body mt-1">3 appointments scheduled</p>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {upcomingConsultations.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      appointment.priority === 'urgent' ? 'bg-red-500' : 'bg-brand-500'
                    }`}>
                      {appointment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                        {appointment.priority === 'urgent' && (
                          <span className="status-badge bg-red-100 text-red-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {appointment.type} • {appointment.condition}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>BP: {appointment.vitals.bp}</span>
                        <span>HR: {appointment.vitals.hr}</span>
                        <span>Temp: {appointment.vitals.temp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{appointment.time}</div>
                      <div className="text-xs text-gray-500">Today</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors">
                        <Video className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-card card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3">Recent Activity</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mt-0.5">
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-5">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            className="glass-card card-hover p-6 text-left group relative overflow-hidden"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-6 w-6 ${action.textColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${action.color} group-hover:w-full transition-all duration-300`} />
          </button>
        ))}
      </div>

      {/* Health Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3">Patient Health Insights</h2>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View Report
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Cardiovascular Health</div>
                  <div className="text-sm text-gray-600">85% patients improving</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">85%</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Mental Health</div>
                  <div className="text-sm text-gray-600">78% satisfaction rate</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">78%</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Preventive Care</div>
                  <div className="text-sm text-gray-600">92% compliance</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">92%</div>
            </div>
          </div>
        </div>

        <div className="glass-card card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3">Practice Performance</h2>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Analytics
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patient Satisfaction</span>
                <span className="text-sm font-bold text-gray-900">4.8/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full" style={{width: '96%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Response Time</span>
                <span className="text-sm font-bold text-gray-900">2.3 min avg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '88%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Follow-up Rate</span>
                <span className="text-sm font-bold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}