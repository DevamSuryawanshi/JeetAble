'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAccessibility } from './AccessibilityProvider'
import AccessibilityModal from './AccessibilityModal'

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { speak } = useAccessibility()

  const handleNavClick = (text: string) => {
    speak(`Navigating to ${text}`)
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary-500" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus:outline-none focus-visible"
              onClick={() => handleNavClick('home')}
              aria-label="Accessible Assist Home"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm" aria-hidden="true">AA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Accessible Assist</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
              aria-label="Open accessibility settings"
            >
              ⚙️ Settings
            </button>
            
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible"
              onClick={() => handleNavClick('login')}
            >
              Login
            </Link>
            
            <Link
              href="/auth/signup"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
              onClick={() => handleNavClick('sign up')}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </nav>
  )
}