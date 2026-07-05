const Logger = require('./src/utils/logger');
const config = require('./config/config');

const logger = new Logger('MainApp');

const chalk = require('chalk');

async function main() {
  console.clear();
  console.log(chalk.cyan('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   SEO Automation Toolkit v1.0.0                            ║'));
  console.log(chalk.cyan('║   Comprehensive SEO analysis and automation suite          ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝'));
  console.log();

  logger.info('SEO Automation Toolkit started');
  logger.info(`Target Domain: ${config.website.domain}`);
  logger.info(`Target URL: ${config.website.url}`);
  logger.info(`Debug Mode: ${config.debug}`);
  console.log();

  console.log(chalk.yellow('📚 Available Commands:'));
  console.log();
  console.log(chalk.green('  npm run keyword-research') + '     - Analyze keywords and generate suggestions');
  console.log(chalk.green('  npm run seo-audit') + '              - Run comprehensive SEO audit');
  console.log(chalk.green('  npm run content-check') + '          - Check content optimization');
  console.log(chalk.green('  npm run backlink-analysis') + '      - Analyze backlinks and opportunities');
  console.log(chalk.green('  npm run rank-tracking') + '          - Track keyword rankings');
  console.log(chalk.green('  npm run generate-report') + '        - Generate detailed reports');
  console.log();

  console.log(chalk.yellow('🚀 Quick Start:'));
  console.log();
  console.log('  1. Configure your .env file with API keys');
  console.log('  2. Run: npm run keyword-research');
  console.log('  3. Run: npm run seo-audit');
  console.log('  4. Run: npm run generate-report');
  console.log();

  console.log(chalk.yellow('📖 Documentation:'));
  console.log('  See README.md for detailed instructions');
  console.log();

  logger.success('SEO Automation Toolkit is ready to use!');
  logger.info('Run one of the commands above to get started');
}

main();
