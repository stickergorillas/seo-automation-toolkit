const Logger = require('../utils/logger');
const apiHandler = require('../utils/api');

const logger = new Logger('KeywordResearch');

class KeywordResearch {
  constructor() {
    this.keywords = [];
  }

  async analyzeKeywords(keywords) {
    try {
      logger.info(`Analyzing ${keywords.length} keywords...`);

      const results = keywords.map(keyword => ({
        keyword,
        searchVolume: this.estimateSearchVolume(keyword),
        difficulty: this.calculateDifficulty(keyword),
        cpc: this.estimateCPC(keyword),
        trend: this.analyzeTrend(keyword),
        relatedKeywords: this.findRelatedKeywords(keyword),
        potential: this.calculatePotential(keyword)
      }));

      logger.success(`Analyzed ${keywords.length} keywords`);
      return results;
    } catch (error) {
      logger.error('Failed to analyze keywords', error.message);
      throw error;
    }
  }

  generateLongTailKeywords(baseKeyword) {
    logger.info(`Generating long-tail keywords for: ${baseKeyword}`);

    const prefixes = ['best', 'how to', 'what is', 'where to', 'why', 'can you'];
    const suffixes = ['for beginners', '2024', 'guide', 'tips', 'tutorial', 'near me'];

    const longTails = [];

    prefixes.forEach(prefix => {
      longTails.push(`${prefix} ${baseKeyword}`);
    });

    suffixes.forEach(suffix => {
      longTails.push(`${baseKeyword} ${suffix}`);
    });

    logger.success(`Generated ${longTails.length} long-tail keyword suggestions`);
    return longTails;
  }

  estimateSearchVolume(keyword) {
    const baseVolume = 1000;
    const lengthFactor = keyword.split(' ').length;
    return Math.floor(baseVolume * (1 / lengthFactor) * Math.random() * 100);
  }

  calculateDifficulty(keyword) {
    return Math.floor(Math.random() * 100);
  }

  estimateCPC(keyword) {
    return parseFloat((Math.random() * 5).toFixed(2));
  }

  analyzeTrend(keyword) {
    const trends = ['rising', 'stable', 'declining'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  findRelatedKeywords(keyword) {
    const related = this.generateLongTailKeywords(keyword);
    return related.slice(0, 3);
  }

  calculatePotential(keyword) {
    const volume = this.estimateSearchVolume(keyword);
    const difficulty = this.calculateDifficulty(keyword);
    const potential = Math.floor((volume * (100 - difficulty)) / 100);
    return Math.max(0, Math.min(100, potential / 100));
  }

  getRecommendations(keywords) {
    logger.info('Getting keyword recommendations...');

    const analyzed = keywords.map(keyword => ({
      keyword,
      score: this.calculatePotential(keyword)
    }));

    const recommended = analyzed
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    logger.success(`Found ${recommended.length} recommended keywords`);
    return recommended;
  }
}

module.exports = new KeywordResearch();
