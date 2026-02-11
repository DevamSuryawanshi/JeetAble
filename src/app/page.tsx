'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function Home() {
  const { speak } = useAccessibility()

  useEffect(() => {
    speak('Welcome to JeetAble. Your digital accessibility companion.')
  }, [speak])

  const features = [
    {
      title: 'Daily News',
      description: 'Latest headlines from trusted Indian news sources',
      icon: '🗞️',
      href: '/news',
      color: 'bg-blue-500'
    },
    {
      title: 'Government Schemes',
      description: 'Explore latest government initiatives and programs',
      icon: '🏛️',
      href: '/schemes',
      color: 'bg-indigo-500'
    },
    {
      title: 'Learning Hub',
      description: 'Accessible learning resources and tools',
      icon: '📚',
      href: '/learning',
      color: 'bg-purple-500'
    },
    {
      title: 'Job Portal',
      description: 'Find disability-friendly employment opportunities',
      icon: '💼',
      href: '/jobs',
      color: 'bg-orange-500'
    },
    {
      title: '🇮🇳 Emergency Help & Support (India)',
      description: 'Indian emergency numbers and nearby services',
      icon: '🚨',
      href: '/help',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main role="main">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center" aria-labelledby="hero-title">
          <div className="max-w-4xl mx-auto">
            <h1 id="hero-title" className="text-5xl font-bold text-gray-900 mb-6">
              Empowering Digital <span className="text-primary-500">Accessibility</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A comprehensive platform designed to help blind users learn, communicate, 
              and navigate the digital world with confidence and independence.
            </p>
            <button
              onClick={() => speak('Welcome to JeetAble. This platform provides voice navigation, learning resources, job opportunities, and emergency assistance for blind users.')}
              className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
              aria-label="Play welcome message"
            >
              🔊 Play Welcome Message
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4" aria-labelledby="features-title">
          <div className="max-w-6xl mx-auto">
            <h2 id="features-title" className="text-3xl font-bold text-center text-gray-900 mb-12">
              Accessibility Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible group"
                  onClick={() => speak(`Opening ${feature.title}`)}
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <span role="img" aria-label={feature.title}>{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* College Logo Section */}
        <section className="py-16 bg-white" aria-labelledby="college-section">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 id="college-section" className="text-3xl font-bold mb-8 text-gray-900">Developed at</h2>
            <div className="flex justify-center">
              <img 
                src="/mitaoelogo.png" 
                alt="MIT Academy of Engineering - An Autonomous Institute Affiliated to Savitribai Phule Pune University"
                className="max-w-md w-full h-auto"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">JeetAble</h3>
              <p className="text-gray-300">
                Empowering digital accessibility for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white focus:outline-none focus-visible">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white focus:outline-none focus-visible">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white focus:outline-none focus-visible">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
              <ul className="space-y-2">
                <li><Link href="/accessibility" className="text-gray-300 hover:text-white focus:outline-none focus-visible">Accessibility Statement</Link></li>
                <li><Link href="/feedback" className="text-gray-300 hover:text-white focus:outline-none focus-visible">Feedback</Link></li>
                <li><Link href="/support" className="text-gray-300 hover:text-white focus:outline-none focus-visible">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 JeetAble. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  )
}