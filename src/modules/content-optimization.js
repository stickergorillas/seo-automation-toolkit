const Logger = require('../utils/logger');
const config = require('../../config/config');

const logger = new Logger('ContentOptimization');

class ContentOptimization {
  async checkContent(content) {
    try {
      logger.info('Checking content optimization...');

      const results = {
        score: 0,
        checks: {},
        recommendations: []
      };

      const { title, description, content: bodyContent, targetKeyword } = content;

      results.checks.title = this.checkTitle(title, targetKeyword);
      results.checks.description = this.checkDescription(description, targetKeyword);
      results.checks.contentLength = this.checkContentLength(bodyContent);
      results.checks.keywordDensity = this.checkKeywordDensity(bodyContent, targetKeyword);
      results.checks.readability = this.checkReadability(bodyContent);
      results.checks.paragraphs = this.checkParagraphs(bodyContent);
      results.checks.sentences = this.checkSentences(bodyContent);

      results.score = this.calculateScore(results.checks);
      results.recommendations = this.generateRecommendations(results.checks);

      logger.success(`Content optimization check completed. Score: ${results.score}/100`);
      return results;
    } catch (error) {
      logger.error('Failed to check content optimization', error.message);
      throw error;
    }
  }

  checkTitle(title, keyword) {
    const results = {
      score: 0,
      issues: []
    };

    if (!title) {
      results.issues.push('Missing title');
      return results;
    }

    if (title.length < 30) {
      results.issues.push('Title too short (< 30 chars)');
    } else if (title.length > 60) {
      results.issues.push('Title too long (> 60 chars)');
    } else {
      results.score += 25;
    }

    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      results.score += 25;
    } else if (keyword) {
      results.issues.push('Target keyword not in title');
    }

    return results;
  }

  checkDescription(description, keyword) {
    const results = {
      score: 0,
      issues: []
    };

    if (!description) {
      results.issues.push('Missing meta description');
      return results;
    }

    if (description.length < 120) {
      results.issues.push('Description too short (< 120 chars)');
    } else if (description.length > 160) {
      results.issues.push('Description too long (> 160 chars)');
    } else {
      results.score += 25;
    }

    if (keyword && description.toLowerCase().includes(keyword.toLowerCase())) {
      results.score += 25;
    }

    return results;
  }

  checkContentLength(content) {
    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    const results = {
      wordCount,
      score: 0,
      recommendation: ''
    };

    if (wordCount < config.content.minContentLength) {
      results.recommendation = `Content too short. Minimum ${config.content.minContentLength} words recommended.`;
    } else if (wordCount < config.content.optimalContentLength) {
      results.score = 50;
      results.recommendation = `Consider expanding to ${config.content.optimalContentLength}+ words for better SEO.`;
    } else {
      results.score = 100;
      results.recommendation = 'Content length is optimal.';
    }

    return results;
  }

  checkKeywordDensity(content, keyword) {
    if (!keyword || !content) {
      return { density: 0, score: 0, recommendation: 'Unable to calculate keyword density' };
    }

    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(w => w.includes(keyword.toLowerCase())).length;
    const density = (keywordCount / words.length) * 100;

    const results = {
      density: parseFloat(density.toFixed(2)),
      score: 0,
      recommendation: ''
    };

    if (density < config.content.minKeywordDensity) {
      results.recommendation = `Keyword density too low (${density.toFixed(2)}%). Target: ${config.content.minKeywordDensity}%.`;
    } else if (density > config.content.maxKeywordDensity) {
      results.score = 50;
      results.recommendation = `Keyword density too high (${density.toFixed(2)}%). Avoid keyword stuffing.`;
    } else {
      results.score = 100;
      results.recommendation = `Keyword density is optimal (${density.toFixed(2)}%).`;
    }

    return results;
  }

  checkReadability(content) {
    if (!content) {
      return { score: 0, averageWordLength: 0, readingTime: 0 };
    }

    const words = content.trim().split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const averageSentenceLength = words.length / sentences.length;
    const readingTime = Math.ceil(words.length / 200);

    return {
      score: 75,
      averageWordLength: parseFloat(averageWordLength.toFixed(2)),
      averageSentenceLength: parseFloat(averageSentenceLength.toFixed(2)),
      readingTime: `${readingTime} min read`,
      recommendation: 'Keep sentences under 20 words for better readability.'
    };
  }

  checkParagraphs(content) {
    if (!content) {
      return { count: 0, averageLength: 0, score: 0 };
    }

    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const averageLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;

    return {
      count: paragraphs.length,
      averageLength: Math.round(averageLength),
      score: paragraphs.length >= 3 ? 100 : 50,
      recommendation: 'Use short paragraphs (3-5 sentences) for better readability.'
    };
  }

  checkSentences(content) {
    if (!content) {
      return { count: 0, averageLength: 0, score: 0 };
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.trim().split(/\s+/);
    const averageLength = words.length / sentences.length;

    return {
      count: sentences.length,
      averageLength: parseFloat(averageLength.toFixed(2)),
      score: averageLength <= 20 ? 100 : 50,
      recommendation: 'Aim for 15-20 words per sentence for optimal readability.'
    };
  }

  calculateScore(checks) {
    const scores = Object.values(checks).map(check => check.score || 0);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average);
  }

  generateRecommendations(checks) {
    const recommendations = [];

    if (checks.title.score < 50) {
      recommendations.push('Optimize your page title to include target keyword and keep it under 60 characters.');
    }

    if (checks.description.score < 50) {
      recommendations.push('Improve meta description to be between 120-160 characters and include target keyword.');
    }

    if (checks.contentLength.score < 75) {
      recommendations.push(checks.contentLength.recommendation);
    }

    if (checks.keywordDensity.score < 75) {
      recommendations.push(checks.keywordDensity.recommendation);
    }

    if (checks.readability.averageSentenceLength > 20) {
      recommendations.push('Reduce average sentence length to improve readability.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job! Your content is well-optimized.');
    }

    return recommendations;
  }
}

module.exports = new ContentOptimization();
