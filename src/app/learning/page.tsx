'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import VoiceAssistant from '@/components/VoiceAssistant'
import VoiceContentRecommendation from '@/components/VoiceContentRecommendation'

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState('voice')

  const categories = [
    { id: 'voice', name: '🎤 Voice Search', icon: '🎙️' },
    { id: 'audiobooks', name: '📚 AudioBooks', icon: '📖' },
    { id: 'speeches', name: '🎤 Inspiring Speeches', icon: '💬' },
    { id: 'talks', name: '🎯 Talks', icon: '🗣️' },
    { id: 'podcasts', name: '🎧 Podcasts', icon: '🎙️' },
    { id: 'interviews', name: '💼 Interviews', icon: '🎬' }
  ]

  const audiobooks = [
    { title: 'Think and Grow Rich', author: 'Napoleon Hill', duration: '10h', topic: 'Success & Finance' },
    { title: 'The Power of Now', author: 'Eckhart Tolle', duration: '7h', topic: 'Mindset' },
    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', duration: '6h', topic: 'Finance' },
    { title: 'Atomic Habits', author: 'James Clear', duration: '5h', topic: 'Habits & Productivity' }
  ]

  const speeches = [
    { title: 'Steve Jobs Stanford Speech', speaker: 'Steve Jobs', duration: '15min', topic: 'Motivation' },
    { title: 'The Last Lecture', speaker: 'Randy Pausch', duration: '76min', topic: 'Life Lessons' },
    { title: 'I Have a Dream', speaker: 'Martin Luther King Jr.', duration: '17min', topic: 'Inspiration' },
    { title: 'The Fringe Benefits of Failure', speaker: 'J.K. Rowling', duration: '21min', topic: 'Success' }
  ]

  const talks = [
    { title: 'How Great Leaders Inspire Action', speaker: 'Simon Sinek', duration: '18min', topic: 'Leadership' },
    { title: 'The Power of Vulnerability', speaker: 'Brené Brown', duration: '20min', topic: 'Courage' },
    { title: 'Your Body Language Shapes Who You Are', speaker: 'Amy Cuddy', duration: '21min', topic: 'Confidence' },
    { title: 'The Happy Secret to Better Work', speaker: 'Shawn Achor', duration: '12min', topic: 'Happiness' }
  ]

  const podcasts = [
    { title: 'The Tim Ferriss Show', host: 'Tim Ferriss', duration: '60min', topic: 'Success & Business' },
    { title: 'How I Built This', host: 'Guy Raz', duration: '45min', topic: 'Entrepreneurship' },
    { title: 'The Mindset Mentor', host: 'Rob Dial', duration: '15min', topic: 'Mindset' },
    { title: 'Smart Passive Income', host: 'Pat Flynn', duration: '50min', topic: 'Business' }
  ]

  const interviews = [
    { title: 'Elon Musk Interview', interviewer: 'Lex Fridman', duration: '90min', topic: 'Innovation' },
    { title: 'Warren Buffett on Investing', interviewer: 'CNBC', duration: '60min', topic: 'Finance' },
    { title: 'Oprah Winfrey Life Lessons', interviewer: 'SuperSoul', duration: '45min', topic: 'Success' },
    { title: 'Bill Gates on Future Tech', interviewer: 'Bloomberg', duration: '55min', topic: 'Technology' }
  ]

  const renderContent = (items: any[], type: string) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {item.duration}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-gray-600 mb-3">
            {item.author || item.speaker || item.host || item.interviewer}
          </p>
          <div className="mb-4">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              {item.topic}
            </span>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors">
            ▶️ Play Now
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-600">
            Discover audiobooks, speeches, talks, podcasts, and interviews
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="mb-8">
          {activeTab === 'voice' && <VoiceContentRecommendation />}
          
          {activeTab === 'audiobooks' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 AudioBooks</h2>
              {renderContent(audiobooks, 'audiobook')}
            </div>
          )}
          
          {activeTab === 'speeches' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎤 Inspiring Speeches</h2>
              {renderContent(speeches, 'speech')}
            </div>
          )}
          
          {activeTab === 'talks' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Talks</h2>
              {renderContent(talks, 'talk')}
            </div>
          )}
          
          {activeTab === 'podcasts' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎧 Podcasts</h2>
              {renderContent(podcasts, 'podcast')}
            </div>
          )}
          
          {activeTab === 'interviews' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">💼 Interviews</h2>
              {renderContent(interviews, 'interview')}
            </div>
          )}
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}