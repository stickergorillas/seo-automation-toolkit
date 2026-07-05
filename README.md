# SEO Automation Toolkit 🚀

A comprehensive Node.js toolkit for automating SEO tasks including keyword research, backlink analysis, technical SEO audits, content optimization, rank tracking, and report generation.

## Features ✨

- 🔍 **Keyword Research** - Analyze keywords, search volume, and competition
- 🔗 **Backlink Analysis** - Track and analyze backlinks from your domain
- 📊 **Technical SEO Audit** - Crawl and audit your website for SEO issues
- 📝 **Content Optimization** - Check content for SEO best practices
- 📈 **Rank Tracking** - Monitor keyword rankings over time
- 📋 **Report Generation** - Generate comprehensive SEO reports in PDF/CSV

## Installation 📦

```bash
# Clone the repository
git clone https://github.com/stickergorillas/seo-automation-toolkit.git
cd seo-automation-toolkit

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys
```

## Quick Start 🎯

### 1. Keyword Research
```bash
npm run keyword-research
```

### 2. Technical SEO Audit
```bash
npm run seo-audit
```

### 3. Content Optimization Check
```bash
npm run content-check
```

### 4. Backlink Analysis
```bash
npm run backlink-analysis
```

### 5. Rank Tracking
```bash
npm run rank-tracking
```

### 6. Generate Report
```bash
npm run generate-report
```

## Project Structure 📁

```
.
├── src/
│   ├── utils/           # Utility functions
│   │   ├── api.js      # API request handler
│   │   ├── scraper.js  # Web scraping utility
│   │   └── logger.js   # Logging utility
│   └── modules/        # Core SEO modules
│       ├── keyword-research.js
│       ├── backlink-analysis.js
│       ├── seo-audit.js
│       ├── content-optimization.js
│       ├── rank-tracking.js
│       └── report-generator.js
├── scripts/            # Executable scripts
├── config/             # Configuration files
├── reports/            # Output reports
└── index.js           # Main entry point
```

## Configuration 🔧

Edit `.env` file with your settings:

```env
# API Keys
GOOGLE_SEARCH_CONSOLE_TOKEN=your_token
SEMRUSH_API_KEY=your_key
AHREFS_API_KEY=your_key

# Target Website
TARGET_DOMAIN=example.com
TARGET_URL=https://example.com

# Options
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT=10000
RETRY_ATTEMPTS=3
DEBUG=false
```

## Usage Examples 💡

### Keyword Research
```javascript
const keywordResearch = require('./src/modules/keyword-research');

const keywords = await keywordResearch.analyzeKeywords([
  'best seo tools',
  'seo optimization'
]);

console.log(keywords);
```

### SEO Audit
```javascript
const seoAudit = require('./src/modules/seo-audit');

const audit = await seoAudit.auditWebsite('https://example.com');
console.log(audit.issues);
```

### Content Optimization
```javascript
const contentOpt = require('./src/modules/content-optimization');

const result = await contentOpt.checkContent({
  title: 'Page Title',
  description: 'Meta description',
  content: 'Page content...',
  targetKeyword: 'seo'
});

console.log(result.score);
```

## API Integration 🔌

This toolkit supports integration with:
- Google Search Console
- SEMrush API
- Ahrefs API
- Custom APIs

Add your API keys to `.env` to enable these features.

## Report Generation 📄

Generate comprehensive reports:

```bash
# Generate PDF report
npm run generate-report -- --format pdf

# Generate CSV export
npm run generate-report -- --format csv

# Generate detailed report
npm run generate-report -- --detailed
```

## Troubleshooting 🔧

### Missing API Keys
Make sure all required API keys are set in your `.env` file.

### Timeout Issues
Increase `REQUEST_TIMEOUT` in `.env` for slower servers.

### Rate Limiting
Adjust `MAX_CONCURRENT_REQUESTS` to avoid rate limiting.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - see LICENSE file for details

## Support 💬

For issues and questions, please open an issue on GitHub.

---

**Happy SEO Automating!** 🎉
