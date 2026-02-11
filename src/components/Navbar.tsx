'use client'

import Link from 'next/link'
import { useAccessibility } from './AccessibilityProvider'

export default function Navbar() {
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
            {/* Navigation items removed - focusing on blind users only */}
          </div>
        </div>
      </div>


    </nav>
  )
}