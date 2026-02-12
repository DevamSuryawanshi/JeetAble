'use client'

import { useState, useEffect, useRef } from 'react'

interface Content {
  id: string
  title: string
  category: 'AudioBooks' | 'Inspiring Speeches' | 'Talks' | 'Podcasts' | 'Interviews'
  topic: string[]
  description: string
  duration: string
  url: string
}

export default function VoiceContentRecommendation() {
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [recommendations, setRecommendations] = useState<Content[]>([])
  const [allContent, setAllContent] = useState<Content[]>([])
  const recognitionRef = useRef<any>(null)

  // Sample content database
  const contentDatabase: Content[] = [
    {
      id: '1',
      title: 'Think and Grow Rich',
      category: 'AudioBooks',
      topic: ['motivation', 'finance', 'success'],
      description: 'Napoleon Hill\'s classic on success principles',
      duration: '10 hours',
      url: '#'
    },
    {
      id: '2',
      title: 'The Power of Now',
      category: 'AudioBooks',
      topic: ['mindset', 'motivation'],
      description: 'Eckhart Tolle on living in the present',
      duration: '7 hours',
      url: '#'
    },
    {
      id: '3',
      title: 'Rich Dad Poor Dad',
      category: 'AudioBooks',
      topic: ['finance', 'business', 'investing'],
      description: 'Robert Kiyosaki on financial education',
      duration: '6 hours',
      url: '#'
    },
    {
      id: '4',
      title: 'Steve Jobs Stanford Speech',
      category: 'Inspiring Speeches',
      topic: ['motivation', 'entrepreneurship', 'success'],
      description: 'Stay hungry, stay foolish',
      duration: '15 min',
      url: '#'
    },
    {
      id: '5',
      title: 'The Last Lecture by Randy Pausch',
      category: 'Inspiring Speeches',
      topic: ['motivation', 'mindset'],
      description: 'Achieving your childhood dreams',
      duration: '76 min',
      url: '#'
    },
    {
      id: '6',
      title: 'How Great Leaders Inspire Action',
      category: 'Talks',
      topic: ['entrepreneurship', 'business', 'motivation'],
      description: 'Simon Sinek\'s TED Talk on leadership',
      duration: '18 min',
      url: '#'
    },
    {
      id: '7',
      title: 'The Power of Vulnerability',
      category: 'Talks',
      topic: ['mindset', 'motivation'],
      description: 'Brené Brown on courage and connection',
      duration: '20 min',
      url: '#'
    },
    {
      id: '8',
      title: 'The Tim Ferriss Show',
      category: 'Podcasts',
      topic: ['entrepreneurship', 'business', 'success'],
      description: 'Deconstructing world-class performers',
      duration: '60 min',
      url: '#'
    },
    {
      id: '9',
      title: 'How I Built This',
      category: 'Podcasts',
      topic: ['entrepreneurship', 'startup', 'business'],
      description: 'Stories behind successful companies',
      duration: '45 min',
      url: '#'
    },
    {
      id: '10',
      title: 'The Mindset Mentor',
      category: 'Podcasts',
      topic: ['mindset', 'motivation', 'discipline'],
      description: 'Daily motivation and mindset coaching',
      duration: '15 min',
      url: '#'
    },
    {
      id: '11',
      title: 'Elon Musk Interview',
      category: 'Interviews',
      topic: ['entrepreneurship', 'business', 'success'],
      description: 'Building the future with Tesla and SpaceX',
      duration: '90 min',
      url: '#'
    },
    {
      id: '12',
      title: 'Warren Buffett on Investing',
      category: 'Interviews',
      topic: ['finance', 'investing', 'business'],
      description: 'Investment wisdom from the Oracle of Omaha',
      duration: '60 min',
      url: '#'
    }
  ]

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const detectContentType = (text: string): string | null => {
    const lowerText = text.toLowerCase()

    const contentTypeKeywords = {
      'AudioBooks': ['book', 'books', 'audiobook', 'audiobooks', 'audio book'],
      'Inspiring Speeches': ['speech', 'speeches', 'inspiring speech', 'motivational speech'],
      'Podcasts': ['podcast', 'podcasts'],
      'Talks': ['talk', 'talks', 'ted talk', 'leadership talk'],
      'Interviews': ['interview', 'interviews', 'success interview']
    }

    for (const [category, keywords] of Object.entries(contentTypeKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category
      }
    }

    return null
  }

  const detectTopics = (text: string): string[] => {
    const lowerText = text.toLowerCase()
    const detectedTopics: string[] = []

    const topicKeywords = {
      'motivation': ['motivational', 'inspire', 'inspiration', 'mindset', 'success', 'motivated'],
      'finance': ['finance', 'financial', 'money', 'investing', 'investment', 'wealth'],
      'entrepreneurship': ['startup', 'entrepreneur', 'entrepreneurship', 'business growth', 'founder'],
      'mindset': ['mindset', 'discipline', 'habits', 'mental', 'psychology'],
      'business': ['business', 'company', 'corporate', 'management'],
      'success': ['success', 'successful', 'achievement', 'winning']
    }

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedTopics.push(topic)
      }
    }

    return detectedTopics
  }

  const filterContent = (contentType: string | null, topics: string[]) => {
    let filtered = [...contentDatabase]

    // Filter by content type
    if (contentType) {
      filtered = filtered.filter(content => content.category === contentType)
    }

    // Filter by topics
    if (topics.length > 0) {
      filtered = filtered.filter(content =>
        topics.some(topic => content.topic.includes(topic))
      )
    }

    return filtered
  }

  const processVoiceCommand = (text: string) => {
    setRecognizedText(text)
    console.log('Processing:', text)

    const contentType = detectContentType(text)
    const topics = detectTopics(text)

    console.log('Detected content type:', contentType)
    console.log('Detected topics:', topics)

    const filtered = filterContent(contentType, topics)
    setRecommendations(filtered)

    // Voice feedback
    if (filtered.length > 0) {
      const categoryText = contentType ? contentType : 'content'
      const topicText = topics.length > 0 ? `about ${topics.join(', ')}` : ''
      speak(`Found ${filtered.length} ${categoryText} ${topicText}. Here are your recommendations.`)
    } else {
      speak('Sorry, no content found matching your request. Please try again.')
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return

    try {
      setIsListening(true)
      setRecognizedText('')
      recognitionRef.current.start()
      speak('Listening. Please tell me what you want to learn.')
    } catch (error) {
      console.error('Start listening error:', error)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  useEffect(() => {
    setAllContent(contentDatabase)

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      processVoiceCommand(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error)
      setIsListening(false)
      speak('Sorry, I could not understand. Please try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎙️ Voice Content Recommendation
        </h1>
        <p className="text-xl text-gray-600">
          Tell me what you want to learn, and I'll find the perfect content for you
        </p>
      </div>

      {/* Voice Input Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="text-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-white text-blue-600'
            } px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform`}
          >
            {isListening ? '🎤 Listening...' : '🎤 Start Voice Search'}
          </button>
        </div>

        {recognizedText && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
            <p className="text-sm opacity-80 mb-1">You said:</p>
            <p className="text-xl font-semibold">"{recognizedText}"</p>
          </div>
        )}

        <div className="mt-6 text-sm opacity-90">
          <p className="font-semibold mb-2">Try saying:</p>
          <ul className="space-y-1">
            <li>• "I want to listen to motivational podcasts"</li>
            <li>• "Play inspiring speeches"</li>
            <li>• "Show me financial books"</li>
            <li>• "I want entrepreneurship talks"</li>
            <li>• "Play mindset interviews"</li>
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            📚 Recommended for You ({recommendations.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {content.category}
                  </span>
                  <span className="text-gray-500 text-sm">{content.duration}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {content.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {content.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.topic.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => speak(`Playing ${content.title}`)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  ▶️ Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Content */}
      {recommendations.length === 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            📚 All Content ({allContent.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allContent.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {content.category}
                  </span>
                  <span className="text-gray-500 text-sm">{content.duration}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {content.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {content.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.topic.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => speak(`Playing ${content.title}`)}
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  ▶️ Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
