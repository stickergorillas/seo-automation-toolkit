const Logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

const logger = new Logger('RankTracking');

class RankTracking {
  constructor() {
    this.trackingData = [];
    this.dataFile = path.join(__dirname, '../../data/rankings.json');
  }

  async trackKeywords(keywords, domain) {
    try {
      logger.info(`Tracking ${keywords.length} keywords for ${domain}`);

      const rankings = keywords.map(keyword => ({
        keyword,
        domain,
        date: new Date().toISOString(),
        rank: this.mockRank(keyword),
        url: `https://${domain}`,
        searchVolume: this.mockSearchVolume(keyword),
        position: this.mockPosition(keyword),
        ctr: this.mockCTR(keyword)
      }));

      await this.saveTrackingData(rankings);

      logger.success(`Tracked ${keywords.length} keywords`);
      return rankings;
    } catch (error) {
      logger.error('Failed to track keywords', error.message);
      throw error;
    }
  }

  async getHistory(keyword) {
    try {
      logger.info(`Getting ranking history for: ${keyword}`);

      const data = await this.loadTrackingData();
      const history = data.filter(entry => entry.keyword.toLowerCase() === keyword.toLowerCase());

      logger.success(`Found ${history.length} historical records`);
      return history;
    } catch (error) {
      logger.error('Failed to get history', error.message);
      return [];
    }
  }

  async getChanges(keyword) {
    try {
      const history = await this.getHistory(keyword);

      if (history.length < 2) {
        return {
          keyword,
          change: 0,
          trend: 'no_data',
          message: 'Insufficient data for comparison'
        };
      }

      const latestRank = history[history.length - 1].rank;
      const previousRank = history[history.length - 2].rank;
      const change = previousRank - latestRank;
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

      return {
        keyword,
        change,
        previousRank,
        currentRank: latestRank,
        trend,
        message: `Rank ${change > 0 ? 'improved' : change < 0 ? 'declined' : 'remained'} by ${Math.abs(change)} positions`
      };
    } catch (error) {
      logger.error('Failed to get changes', error.message);
      return null;
    }
  }

  async getTopKeywords(limit = 10) {
    try {
      logger.info('Getting top performing keywords...');

      const data = await this.loadTrackingData();
      const grouped = this.groupByKeyword(data);
      const top = Object.values(grouped)
        .map(entries => ({
          keyword: entries[0].keyword,
          avgRank: this.calculateAverageRank(entries),
          trend: this.calculateTrend(entries),
          ctr: entries[0].ctr
        }))
        .sort((a, b) => a.avgRank - b.avgRank)
        .slice(0, limit);

      logger.success(`Found ${top.length} top keywords`);
      return top;
    } catch (error) {
      logger.error('Failed to get top keywords', error.message);
      return [];
    }
  }

  mockRank(keyword) {
    return Math.floor(Math.random() * 100) + 1;
  }

  mockSearchVolume(keyword) {
    return Math.floor(Math.random() * 10000) + 100;
  }

  mockPosition(keyword) {
    return Math.floor(Math.random() * 10) + 1;
  }

  mockCTR(keyword) {
    return parseFloat((Math.random() * 5).toFixed(2));
  }

  async saveTrackingData(data) {
    try {
      const existing = await this.loadTrackingData();
      const combined = [...existing, ...data];
      await fs.writeFile(this.dataFile, JSON.stringify(combined, null, 2));
    } catch (error) {
      logger.warn('Failed to save tracking data', error.message);
    }
  }

  async loadTrackingData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  groupByKeyword(data) {
    return data.reduce((acc, entry) => {
      const key = entry.keyword.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {});
  }

  calculateAverageRank(entries) {
    const sum = entries.reduce((acc, e) => acc + e.rank, 0);
    return Math.round(sum / entries.length);
  }

  calculateTrend(entries) {
    if (entries.length < 2) return 'stable';
    const latest = entries[entries.length - 1].rank;
    const previous = entries[entries.length - 2].rank;
    return latest < previous ? 'up' : latest > previous ? 'down' : 'stable';
  }
}

module.exports = new RankTracking();
