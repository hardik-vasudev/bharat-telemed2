"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Clock,
  User,
  Calendar,
  FileText,
  Video,
  TrendingUp
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = [
  "John Smith patient",
  "diabetes consultation",
  "lab reports",
  "today appointments"
];

const quickActions = [
  {
    icon: Calendar,
    label: "Schedule Appointment",
    description: "Book a new patient appointment",
    shortcut: "⌘ + A"
  },
  {
    icon: Video,
    label: "Start Consultation",
    description: "Begin immediate teleconsultation",
    shortcut: "⌘ + C"
  },
  {
    icon: FileText,
    label: "Create Prescription",
    description: "Write new prescription",
    shortcut: "⌘ + P"
  },
  {
    icon: User,
    label: "Add Patient",
    description: "Register new patient",
    shortcut: "⌘ + N"
  }
];

const searchResults = [
  {
    type: "patient",
    icon: User,
    title: "John Smith",
    description: "Age 45 • Last visit: 2 days ago",
    metadata: "Patient ID: PAT001"
  },
  {
    type: "appointment",
    icon: Calendar,
    title: "Appointment with Sarah Johnson",
    description: "Today at 2:00 PM • Cardiology",
    metadata: "Room 101"
  },
  {
    type: "prescription",
    icon: FileText,
    title: "Metformin 500mg",
    description: "Prescribed to Mike Davis",
    metadata: "Valid until: Dec 15, 2024"
  }
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        // Handle selection
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-medical-200 p-4">
          <Search className="h-5 w-5 text-medical-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, appointments, prescriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-medical-900 placeholder-medical-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-medical-100 rounded-lg transition-colors ml-2"
          >
            <X className="h-4 w-4 text-medical-500" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-medical-500" />
                  <span className="text-sm font-medium text-medical-700">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-3 py-2 text-sm text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-medical-500" />
                  <span className="text-sm font-medium text-medical-700">Quick Actions</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-3 p-3 hover:bg-medical-50 rounded-lg transition-colors group"
                    >
                      <div className="w-8 h-8 bg-medical-100 rounded-lg flex items-center justify-center group-hover:bg-medical-200 transition-colors">
                        <action.icon className="h-4 w-4 text-medical-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-medical-900">{action.label}</p>
                        <p className="text-xs text-medical-600">{action.description}</p>
                      </div>
                      <span className="text-xs text-medical-400 font-mono">{action.shortcut}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Search Results */}
              <div className="space-y-1">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                      index === activeIndex
                        ? 'bg-medical-100 border border-medical-300'
                        : 'hover:bg-medical-50'
                    }`}
                  >
                    <div className="w-8 h-8 bg-medical-100 rounded-lg flex items-center justify-center">
                      <result.icon className="h-4 w-4 text-medical-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-medical-900">{result.title}</p>
                      <p className="text-xs text-medical-600">{result.description}</p>
                      <p className="text-xs text-medical-500 mt-1">{result.metadata}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Search Tips */}
              <div className="mt-4 pt-4 border-t border-medical-200">
                <p className="text-xs text-medical-500">
                  Press <kbd className="px-1 py-0.5 bg-medical-100 rounded text-medical-700">↑</kbd>{" "}
                  <kbd className="px-1 py-0.5 bg-medical-100 rounded text-medical-700">↓</kbd> to navigate,{" "}
                  <kbd className="px-1 py-0.5 bg-medical-100 rounded text-medical-700">Enter</kbd> to select,{" "}
                  <kbd className="px-1 py-0.5 bg-medical-100 rounded text-medical-700">Esc</kbd> to close
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}