'use client'

import Link from 'next/link'
import { useAccessibility } from './AccessibilityProvider'

export default function Navbar() {
  const { speak } = useAccessibility()

  const handleNavClick = (text: string) => {
    speak(`Navigating to ${text}`)
  }

  return (
    <nav className="bg-white shadow-xl border-b-4 border-gradient-to-r from-blue-500 to-purple-500" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-lg px-2 py-1 transition-all"
              onClick={() => handleNavClick('home')}
              aria-label="JeetAble Home"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl" aria-hidden="true">JA</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JeetAble</span>
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
