'use client'

import Link from 'next/link'
<<<<<<< HEAD
import { useAccessibility } from './AccessibilityProvider'

export default function Navbar() {
=======
import { useState } from 'react'
import { useAccessibility } from './AccessibilityProvider'
import AccessibilityModal from './AccessibilityModal'

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
>>>>>>> 16046fa464964c20bd9bd45317c5538d9e2ffc2a
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
              aria-label="JeetAble Home"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm" aria-hidden="true">JA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JeetAble</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
<<<<<<< HEAD
            {/* Navigation items removed - focusing on blind users only */}
=======
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
              aria-label="Open accessibility settings"
            >
              ⚙️ Settings
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/check');
                  const data = await response.json();
                  
                  if (data.hasAdmin) {
                    window.location.href = '/admin/login';
                  } else {
                    window.location.href = '/admin/signup';
                  }
                  handleNavClick('admin');
                } catch (error) {
                  window.location.href = '/admin/signup';
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus-visible transition-colors"
            >
              Admin
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
>>>>>>> 16046fa464964c20bd9bd45317c5538d9e2ffc2a
          </div>
        </div>
      </div>

<<<<<<< HEAD

=======
      <AccessibilityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
>>>>>>> 16046fa464964c20bd9bd45317c5538d9e2ffc2a
    </nav>
  )
}