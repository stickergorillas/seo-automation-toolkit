const Logger = require('../utils/logger');
const scraper = require('../utils/scraper');
const config = require('../../config/config');

const logger = new Logger('SEOAudit');

class SEOAudit {
  constructor() {
    this.issues = [];
    this.score = 0;
  }

  async auditWebsite(url) {
    try {
      logger.info(`Starting SEO audit for ${url}`);
      this.issues = [];

      const results = {
        url,
        timestamp: new Date().toISOString(),
        checks: {}
      };

      if (config.audit.checkMetaTags) {
        results.checks.metaTags = await this.checkMetaTags(url);
      }

      if (config.audit.checkHeaders) {
        results.checks.headers = await this.checkHeaders(url);
      }

      if (config.audit.checkImages) {
        results.checks.images = await this.checkImages(url);
      }

      if (config.audit.checkLinks) {
        results.checks.links = await this.checkLinks(url);
      }

      if (config.audit.checkStructuredData) {
        results.checks.structuredData = await this.checkStructuredData(url);
      }

      results.issues = this.issues;
      results.score = this.calculateScore();

      logger.success(`SEO audit completed. Score: ${results.score}/100`);
      return results;
    } catch (error) {
      logger.error('Failed to complete SEO audit', error.message);
      throw error;
    }
  }

  async checkMetaTags(url) {
    logger.info('Checking meta tags...');

    try {
      const metaTags = await scraper.scrapeMetaTags(url);
      const results = {
        passed: [],
        failed: []
      };

      if (!metaTags.title) {
        this.addIssue('missing_title', 'Missing page title', 'critical');
        results.failed.push('title');
      } else if (metaTags.title.length < 30) {
        this.addIssue('short_title', 'Page title is too short (< 30 chars)', 'warning');
        results.failed.push('title');
      } else if (metaTags.title.length > 60) {
        this.addIssue('long_title', 'Page title is too long (> 60 chars)', 'warning');
        results.failed.push('title');
      } else {
        results.passed.push('title');
      }

      if (!metaTags.description) {
        this.addIssue('missing_description', 'Missing meta description', 'critical');
        results.failed.push('description');
      } else if (metaTags.description.length < 120) {
        this.addIssue('short_description', 'Meta description is too short (< 120 chars)', 'warning');
        results.failed.push('description');
      } else if (metaTags.description.length > 160) {
        this.addIssue('long_description', 'Meta description is too long (> 160 chars)', 'warning');
        results.failed.push('description');
      } else {
        results.passed.push('description');
      }

      if (!metaTags.viewport) {
        this.addIssue('missing_viewport', 'Missing viewport meta tag (not mobile-friendly)', 'critical');
        results.failed.push('viewport');
      } else {
        results.passed.push('viewport');
      }

      logger.success('Meta tags check completed');
      return results;
    } catch (error) {
      logger.error('Failed to check meta tags', error.message);
      return { passed: [], failed: ['error'] };
    }
  }

  async checkHeaders(url) {
    logger.info('Checking heading structure...');

    try {
      const headings = await scraper.scrapeHeadings(url);
      const results = {
        passed: [],
        failed: [],
        headings
      };

      if (headings.h1.length === 0) {
        this.addIssue('missing_h1', 'Missing H1 tag', 'critical');
        results.failed.push('h1');
      } else if (headings.h1.length > 1) {
        this.addIssue('multiple_h1', 'Multiple H1 tags found (should be only 1)', 'warning');
        results.failed.push('h1');
      } else {
        results.passed.push('h1');
      }

      if (headings.h2.length === 0 && headings.h3.length > 0) {
        this.addIssue('heading_hierarchy', 'H3 found but no H2 (bad heading hierarchy)', 'warning');
        results.failed.push('hierarchy');
      } else {
        results.passed.push('hierarchy');
      }

      logger.success('Heading structure check completed');
      return results;
    } catch (error) {
      logger.error('Failed to check headings', error.message);
      return { passed: [], failed: ['error'] };
    }
  }

  async checkImages(url) {
    logger.info('Checking images...');

    try {
      const images = await scraper.scrapeImages(url);
      const results = {
        passed: 0,
        failed: 0,
        missingAlt: []
      };

      images.forEach(image => {
        if (!image.alt) {
          results.failed++;
          results.missingAlt.push(image.src);
          this.addIssue('missing_alt_text', `Image missing alt text: ${image.src}`, 'warning');
        } else {
          results.passed++;
        }
      });

      logger.success('Images check completed');
      return results;
    } catch (error) {
      logger.error('Failed to check images', error.message);
      return { passed: 0, failed: 0, missingAlt: [] };
    }
  }

  async checkLinks(url) {
    logger.info('Checking links...');

    try {
      const links = await scraper.scrapeLinks(url);
      const results = {
        internal: links.internal.length,
        external: links.external.length,
        brokenLinks: 0
      };

      if (links.internal.length === 0) {
        this.addIssue('no_internal_links', 'No internal links found', 'warning');
      }

      logger.success('Links check completed');
      return results;
    } catch (error) {
      logger.error('Failed to check links', error.message);
      return { internal: 0, external: 0, brokenLinks: 0 };
    }
  }

  async checkStructuredData(url) {
    logger.info('Checking structured data...');

    try {
      const html = await scraper.fetchHTML(url);
      const hasStructuredData = html.includes('schema.org') || html.includes('structured');

      const results = {
        found: hasStructuredData,
        issues: []
      };

      if (!hasStructuredData) {
        this.addIssue('missing_structured_data', 'No structured data found', 'warning');
        results.issues.push('No structured data markup');
      }

      logger.success('Structured data check completed');
      return results;
    } catch (error) {
      logger.error('Failed to check structured data', error.message);
      return { found: false, issues: ['error'] };
    }
  }

  addIssue(code, message, severity = 'info') {
    this.issues.push({
      code,
      message,
      severity,
      timestamp: new Date().toISOString()
    });
  }

  calculateScore() {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical').length;
    const warningIssues = this.issues.filter(i => i.severity === 'warning').length;

    const score = 100 - (criticalIssues * 10 + warningIssues * 3);
    return Math.max(0, Math.min(100, score));
  }
}

module.exports = new SEOAudit();
