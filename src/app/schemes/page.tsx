'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import { useAccessibility } from '@/components/AccessibilityProvider'

interface Scheme {
  title: string
  description: string
  link: string
  category: string
  ministry: string
  lastUpdated: string
}

const CATEGORIES = [
  'All Categories',
  'Disability',
  'Healthcare', 
  'Education',
  'Employment',
  'Technology',
  'Housing',
  'Financial Inclusion',
  'Women Empowerment'
]

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [lastUpdated, setLastUpdated] = useState('')
  const { speak } = useAccessibility()

  useEffect(() => {
    speak('Government Schemes page loaded. Loading latest schemes...')
    fetchSchemes()
  }, [speak])

  const fetchSchemes = async (category?: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/government-schemes')
      const data = await response.json()
      
      if (data.success) {
        let filteredSchemes = data.data
        if (category && category !== 'All Categories') {
          filteredSchemes = data.data.filter((scheme: any) => 
            scheme.schemeName.toLowerCase().includes(category.toLowerCase()) ||
            scheme.description.toLowerCase().includes(category.toLowerCase())
          )
        }
        setSchemes(filteredSchemes)
        setLastUpdated(new Date().toISOString())
        speak(`Loaded ${filteredSchemes.length} government schemes`)
      } else {
        setError('Failed to load schemes')
        speak('Failed to load government schemes')
      }
    } catch (error) {
      console.error('Error fetching schemes:', error)
      setError('Network error while loading schemes')
      speak('Network error while loading schemes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    fetchSchemes(category)
    speak(`Filtering schemes by ${category}`)
  }

  const readAloud = (title: string, description: string, ministry: string) => {
    speak(`${title}. ${description}. Managed by ${ministry}.`)
  }

  const openScheme = (link: string, title: string) => {
    window.open(link, '_blank')
    speak(`Opening scheme details: ${title}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏛️ Government Schemes
          </h1>
          <p className="text-xl text-gray-600">
            Latest government schemes and initiatives for Indian citizens
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            disabled={isLoading}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => fetchSchemes(selectedCategory)}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Loading...
              </>
            ) : (
              '🔄 Refresh Schemes'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading government schemes...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {schemes.length === 0 ? (
              <div className="text-center py-12 bg-yellow-50 rounded-lg">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
                <p className="text-gray-600">Try selecting a different category or refresh the page.</p>
              </div>
            ) : (
              schemes.map((scheme, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {scheme.schemeName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Government Scheme
                        </span>
                        <span className="text-gray-500 text-sm">
                          • {new Date(scheme.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    {scheme.description}
                  </p>
                  
                  <p className="text-gray-600 mb-6">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => readAloud(scheme.schemeName, scheme.description, 'Government')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                      aria-label={`Read aloud: ${scheme.schemeName}`}
                    >
                      🔊 Read Aloud
                    </button>
                    
                    <button
                      onClick={() => openScheme(scheme.applicationLink, scheme.schemeName)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                      aria-label={`Visit official website: ${scheme.schemeName}`}
                    >
                      🌐 Apply Now
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">🎯 Scheme Categories</h2>
          <div className="grid md:grid-cols-3 gap-4 text-green-800">
            <div>🦽 <strong>Disability:</strong> Accessibility & inclusion schemes</div>
            <div>🏥 <strong>Healthcare:</strong> Medical insurance & health programs</div>
            <div>📚 <strong>Education:</strong> Learning & skill development</div>
            <div>💼 <strong>Employment:</strong> Job creation & training programs</div>
            <div>💻 <strong>Technology:</strong> Digital India initiatives</div>
            <div>🏠 <strong>Housing:</strong> Affordable housing schemes</div>
          </div>
        </div>
      </main>
    </div>
  )
}