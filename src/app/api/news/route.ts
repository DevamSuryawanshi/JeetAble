import { NextRequest, NextResponse } from 'next/server'

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
}

// Cache for storing news data
let newsCache: { data: NewsItem[], timestamp: number } | null = null
const CACHE_DURATION = 3 * 60 * 60 * 1000 // 3 hours

// RSS feeds from Indian news sources
const RSS_FEEDS = [
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', source: 'NDTV' },
  { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', source: 'Times of India' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', source: 'The Hindu' }
]

async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlText = await response.text()
    
    // Simple XML parsing for RSS
    const items: NewsItem[] = []
    const itemRegex = /<item>(.*?)<\/item>/gs
    let match
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1]
      
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s)
      const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s)
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/s)
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/s)
      
      if (titleMatch && linkMatch) {
        const title = (titleMatch[1] || titleMatch[2] || '').trim()
        const description = (descMatch?.[1] || descMatch?.[2] || '').trim().replace(/<[^>]*>/g, '')
        const link = linkMatch[1].trim()
        const pubDate = pubDateMatch?.[1] || new Date().toISOString()
        
        if (title && link) {
          items.push({
            title: title.substring(0, 200),
            description: description.substring(0, 300),
            link,
            pubDate,
            source
          })
        }
      }
      
      if (items.length >= 5) break // Limit per source
    }
    
    return items
  } catch (error) {
    console.error(`Error parsing RSS feed from ${source}:`, error)
    return []
  }
}

async function fetchNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = []
  
  for (const feed of RSS_FEEDS) {
    try {
      const news = await parseRSSFeed(feed.url, feed.source)
      allNews.push(...news)
    } catch (error) {
      console.error(`Failed to fetch from ${feed.source}:`, error)
    }
  }
  
  // If no news fetched, return sample data
  if (allNews.length === 0) {
    return [
      {
        title: 'India Launches New Digital Initiative for Accessibility',
        description: 'Government announces comprehensive digital accessibility program for disabled citizens across the country.',
        link: 'https://example.com/news1',
        pubDate: new Date().toISOString(),
        source: 'Sample News'
      },
      {
        title: 'Technology Breakthrough in Assistive Devices',
        description: 'New AI-powered assistive technology helps visually impaired users navigate digital platforms more effectively.',
        link: 'https://example.com/news2',
        pubDate: new Date().toISOString(),
        source: 'Sample News'
      },
      {
        title: 'Education Ministry Announces Inclusive Learning Programs',
        description: 'Special focus on making education accessible for students with disabilities through technology integration.',
        link: 'https://example.com/news3',
        pubDate: new Date().toISOString(),
        source: 'Sample News'
      }
    ]
  }
  
  // Sort by date and return latest 15 items
  return allNews
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 15)
}

export async function GET(request: NextRequest) {
  try {
    // Check cache
    if (newsCache && (Date.now() - newsCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: newsCache.data,
        cached: true,
        lastUpdated: new Date(newsCache.timestamp).toISOString()
      })
    }
    
    // Fetch fresh news
    const news = await fetchNews()
    
    // Update cache
    newsCache = {
      data: news,
      timestamp: Date.now()
    }
    
    return NextResponse.json({
      success: true,
      data: news,
      cached: false,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news',
      data: []
    }, { status: 500 })
  }
}