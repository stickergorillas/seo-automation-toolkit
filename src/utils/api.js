const axios = require('axios');
const Logger = require('./logger');
const config = require('../../config/config');

const logger = new Logger('APIHandler');

class APIHandler {
  constructor() {
    this.client = axios.create({
      timeout: config.request.timeout,
      headers: {
        'User-Agent': config.request.userAgent
      }
    });
  }

  async request(url, options = {}) {
    const { method = 'GET', data = null, retries = 0 } = options;

    try {
      logger.debug(`Making ${method} request to ${url}`);

      const response = await this.client({
        method,
        url,
        data,
        ...options
      });

      logger.success(`Request successful: ${url}`);
      return response.data;
    } catch (error) {
      if (retries < config.request.retryAttempts) {
        logger.warn(`Retrying request (${retries + 1}/${config.request.retryAttempts})...`);
        await this.sleep(1000 * (retries + 1));
        return this.request(url, { ...options, retries: retries + 1 });
      }

      logger.error(`API request failed: ${url}`, error.message);
      throw error;
    }
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, { ...options, method: 'POST', data });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new APIHandler();
