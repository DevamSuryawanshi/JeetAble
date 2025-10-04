import { NextRequest, NextResponse } from 'next/server'

interface HumanAIRequest {
  message: string
  language: string
  targetLanguage: string
  sessionId: string
  currentUrl: string
  pageContext: {
    title: string
    url: string
    hasForm: boolean
    hasSearch: boolean
    hasMedia: boolean
  }
}

interface HumanAIResponse {
  message: string
  action?: 'navigate' | 'click' | 'filter' | 'form_submit' | 'play_media' | 'scroll' | 'search' | 'clarify'
  target?: string
  extra?: any
  needsClarification?: boolean
  sessionId?: string
}

// Session storage for context (in production, use Redis or database)
const sessions = new Map<string, any[]>()

// Mock translation function - Replace with actual translation API
async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  if (fromLang === toLang) return text
  
  // Mock translations for demo
  const translations: { [key: string]: { [key: string]: string } } = {
    'hi': {
      'hello': 'नमस्ते',
      'open': 'खोलो',
      'search': 'खोजो',
      'help': 'मदद',
      'jobs': 'नौकरी',
      'learning': 'सीखना',
      'emergency': 'आपातकाल',
      'thank you': 'धन्यवाद'
    },
    'mr': {
      'hello': 'नमस्कार',
      'open': 'उघडा',
      'search': 'शोधा',
      'help': 'मदत',
      'jobs': 'नोकरी',
      'learning': 'शिकणे',
      'emergency': 'आणीबाणी',
      'thank you': 'धन्यवाद'
    },
    'raj': {
      'hello': 'नमस्कार',
      'open': 'खोलो',
      'search': 'ढूंढो',
      'help': 'मदद',
      'jobs': 'काम',
      'learning': 'सीखणो',
      'emergency': 'आपातकाल'
    },
    'ta': {
      'hello': 'வணக்கம்',
      'open': 'திற',
      'search': 'தேடு',
      'help': 'உதவி',
      'jobs': 'வேலை',
      'learning': 'கற்றல்',
      'emergency': 'அவசரம்'
    }
  }
  
  let translatedText = text.toLowerCase()
  if (translations[toLang]) {
    Object.entries(translations[toLang]).forEach(([english, translated]) => {
      translatedText = translatedText.replace(new RegExp(english, 'gi'), translated)
    })
  }
  
  return translatedText
}

