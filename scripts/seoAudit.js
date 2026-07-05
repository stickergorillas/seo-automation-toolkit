const seoAudit = require('../src/modules/seo-audit');
const reportGenerator = require('../src/modules/report-generator');
const Logger = require('../src/utils/logger');
const config = require('../config/config');

const logger = new Logger('SEOAuditScript');

async function main() {
  try {
    logger.info('Starting SEO audit...');

    const url = config.website.url;

    const auditResults = await seoAudit.auditWebsite(url);
    console.log('\n=== SEO Audit Results ===');
    console.log(JSON.stringify(auditResults, null, 2));

    logger.info('Generating audit report...');
    const reportPath = await reportGenerator.generateReport(auditResults, 'json');
    logger.success(`Report saved to: ${reportPath}`);

    logger.success('SEO audit completed');
  } catch (error) {
    logger.error('SEO audit failed', error);
    process.exit(1);
  }
}

main();
