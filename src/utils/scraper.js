const cheerio = require('cheerio');
const axios = require('axios');
const Logger = require('./logger');
const config = require('../../config/config');

const logger = new Logger('Scraper');

class Scraper {
  constructor() {
    this.client = axios.create({
      timeout: config.request.timeout,
      headers: {
        'User-Agent': config.request.userAgent
      }
    });
  }

  async fetchHTML(url) {
    try {
      logger.info(`Fetching HTML from ${url}`);
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch HTML from ${url}`, error.message);
      throw error;
    }
  }

  async parseHTML(html) {
    try {
      const $ = cheerio.load(html);
      return $;
    } catch (error) {
      logger.error('Failed to parse HTML', error.message);
      throw error;
    }
  }

  async scrapeMetaTags(url) {
    try {
      const html = await this.fetchHTML(url);
      const $ = await this.parseHTML(html);

      const metaTags = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: $('meta[property="og:image"]').attr('content'),
        viewport: $('meta[name="viewport"]').attr('content'),
        charset: $('meta[charset]').attr('charset')
      };

      logger.success(`Meta tags scraped from ${url}`);
      return metaTags;
    } catch (error) {
      logger.error(`Failed to scrape meta tags from ${url}`, error.message);
      throw error;
    }
  }

  async scrapeHeadings(url) {
    try {
      const html = await this.fetchHTML(url);
      const $ = await this.parseHTML(html);

      const headings = {
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: []
      };

      for (let i = 1; i <= 6; i++) {
        const selector = `h${i}`;
        $(`${selector}`).each((index, element) => {
          headings[`h${i}`].push($(element).text().trim());
        });
      }

      logger.success(`Headings scraped from ${url}`);
      return headings;
    } catch (error) {
      logger.error(`Failed to scrape headings from ${url}`, error.message);
      throw error;
    }
  }

  async scrapeLinks(url) {
    try {
      const html = await this.fetchHTML(url);
      const $ = await this.parseHTML(html);

      const links = {
        internal: [],
        external: []
      };

      $('a').each((index, element) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim();

        if (href) {
          if (href.includes(config.website.domain) || href.startsWith('/')) {
            links.internal.push({ url: href, text });
          } else if (href.startsWith('http')) {
            links.external.push({ url: href, text });
          }
        }
      });

      logger.success(`Links scraped from ${url}`);
      return links;
    } catch (error) {
      logger.error(`Failed to scrape links from ${url}`, error.message);
      throw error;
    }
  }

  async scrapeImages(url) {
    try {
      const html = await this.fetchHTML(url);
      const $ = await this.parseHTML(html);

      const images = [];

      $('img').each((index, element) => {
        images.push({
          src: $(element).attr('src'),
          alt: $(element).attr('alt'),
          title: $(element).attr('title')
        });
      });

      logger.success(`Images scraped from ${url}`);
      return images;
    } catch (error) {
      logger.error(`Failed to scrape images from ${url}`, error.message);
      throw error;
    }
  }
}

module.exports = new Scraper();
