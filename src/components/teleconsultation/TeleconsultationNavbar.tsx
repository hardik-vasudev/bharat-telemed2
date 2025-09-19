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
  LogOut,
  FileText,
  Pill,
  Brain,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TeleconsultationNavbarProps {
  onMenuClick: () => void;
  onOpenNotepad: () => void;
  onOpenPrescription: () => void;
  onOpenDiseasePrediction?: () => void;
  isNotepadOpen: boolean;
  isPrescriptionOpen: boolean;
}

export function TeleconsultationNavbar({
  onMenuClick,
  onOpenNotepad,
  onOpenPrescription,
  onOpenDiseasePrediction,
  isNotepadOpen,
  isPrescriptionOpen
}: TeleconsultationNavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMedKitOpen, setIsMedKitOpen] = useState(false);
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
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-2.5 shadow-sm">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Bharat Telemed</h1>
            <p className="text-xs text-emerald-600 font-medium">Teleconsultation</p>
          </div>
        </div>
      </div>

      {/* Center Section - Medical Tools */}
      <div className="flex items-center space-x-4">
        {/* Notes Button */}
        <button
          onClick={onOpenNotepad}
          className={`p-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
            isNotepadOpen
              ? 'bg-emerald-100 text-emerald-700 shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
          }`}
          title="Consultation Notes"
        >
          <FileText className="h-5 w-5" />
          {isNotepadOpen && <span className="text-sm font-medium hidden sm:block">Notes Active</span>}
        </button>

        {/* MedKit Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMedKitOpen(!isMedKitOpen)}
            className="p-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            title="Medical Toolkit"
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">MedKit</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMedKitOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* MedKit Dropdown */}
          {isMedKitOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[220px] z-50"
                 style={{ animation: 'fadeIn 0.2s ease-out' }}>

              {/* Prescription Builder Option */}
              <button
                onClick={() => {
                  onOpenPrescription();
                  setIsMedKitOpen(false);
                }}
                disabled={isPrescriptionOpen}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                  isPrescriptionOpen
                    ? 'bg-blue-50 text-blue-600 cursor-not-allowed'
                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${isPrescriptionOpen ? 'bg-blue-100' : 'bg-blue-50'}`}>
                  <Pill className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Quick Prescription</div>
                  <div className="text-xs text-gray-500">Build prescriptions fast</div>
                </div>
                {isPrescriptionOpen && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Disease Predictions Option */}
              <button
                onClick={() => {
                  onOpenDiseasePrediction?.();
                  setIsMedKitOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left hover:bg-purple-50 text-gray-700 hover:text-purple-600"
              >
                <div className="p-2 rounded-lg bg-purple-50">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Disease Predictions</div>
                  <div className="text-xs text-gray-500">AI-powered analysis</div>
                </div>
              </button>

              {/* Separator */}
              <div className="border-t border-gray-100 my-1"></div>

              {/* Status Info */}
              <div className="px-3 py-2 text-xs text-gray-500 text-center">
                {isNotepadOpen && isPrescriptionOpen && 'Multiple tools active'}
                {isNotepadOpen && !isPrescriptionOpen && 'Notes active'}
                {!isNotepadOpen && isPrescriptionOpen && 'Prescription active'}
                {!isNotepadOpen && !isPrescriptionOpen && 'Select a medical tool'}
              </div>
            </div>
          )}

          {/* Click outside to close */}
          {isMedKitOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMedKitOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center space-x-3">
        {/* Search Button */}
        <div className="hidden md:flex">
          <div className={`relative transition-all duration-300 ease-in-out ${
            isSearchExpanded ? 'w-64' : 'w-10'
          }`}>
            {isSearchExpanded ? (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 text-sm"
                  autoFocus
                  onBlur={() => setIsSearchExpanded(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
              >
                <Search className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
              </button>
            )}
          </div>
        </div>

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
                  <p className="text-sm text-gray-900 font-medium">Patient joined the call</p>
                  <p className="text-xs text-gray-600">John Smith is now in the meeting</p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900 font-medium">Lab report ready</p>
                  <p className="text-xs text-gray-600">Patient: Sarah Johnson</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
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
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
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
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Dashboard
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                Settings
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