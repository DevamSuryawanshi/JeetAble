'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import { useAccessibility } from '@/components/AccessibilityProvider'

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
}

export default function DailyNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const { speak } = useAccessibility()

  useEffect(() => {
    speak('Daily News page loaded. Loading latest headlines...')
    fetchNews()
  }, [speak])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/news')
      const data = await response.json()
      
      if (data.success) {
        setNews(data.data)
        setLastUpdated(data.lastUpdated)
        speak(`Loaded ${data.data.length} news headlines`)
      } else {
        setError('Failed to load news')
        speak('Failed to load news headlines')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setError('Network error while loading news')
      speak('Network error while loading news')
    } finally {
      setIsLoading(false)
    }
  }

  const readAloud = (title: string, description: string) => {
    speak(`${title}. ${description}`)
  }

  const readFirst5News = () => {
    if (news.length === 0) {
      speak('No news available to read')
      return
    }
    
    const first5 = news.slice(0, 5)
    let newsText = 'Here are the top 5 news headlines. '
    
    first5.forEach((item, index) => {
      newsText += `Headline ${index + 1}: ${item.title}. `
    })
    
    newsText += 'End of headlines.'
    speak(newsText)
  }

  const openArticle = (link: string, title: string) => {
    window.open(link, '_blank')
    speak(`Opening article: ${title}`)
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
            🗞️ Daily News
          </h1>
          <p className="text-xl text-gray-600">
            Latest headlines from trusted Indian news sources
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={fetchNews}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Loading News...
              </>
            ) : (
              '🔄 Refresh News'
            )}
          </button>
          
          <button
            onClick={() => readFirst5News()}
            disabled={isLoading || news.length === 0}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 transition-colors"
          >
            🔊 Read First 5 Headlines
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
            <p className="text-gray-600">Loading latest news headlines...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.length === 0 ? (
              <div className="text-center py-12 bg-yellow-50 rounded-lg">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No news available</h3>
                <p className="text-gray-600">Please try refreshing or check back later.</p>
              </div>
            ) : (
              news.map((item, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {item.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.source}
                        </span>
                        <span>
                          {new Date(item.pubDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => readAloud(item.title, item.description)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                      aria-label={`Read aloud: ${item.title}`}
                    >
                      🔊 Read Aloud
                    </button>
                    
                    <button
                      onClick={() => openArticle(item.link, item.title)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                      aria-label={`Read full article: ${item.title}`}
                    >
                      📖 Read Full Article
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">📱 Accessibility Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-blue-800">
            <div>• Large, bold headlines for better readability</div>
            <div>• Read Aloud feature using Web Speech API</div>
            <div>• Read First 5 Headlines automatically</div>
            <div>• High contrast colors for visual clarity</div>
            <div>• Keyboard navigation support</div>
            <div>• Screen reader compatible</div>
            <div>• Auto-refresh every 3 hours</div>
          </div>
        </div>
      </main>
    </div>
  )
}