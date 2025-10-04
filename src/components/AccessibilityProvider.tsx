'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilitySettings {
  voiceNavigation: boolean
  deafMode: boolean
  dyslexicFont: boolean
  highContrast: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  speak: (text: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    voiceNavigation: false,
    deafMode: false,
    dyslexicFont: false,
    highContrast: false,
  })

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    const body = document.body
    if (settings.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    if (settings.dyslexicFont) {
      body.classList.add('dyslexic-font')
    } else {
      body.classList.remove('dyslexic-font')
    }
  }, [settings])

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}