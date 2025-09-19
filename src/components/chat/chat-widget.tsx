"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Circle,
  MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'doctor' | 'patient' | 'nurse';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  role: 'patient' | 'nurse' | 'support';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello Doctor, I wanted to follow up on my recent blood test results.',
    sender: 'patient',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text',
    status: 'read'
  },
  {
    id: '2',
    content: 'Hi Sarah! I just reviewed your results. Your blood sugar levels have improved significantly. The medication adjustment is working well.',
    sender: 'doctor',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'text',
    status: 'read'
  },
  {
    id: '3',
    content: 'That\'s great news! Should I continue with the same dosage?',
    sender: 'patient',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text',
    status: 'read'
  },
  {
    id: '4',
    content: 'Yes, continue with the current dosage. Let\'s schedule a follow-up in 3 weeks to monitor your progress.',
    sender: 'doctor',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text',
    status: 'delivered'
  }
];

const activeChats: ChatUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'patient',
    isOnline: true
  },
  {
    id: '2',
    name: 'Nurse Emma',
    role: 'nurse',
    isOnline: true
  },
  {
    id: '3',
    name: 'Mike Davis',
    role: 'patient',
    isOnline: false,
    lastSeen: '5 min ago'
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatUser>(activeChats[0]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mockMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-medical-600 hover:bg-medical-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          3
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl border border-medical-200 flex flex-col z-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-medical-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-medical-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {activeChat.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {activeChat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm">{activeChat.name}</h3>
            <div className="flex items-center space-x-1">
              {activeChat.isOnline ? (
                <div className="flex items-center space-x-1">
                  <Circle className="h-3 w-3 text-green-300 fill-green-300" />
                  <span className="text-xs text-medical-100">Online</span>
                </div>
              ) : (
                <span className="text-xs text-medical-200">{activeChat.lastSeen}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-medical-700 rounded-lg transition-colors">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-medical-700 rounded-lg transition-colors">
            <Video className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-medical-700 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-medical-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="border-b border-medical-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {activeChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeChat.id === chat.id
                  ? 'bg-medical-100 text-medical-900'
                  : 'text-medical-600 hover:bg-medical-50'
              }`}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-medical-200 rounded-full flex items-center justify-center">
                  <span className="text-xs">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium">{chat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 ${
                msg.sender === 'doctor'
                  ? 'bg-medical-600 text-white'
                  : 'bg-medical-100 text-medical-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${
                  msg.sender === 'doctor' ? 'text-medical-200' : 'text-medical-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </span>
                {msg.sender === 'doctor' && (
                  <div className="flex space-x-1">
                    <div className={`w-1 h-1 rounded-full ${
                      msg.status === 'read' ? 'bg-medical-300' : 'bg-medical-400'
                    }`}></div>
                    <div className={`w-1 h-1 rounded-full ${
                      msg.status === 'read' ? 'bg-medical-300' : 'bg-medical-400'
                    }`}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-medical-100 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3 text-medical-600 animate-pulse" />
                <span className="text-xs text-medical-600">Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-medical-200 p-3">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-medical-500 hover:text-medical-600 transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent text-sm"
            />
          </div>
          <button className="p-2 text-medical-500 hover:text-medical-600 transition-colors">
            <Smile className="h-4 w-4" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}