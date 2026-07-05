const reportGenerator = require('../src/modules/report-generator');
const seoAudit = require('../src/modules/seo-audit');
const Logger = require('../src/utils/logger');
const config = require('../config/config');

const logger = new Logger('ReportGenerationScript');

async function main() {
  try {
    logger.info('Starting report generation...');

    const url = config.website.url;

    logger.info('Running SEO audit for report data...');
    const auditData = await seoAudit.auditWebsite(url);

    const formats = ['json', 'csv', 'pdf'];

    for (const format of formats) {
      try {
        const reportPath = await reportGenerator.generateReport(auditData, format);
        logger.success(`${format.toUpperCase()} report generated: ${reportPath}`);
      } catch (error) {
        logger.warn(`Failed to generate ${format} report`, error.message);
      }
    }

    logger.success('Report generation completed');
  } catch (error) {
    logger.error('Report generation failed', error);
    process.exit(1);
  }
}

main();
