"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Video,
  Calendar,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  Activity,
  Monitor,
  Stethoscope,
  ClipboardList,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNavigationItems = (pathname: string) => [
  {
    name: "Dashboard",
    icon: Monitor,
    href: "/dashboard",
    active: pathname === "/dashboard",
    count: null
  },
  {
    name: "Teleconsultations",
    icon: Video,
    href: "/teleconsultations",
    active: pathname.startsWith("/teleconsultation"),
    count: 5,
    subItems: [
      { name: "Start Consultation", href: "/teleconsultation" },
      { name: "Live Sessions", href: "/teleconsultations/live" },
      { name: "Scheduled", href: "/teleconsultations/scheduled" },
      { name: "Completed", href: "/teleconsultations/completed" }
    ]
  },
  {
    name: "Appointments",
    icon: Calendar,
    href: "/bookings",
    active: pathname.startsWith("/bookings"),
    count: 12,
    subItems: [
      { name: "Today's Schedule", href: "/bookings/today" },
      { name: "Upcoming", href: "/bookings/upcoming" },
      { name: "Past Records", href: "/bookings/past" }
    ]
  },
  {
    name: "Patients",
    icon: UserCheck,
    href: "/patients",
    active: pathname.startsWith("/patients"),
    count: null,
    subItems: [
      { name: "Patient Records", href: "/patients/records" },
      { name: "Medical History", href: "/patients/history" },
      { name: "Lab Reports", href: "/patients/reports" }
    ]
  },
  {
    name: "Prescriptions",
    icon: ClipboardList,
    href: "/prescriptions",
    active: pathname.startsWith("/prescriptions"),
    count: 3,
    subItems: [
      { name: "Create Prescription", href: "/prescriptions/create" },
      { name: "All Prescriptions", href: "/prescriptions" },
      { name: "Templates", href: "/prescriptions/templates" }
    ]
  }
];


export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close mobile sidebar after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Sidebar Header - Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-md">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Bharat Telemed</h1>
              <p className="text-xs text-gray-500 font-medium">Doctor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Navigation
              </span>
            </div>

            {getNavigationItems(pathname).map((item) => (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleExpanded(item.name);
                    } else {
                      handleNavigation(item.href);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group
                    ${item.active
                      ? 'bg-gradient-to-r from-brand-50 to-brand-100 text-brand-900 font-semibold border border-brand-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 font-medium hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`h-4 w-4 ${item.active ? 'text-brand-600' : 'text-gray-500 group-hover:text-gray-600'}`}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.count && (
                      <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {item.count}
                      </span>
                    )}
                    {item.subItems && (
                      <ChevronRight
                        className={`h-3 w-3 text-gray-400 transition-transform ${
                          expandedItems.includes(item.name) ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* Sub Items */}
                {item.subItems && expandedItems.includes(item.name) && (
                  <div className="ml-7 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => handleNavigation(subItem.href)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === subItem.href
                            ? 'text-emerald-700 bg-emerald-50 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
              <Settings className="h-4 w-4 text-gray-500 group-hover:text-gray-600" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
              <HelpCircle className="h-4 w-4 text-gray-500 group-hover:text-gray-600" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}