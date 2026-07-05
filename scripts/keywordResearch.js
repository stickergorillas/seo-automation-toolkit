const keywordResearch = require('../src/modules/keyword-research');
const Logger = require('../src/utils/logger');

const logger = new Logger('KeywordResearchScript');

async function main() {
  try {
    logger.info('Starting keyword research...');

    const keywords = [
      'best seo tools 2024',
      'how to optimize website',
      'seo best practices',
      'keyword research tools',
      'technical seo guide'
    ];

    const analysis = await keywordResearch.analyzeKeywords(keywords);
    console.log('\n=== Keyword Analysis ===');
    console.log(JSON.stringify(analysis, null, 2));

    const longTail = keywordResearch.generateLongTailKeywords('seo tools');
    console.log('\n=== Long-tail Keywords ===');
    console.log(longTail);

    const recommendations = keywordResearch.getRecommendations(keywords);
    console.log('\n=== Keyword Recommendations ===');
    console.log(JSON.stringify(recommendations, null, 2));

    logger.success('Keyword research completed');
  } catch (error) {
    logger.error('Keyword research failed', error);
    process.exit(1);
  }
}

main();
