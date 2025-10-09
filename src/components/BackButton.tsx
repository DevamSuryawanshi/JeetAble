'use client'

import { useRouter } from 'next/navigation'
import { useAccessibility } from './AccessibilityProvider'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export default function BackButton({ 
  href = '/dashboard', 
  label = 'Back to Dashboard',
  className = ''
}: BackButtonProps) {
  const router = useRouter()
  const { speak } = useAccessibility()

  const handleBack = () => {
    speak(`Going back to dashboard`)
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleBack()
    }
  }

  return (
    <button
      onClick={handleBack}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${className}`}
      aria-label={label}
      title={label}
    >
      <span className="text-lg">←</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}