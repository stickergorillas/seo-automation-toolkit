const rankTracking = require('../src/modules/rank-tracking');
const Logger = require('../src/utils/logger');
const config = require('../config/config');

const logger = new Logger('RankTrackingScript');

async function main() {
  try {
    logger.info('Starting rank tracking...');

    const keywords = [
      'best seo tools',
      'keyword research',
      'technical seo',
      'content optimization',
      'backlink analysis'
    ];

    const rankings = await rankTracking.trackKeywords(keywords, config.website.domain);
    console.log('\n=== Tracked Rankings ===');
    console.log(JSON.stringify(rankings, null, 2));

    const topKeywords = await rankTracking.getTopKeywords(5);
    console.log('\n=== Top Keywords ===');
    console.log(JSON.stringify(topKeywords, null, 2));

    logger.info('Analyzing ranking changes...');
    for (const keyword of keywords.slice(0, 2)) {
      const changes = await rankTracking.getChanges(keyword);
      console.log(`\n${keyword}:`, changes);
    }

    logger.success('Rank tracking completed');
  } catch (error) {
    logger.error('Rank tracking failed', error);
    process.exit(1);
  }
}

main();
