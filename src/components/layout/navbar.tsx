"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  Bell,
  User,
  Menu,
  Stethoscope,
  ChevronDown,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
      setIsProfileOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Left Section - Logo and Menu */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-2.5 shadow-sm">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Bharat Telemed</h1>
            <p className="text-xs text-gray-500 font-medium">Doctor Dashboard</p>
          </div>
        </div>
      </div>

      {/* Center Section - Expandable Search */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-8 justify-center">
        <div className={`relative transition-all duration-300 ease-in-out ${
          isSearchExpanded ? 'w-full max-w-md' : 'w-10'
        }`}>
          {isSearchExpanded ? (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-gray-50/50 text-sm"
                autoFocus
                onBlur={() => setIsSearchExpanded(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
            >
              <Search className="h-5 w-5 text-gray-600 group-hover:text-brand-600" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Chat Button */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group">
          <MessageCircle className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-semibold">3</span>
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900 font-medium">New appointment request</p>
                  <p className="text-xs text-gray-600">Patient: John Smith - 2:00 PM</p>
                  <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900 font-medium">Lab report ready</p>
                  <p className="text-xs text-gray-600">Patient: Sarah Johnson</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900 font-medium">Prescription refill request</p>
                  <p className="text-xs text-gray-600">Patient: Mike Davis</p>
                  <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {user?.user_metadata?.full_name || 'Doctor'}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {user?.user_metadata?.specialization?.split(',')[0] || 'Healthcare Professional'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.user_metadata?.full_name || 'Doctor'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                Help & Support
              </button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}