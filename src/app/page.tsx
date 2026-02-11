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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <main role="main">
        {/* Hero Section */}
        <section className="py-24 px-4 text-center" aria-labelledby="hero-title">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 animate-bounce">
              <span className="text-8xl">♿</span>
            </div>
            <h1 id="hero-title" className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 leading-tight">
              JeetAble
            </h1>
            <p className="text-3xl font-bold text-gray-800 mb-4">
              Empowering Blind Users
            </p>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Navigate the digital world with confidence through voice assistance, accessible learning, and comprehensive support designed specifically for you.
            </p>
            <button
              onClick={() => speak('Welcome to JeetAble. This platform provides voice navigation, learning resources, job opportunities, and emergency assistance for blind users.')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105 shadow-2xl"
              aria-label="Play welcome message"
            >
              🔊 Play Welcome Message
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-title" className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-16">
              Our Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-purple-300 group border-2 border-transparent hover:border-purple-200"
                  onClick={() => speak(`Opening ${feature.title}`)}
                >
                  <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <span role="img" aria-label={feature.title}>{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* College Logo Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50" aria-labelledby="college-section">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 id="college-section" className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Developed at</h2>
            <div className="flex justify-center bg-white rounded-3xl shadow-2xl p-8">
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
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white py-16" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-2">♿</span> JeetAble
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Empowering blind users with accessible digital solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Accessibility</h3>
              <ul className="space-y-3">
                <li><Link href="/accessibility" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">Accessibility Statement</Link></li>
                <li><Link href="/feedback" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">Feedback</Link></li>
                <li><Link href="/support" className="text-gray-300 hover:text-purple-300 focus:outline-none focus-visible transition-colors text-lg">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-8 text-center">
            <p className="text-gray-300 text-lg">&copy; 2024 JeetAble. All rights reserved. Made with ❤️ for accessibility.</p>
          </div>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  )
}