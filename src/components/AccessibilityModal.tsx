'use client'

import { useAccessibility } from './AccessibilityProvider'
import { useEffect, useRef } from 'react'

interface AccessibilityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const { settings, updateSettings, speak } = useAccessibility()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
      speak('Accessibility settings modal opened')
    }
  }, [isOpen, speak])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleToggle = (setting: keyof typeof settings, label: string) => {
    const newValue = !settings[setting]
    updateSettings({ [setting]: newValue })
    speak(`${label} ${newValue ? 'enabled' : 'disabled'}`)
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 focus:outline-none"
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-2xl font-bold mb-6 text-gray-900">
          Accessibility Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="voice-nav" className="text-lg font-medium text-gray-700">
              Voice Navigation
            </label>
            <button
              id="voice-nav"
              onClick={() => handleToggle('voiceNavigation', 'Voice Navigation')}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible ${
                settings.voiceNavigation ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              aria-pressed={settings.voiceNavigation}
              aria-label={`Voice Navigation ${settings.voiceNavigation ? 'enabled' : 'disabled'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.voiceNavigation ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="deaf-mode" className="text-lg font-medium text-gray-700">
              Deaf Mode
            </label>
            <button
              id="deaf-mode"
              onClick={() => handleToggle('deafMode', 'Deaf Mode')}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible ${
                settings.deafMode ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              aria-pressed={settings.deafMode}
              aria-label={`Deaf Mode ${settings.deafMode ? 'enabled' : 'disabled'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.deafMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="dyslexic-font" className="text-lg font-medium text-gray-700">
              Dyslexia Font
            </label>
            <button
              id="dyslexic-font"
              onClick={() => handleToggle('dyslexicFont', 'Dyslexia Font')}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible ${
                settings.dyslexicFont ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              aria-pressed={settings.dyslexicFont}
              aria-label={`Dyslexia Font ${settings.dyslexicFont ? 'enabled' : 'disabled'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-lg font-medium text-gray-700">
              High Contrast
            </label>
            <button
              id="high-contrast"
              onClick={() => handleToggle('highContrast', 'High Contrast')}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible ${
                settings.highContrast ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              aria-pressed={settings.highContrast}
              aria-label={`High Contrast ${settings.highContrast ? 'enabled' : 'disabled'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}