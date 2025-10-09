'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'Not logged in',
    accessibilityNeeds: ['Please log in to see your preferences'],
    joinDate: new Date().toISOString().split('T')[0],
    isLoggedIn: false
  })

  useEffect(() => {
    // Check if user is logged in (you can replace this with actual auth logic)
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          let accessibilityNeeds = ['No preferences set']
          
          if (parsedUser.accessibilityNeeds) {
            if (typeof parsedUser.accessibilityNeeds === 'string') {
              try {
                accessibilityNeeds = JSON.parse(parsedUser.accessibilityNeeds)
              } catch {
                accessibilityNeeds = [parsedUser.accessibilityNeeds]
              }
            } else if (Array.isArray(parsedUser.accessibilityNeeds)) {
              accessibilityNeeds = parsedUser.accessibilityNeeds
            }
          }
          
          setUser({
            name: parsedUser.name || 'User',
            email: parsedUser.email || 'user@example.com',
            accessibilityNeeds: accessibilityNeeds,
            joinDate: parsedUser.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            isLoggedIn: true
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
    
    checkLoginStatus()
  }, [])
  const { settings, speak } = useAccessibility()

  useEffect(() => {
    speak('Welcome to your accessibility dashboard')
  }, [speak])

  const quickActions = [
    { title: 'Voice Assistant', icon: '🎤', href: '/voice', color: 'bg-blue-500' },
    { title: 'Deaf Mode', icon: '👂', href: '/deaf-mode', color: 'bg-green-500' },
    { title: 'Learning Hub', icon: '📚', href: '/learning', color: 'bg-purple-500' },
    { title: 'Job Search', icon: '💼', href: '/jobs', color: 'bg-orange-500' },
    { title: 'Emergency Help', icon: '🚨', href: '/help', color: 'bg-red-500' },
    { title: 'Settings', icon: '⚙️', href: '/settings', color: 'bg-gray-500' }
  ]

  const recentActivity = [
    { action: 'Completed Sign Language Lesson 3', time: '2 hours ago', icon: '🤟' },
    { action: 'Applied to Frontend Developer position', time: '1 day ago', icon: '💼' },
    { action: 'Used Speech-to-Text converter', time: '2 days ago', icon: '🎤' },
    { action: 'Updated accessibility preferences', time: '3 days ago', icon: '⚙️' }
  ]

  const accessibilityStats = [
    { label: 'Voice Commands Used', value: '127', icon: '🎤' },
    { label: 'Learning Sessions', value: '23', icon: '📚' },
    { label: 'Jobs Applied', value: '8', icon: '💼' },
    { label: 'Days Active', value: '45', icon: '📅' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8" role="main">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-primary-100 text-lg">
            Your personalized accessibility dashboard is ready to help you navigate the digital world.
          </p>
          <button
            onClick={() => speak(`Welcome to your dashboard, ${user.name}. You have access to voice navigation, learning resources, job opportunities, and emergency assistance.`)}
            className="mt-4 bg-white text-primary-600 px-6 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible transition-colors"
          >
            🔊 Hear Dashboard Overview
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">🚀 Quick Actions</h2>
              <p className="text-gray-600 mb-4">Use the sidebar menu (☰) or voice commands to navigate quickly!</p>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 focus:outline-none focus-visible transition-opacity text-center group`}
                    onClick={() => speak(`Opening ${action.title}`)}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div className="font-medium">{action.title}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Accessibility Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">📊 Your Activity</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {accessibilityStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">📋 Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl mr-4">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Login Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">👤 Login Information</h2>
              {user.isLoggedIn ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600 font-medium">Logged In</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm text-red-600 font-medium">Not Logged In</span>
                  </div>
                  <p className="text-gray-600 mb-4">Please log in to access personalized features</p>
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors text-center block"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible transition-colors text-center block"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
              {user.isLoggedIn && (
                <div className="mt-4 space-y-2">
                  <Link
                    href="/profile"
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors text-center block"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('authToken')
                      localStorage.removeItem('userData')
                      setUser({
                        name: 'Guest User',
                        email: 'Not logged in',
                        accessibilityNeeds: ['Please log in to see your preferences'],
                        joinDate: new Date().toISOString().split('T')[0],
                        isLoggedIn: false
                      })
                      speak('You have been logged out')
                    }}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus-visible transition-colors text-center"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Accessibility Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">♿ Current Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Navigation</span>
                  <span className={`px-2 py-1 rounded text-xs ${settings.voiceNavigation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {settings.voiceNavigation ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deaf Mode</span>
                  <span className={`px-2 py-1 rounded text-xs ${settings.deafMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {settings.deafMode ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dyslexic Font</span>
                  <span className={`px-2 py-1 rounded text-xs ${settings.dyslexicFont ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {settings.dyslexicFont ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Contrast</span>
                  <span className={`px-2 py-1 rounded text-xs ${settings.highContrast ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {settings.highContrast ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* Accessibility Preferences */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">🎯 Accessibility Preferences</h2>
              {user.isLoggedIn ? (
                <div>
                  <div className="space-y-2 mb-4">
                    {Array.isArray(user.accessibilityNeeds) && user.accessibilityNeeds.length > 0 ? user.accessibilityNeeds.map((need, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {need}
                      </span>
                    )) : (
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        No preferences set
                      </span>
                    )}
                  </div>
                  <Link
                    href="/settings"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus-visible"
                  >
                    Update preferences →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-blue-700 mb-3">Log in to set your accessibility preferences</p>
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus-visible"
                  >
                    Log in to customize →
                  </Link>
                </div>
              )}
            </div>

            {/* Support */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-900">🤝 Need Help?</h2>
              <div className="space-y-3">
                <Link
                  href="/help"
                  className="block text-green-700 hover:text-green-900 focus:outline-none focus-visible"
                >
                  🚨 Emergency Support
                </Link>
                <Link
                  href="/support"
                  className="block text-green-700 hover:text-green-900 focus:outline-none focus-visible"
                >
                  💬 Live Chat Support
                </Link>
                <Link
                  href="/feedback"
                  className="block text-green-700 hover:text-green-900 focus:outline-none focus-visible"
                >
                  📝 Send Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}