'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAccessibility } from './AccessibilityProvider'

interface SidebarItem {
  id: string
  title: string
  icon: string
  href: string
  color: string
  keywords: string[]
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    icon: '🎙️',
    href: '/voice',
    color: 'bg-blue-500 hover:bg-blue-600',
    keywords: ['voice', 'assistant', 'speak', 'talk', 'आवाज', 'बोलना', 'आवाज सहायक', 'குரல்', 'பேசு']
  },
  {
    id: 'deaf-mode',
    title: 'Deaf Mode',
    icon: '🧏',
    href: '/deaf-mode',
    color: 'bg-green-500 hover:bg-green-600',
    keywords: ['deaf', 'hearing', 'sign', 'बधिर', 'सुनना', 'செவிடு', 'கேட்க']
  },
  {
    id: 'learning-hub',
    title: 'Learning Hub',
    icon: '📚',
    href: '/learning',
    color: 'bg-purple-500 hover:bg-purple-600',
    keywords: ['learning', 'education', 'study', 'course', 'सीखना', 'शिक्षा', 'पढ़ाई', 'கற்றல்', 'படிப்பு']
  },
  {
    id: 'job-portal',
    title: 'Job Portal',
    icon: '💼',
    href: '/jobs',
    color: 'bg-orange-500 hover:bg-orange-600',
    keywords: ['job', 'work', 'career', 'employment', 'नौकरी', 'काम', 'रोजगार', 'வேலை', 'தொழில்']
  },
  {
    id: 'emergency-help',
    title: 'Emergency Help',
    icon: '🚨',
    href: '/help',
    color: 'bg-red-500 hover:bg-red-600',
    keywords: ['emergency', 'help', 'support', 'urgent', 'आपातकाल', 'मदद', 'सहायता', 'அவசரம்', 'உதவி']
  }
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { speak, settings } = useAccessibility()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNavigation = (item: SidebarItem) => {
    speak(`Opening ${item.title}`)
    router.push(item.href)
    if (isMobile) {
      onToggle() // Close sidebar on mobile after navigation
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, item: SidebarItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigation(item)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'w-80' : 'w-64'}`}
        aria-label="Main navigation sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">♿</span>
            <h2 className="text-xl font-bold text-white">JeetAble</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
            aria-label="Close sidebar"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4" role="navigation">
          <ul className="space-y-2" role="list">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <li key={item.id} role="listitem">
                  <button
                    onClick={() => handleNavigation(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group ${
                      isActive
                        ? `${item.color} text-white shadow-lg`
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={`Navigate to ${item.title}`}
                  >
                    <span 
                      className={`text-2xl transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-left flex-1">
                      {item.title}
                    </span>
                    {isActive && (
                      <span className="text-sm opacity-75">●</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Accessibility First Platform
            </p>
            <div className="flex justify-center space-x-2 text-xs text-gray-500">
              <span>Voice Enabled</span>
              <span>•</span>
              <span>Screen Reader Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-50 p-3 bg-primary-500 text-white rounded-lg shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        } ${isMobile && isOpen ? 'translate-x-80' : ''}`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        title={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span className="text-xl">
          {isOpen ? '✕' : '☰'}
        </span>
      </button>
    </>
  )
}

// Export sidebar items for use in AI agent
export { SIDEBAR_ITEMS }