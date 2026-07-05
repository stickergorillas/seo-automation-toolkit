require('dotenv').config();

module.exports = {
  // API Configuration
  apis: {
    google: {
      token: process.env.GOOGLE_SEARCH_CONSOLE_TOKEN || '',
      baseUrl: 'https://www.googleapis.com/webmasters/v3/sites'
    },
    semrush: {
      apiKey: process.env.SEMRUSH_API_KEY || '',
      baseUrl: 'https://api.semrush.com',
      maxRows: 10000
    },
    ahrefs: {
      apiKey: process.env.AHREFS_API_KEY || '',
      baseUrl: 'https://api.ahrefs.com'
    }
  },

  // Target Website Configuration
  website: {
    domain: process.env.TARGET_DOMAIN || 'example.com',
    url: process.env.TARGET_URL || 'https://example.com'
  },

  // Request Configuration
  request: {
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '10000'),
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5'),
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },

  // SEO Audit Configuration
  audit: {
    checkLinks: true,
    checkImages: true,
    checkHeaders: true,
    checkMetaTags: true,
    checkStructuredData: true,
    checkMobileOptimization: true,
    checkPageSpeed: true
  },

  // Content Optimization Configuration
  content: {
    minKeywordDensity: 0.5,
    maxKeywordDensity: 3.0,
    minContentLength: 300,
    optimalContentLength: 2000,
    minHeadings: 2,
    maxHeadingLevel: 3
  },

  // Rank Tracking Configuration
  ranking: {
    maxKeywords: 100,
    trackingFrequency: 'daily',
    searchEngines: ['google', 'bing']
  },

  // Report Configuration
  report: {
    outputDir: './reports',
    formats: ['pdf', 'csv', 'json'],
    includeCharts: true,
    includeHistory: true
  },

  // Debug Mode
  debug: process.env.DEBUG === 'true',

  // Logging Configuration
  logging: {
    level: process.env.DEBUG === 'true' ? 'debug' : 'info',
    format: 'json'
  }
};