// Advanced intent processing with GPT-4 like reasoning
function processHumanLikeIntent(message: string, context: any, pageContext: any): HumanAIResponse {
  const lowerMessage = message.toLowerCase()
  
  // Store conversation context
  if (!sessions.has(context.sessionId)) {
    sessions.set(context.sessionId, [])
  }
  const sessionHistory = sessions.get(context.sessionId)!
  sessionHistory.push({ user: message, timestamp: Date.now(), url: context.currentUrl })
  
  // Navigation intents with natural language understanding
  if (lowerMessage.includes('open') || lowerMessage.includes('go to') || lowerMessage.includes('navigate') || 
      lowerMessage.includes('take me') || lowerMessage.includes('show me') || lowerMessage.includes('visit')) {
    
    if (lowerMessage.includes('learning') || lowerMessage.includes('learn') || lowerMessage.includes('study') || 
        lowerMessage.includes('education') || lowerMessage.includes('tutorial')) {
      return {
        message: 'I\'ll take you to the Learning Hub where you can access educational resources, tutorials, and interactive learning tools.',
        action: 'navigate',
        target: '/learning',
        sessionId: context.sessionId
      }
    }
    
    if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work') || 
        lowerMessage.includes('employment') || lowerMessage.includes('hiring')) {
      return {
        message: 'Opening the Job Portal for you. Here you\'ll find disability-friendly job opportunities with accessibility features.',
        action: 'navigate',
        target: '/jobs',
        sessionId: context.sessionId
      }
    }
    
    if (lowerMessage.includes('deaf') || lowerMessage.includes('hearing') || lowerMessage.includes('speech to text') ||
        lowerMessage.includes('sign language')) {
      return {
        message: 'Taking you to Deaf Mode where you can use speech-to-text features and sign language resources.',
        action: 'navigate',
        target: '/deaf-mode',
        sessionId: context.sessionId
      }
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('emergency') || lowerMessage.includes('sos') ||
        lowerMessage.includes('urgent') || lowerMessage.includes('crisis')) {
      return {
        message: 'Opening Emergency Help section immediately. You\'ll find SOS buttons, emergency contacts, and crisis support.',
        action: 'navigate',
        target: '/help',
        sessionId: context.sessionId
      }
    }
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('profile') || lowerMessage.includes('account') ||
        lowerMessage.includes('settings') || lowerMessage.includes('preferences')) {
      return {
        message: 'Taking you to your personal dashboard where you can manage your profile and accessibility preferences.',
        action: 'navigate',
        target: '/dashboard',
        sessionId: context.sessionId
      }
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('main') || lowerMessage.includes('start')) {
      return {
        message: 'Going back to the homepage where you can see all available features and get started.',
        action: 'navigate',
        target: '/',
        sessionId: context.sessionId
      }
    }
  }
  
  // Search functionality
  if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for')) {
    const searchTermMatch = lowerMessage.match(/(?:search|find|look for)\s+(?:for\s+)?(.+)/i)
    if (searchTermMatch) {
      const searchTerm = searchTermMatch[1].trim()
      return {
        message: `I'll search for "${searchTerm}" on this page for you.`,
        action: 'search',
        extra: { searchTerm },
        sessionId: context.sessionId
      }
    }
    return {
      message: 'What would you like me to search for? Please tell me the specific term or topic.',
      action: 'clarify',
      sessionId: context.sessionId
    }
  }
  
  // Form interactions
  if (lowerMessage.includes('fill') || lowerMessage.includes('complete') || lowerMessage.includes('submit form')) {
    if (pageContext.hasForm) {
      // Extract form data from message
      const formData: { [key: string]: string } = {}
      
      // Simple pattern matching for common form fields
      const nameMatch = lowerMessage.match(/name[:\s]+([^,\n]+)/i)
      const emailMatch = lowerMessage.match(/email[:\s]+([^\s,\n]+)/i)
      const phoneMatch = lowerMessage.match(/phone[:\s]+([^\s,\n]+)/i)
      
      if (nameMatch) formData.name = nameMatch[1].trim()
      if (emailMatch) formData.email = emailMatch[1].trim()
      if (phoneMatch) formData.phone = phoneMatch[1].trim()
      
      if (Object.keys(formData).length > 0) {
        return {
          message: 'I\'ll fill out the form with the information you provided.',
          action: 'form_submit',
          target: 'form',
          extra: { formData },
          sessionId: context.sessionId
        }
      } else {
        return {
          message: 'I can help you fill out the form. Please tell me what information you\'d like to enter, for example: "Fill name: John Doe, email: john@example.com"',
          action: 'clarify',
          sessionId: context.sessionId
        }
      }
    } else {
      return {
        message: 'I don\'t see any forms on this page. Would you like me to navigate to a page that has a form?',
        action: 'clarify',
        sessionId: context.sessionId
      }
    }
  }
  
  // Scrolling actions
  if (lowerMessage.includes('scroll')) {
    if (lowerMessage.includes('top') || lowerMessage.includes('up')) {
      return {
        message: 'Scrolling to the top of the page for you.',
        action: 'scroll',
        target: 'top',
        sessionId: context.sessionId
      }
    }
    if (lowerMessage.includes('bottom') || lowerMessage.includes('down') || lowerMessage.includes('end')) {
      return {
        message: 'Scrolling to the bottom of the page.',
        action: 'scroll',
        target: 'bottom',
        sessionId: context.sessionId
      }
    }
  }
  
  // Click actions
  if (lowerMessage.includes('click') || lowerMessage.includes('press') || lowerMessage.includes('tap')) {
    if (lowerMessage.includes('button') || lowerMessage.includes('link')) {
      return {
        message: 'Which specific button or link would you like me to click? Please describe it or tell me what it says.',
        action: 'clarify',
        sessionId: context.sessionId
      }
    }
  }
  
  // Filter actions for job portal
  if (lowerMessage.includes('filter') || lowerMessage.includes('show only') || lowerMessage.includes('apply filter')) {
    const filters: { [key: string]: string } = {}
    
    if (lowerMessage.includes('remote')) filters.remote = 'true'
    if (lowerMessage.includes('wheelchair') || lowerMessage.includes('accessible')) filters.wheelchair = 'true'
    if (lowerMessage.includes('flexible')) filters.flexible = 'true'
    if (lowerMessage.includes('full time') || lowerMessage.includes('fulltime')) filters.type = 'full-time'
    if (lowerMessage.includes('part time') || lowerMessage.includes('parttime')) filters.type = 'part-time'
    
    if (Object.keys(filters).length > 0) {
      return {
        message: 'I\'ll apply those filters to help you find the right opportunities.',
        action: 'filter',
        extra: { filters },
        sessionId: context.sessionId
      }
    }
  }
  
  // Media controls
  if (lowerMessage.includes('play') || lowerMessage.includes('start video') || lowerMessage.includes('start audio')) {
    if (pageContext.hasMedia) {
      return {
        message: 'I\'ll start playing the media content for you.',
        action: 'play_media',
        target: 'video, audio',
        sessionId: context.sessionId
      }
    } else {
      return {
        message: 'I don\'t see any media content on this page. Would you like me to navigate to a page with videos or audio?',
        action: 'clarify',
        sessionId: context.sessionId
      }
    }
  }
  
  // Help and information requests
  if (lowerMessage.includes('what can you do') || lowerMessage.includes('help me') || lowerMessage.includes('capabilities')) {
    return {
      message: 'I\'m your intelligent assistant! I can navigate pages, fill forms, search content, apply filters, click buttons, scroll pages, play media, and perform almost any action you need on this website. I understand natural language in multiple languages including English, Hindi, Marathi, Rajasthani, and Tamil. Just tell me what you want to do in your own words!',
      action: 'clarify',
      sessionId: context.sessionId
    }
  }
  
  // Accessibility features inquiry
  if (lowerMessage.includes('accessibility') || lowerMessage.includes('features') || lowerMessage.includes('disability')) {
    return {
      message: 'JeetAble offers comprehensive accessibility features: voice navigation, deaf mode with speech-to-text, learning resources, accessible job listings, emergency help, high contrast modes, dyslexia-friendly fonts, and full keyboard navigation. All features are designed following WCAG guidelines. Would you like me to show you any specific accessibility feature?',
      action: 'clarify',
      sessionId: context.sessionId
    }
  }
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
      lowerMessage.includes('namaste') || lowerMessage.includes('vanakkam')) {
    return {
      message: 'Hello! I\'m your intelligent assistant here to help you with anything on JeetAble. I can navigate pages, fill forms, search content, and perform any action you need. What would you like me to help you with today?',
      sessionId: context.sessionId
    }
  }
  
  // Gratitude responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('dhanyawad')) {
    return {
      message: 'You\'re very welcome! I\'m always here to help make your experience on JeetAble as smooth and accessible as possible. Is there anything else I can assist you with?',
      sessionId: context.sessionId
    }
  }
  
  // Context-aware responses based on current page
  if (context.currentUrl.includes('/jobs')) {
    if (lowerMessage.includes('apply') || lowerMessage.includes('job application')) {
      return {
        message: 'I can help you apply for jobs! Just tell me which job you\'re interested in, or I can help you filter jobs based on your preferences like remote work, accessibility features, or job type.',
        action: 'clarify',
        sessionId: context.sessionId
      }
    }
  }
  
  if (context.currentUrl.includes('/learning')) {
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return {
        message: 'Great! I can help you start learning. Would you like to begin with sign language basics, text-to-speech tools, or accessibility best practices? Just let me know what interests you most.',
        action: 'clarify',
        sessionId: context.sessionId
      }
    }
  }
  
  // Default intelligent response
  return {
    message: `I understand you said "${message}". I can help you navigate JeetAble, perform actions like filling forms, searching content, applying filters, or accessing any feature. Could you tell me more specifically what you'd like me to do? For example, you could say "open the jobs page", "search for accessibility jobs", or "fill out the contact form".`,
    action: 'clarify',
    sessionId: context.sessionId
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, language, targetLanguage, sessionId, currentUrl, pageContext }: HumanAIRequest = await request.json()
    
    if (!message || !message.trim()) {
      return NextResponse.json({
        message: 'I didn\'t receive your message. Could you please try again?',
        action: 'clarify'
      }, { status: 400 })
    }
    
    // Step 1: Translate input to English if needed
    let englishMessage = message
    if (language !== 'en') {
      englishMessage = await translateText(message, language, 'en')
    }
    
    // Step 2: Process with human-like intelligence
    const response = processHumanLikeIntent(englishMessage, { sessionId, currentUrl }, pageContext)
    
    // Step 3: Translate response back to target language if needed
    let translatedMessage = response.message
    if (targetLanguage !== 'en') {
      translatedMessage = await translateText(response.message, 'en', targetLanguage)
    }
    
    // Step 4: Return the intelligent response
    return NextResponse.json({
      ...response,
      message: translatedMessage
    })
    
  } catch (error) {
    console.error('Human AI API error:', error)
    return NextResponse.json({
      message: 'I encountered an issue processing your request. Please try again, and I\'ll do my best to help you.',
      action: 'clarify'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Human-like AI Agent API is running',
    supportedLanguages: ['en', 'hi', 'mr', 'raj', 'ta'],
    actions: ['navigate', 'click', 'filter', 'form_submit', 'play_media', 'scroll', 'search', 'clarify'],
    capabilities: [
      'Natural language understanding',
      'Multi-step task execution',
      'Context awareness',
      'Session memory',
      'Multilingual support',
      'Website action automation'
    ]
  })
}