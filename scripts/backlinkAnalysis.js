const backlinkAnalysis = require('../src/modules/backlink-analysis');
const Logger = require('../src/utils/logger');
const config = require('../config/config');

const logger = new Logger('BacklinkAnalysisScript');

async function main() {
  try {
    logger.info('Starting backlink analysis...');

    const domain = config.website.domain;

    const analysis = await backlinkAnalysis.analyzeBacklinks(domain);
    console.log('\n=== Backlink Analysis ===');
    console.log(JSON.stringify(analysis, null, 2));

    const toxic = await backlinkAnalysis.getToxicBacklinks(domain);
    console.log('\n=== Toxic Backlinks ===');
    console.log(JSON.stringify(toxic, null, 2));

    const competitorBacklinks = await backlinkAnalysis.getCompetitorBacklinks('competitor.com');
    console.log('\n=== Competitor Backlinks ===');
    console.log(JSON.stringify(competitorBacklinks, null, 2));

    const opportunities = await backlinkAnalysis.getBacklinkOpportunities(domain);
    console.log('\n=== Backlink Opportunities ===');
    console.log(JSON.stringify(opportunities, null, 2));

    logger.success('Backlink analysis completed');
  } catch (error) {
    logger.error('Backlink analysis failed', error);
    process.exit(1);
  }
}

main();
