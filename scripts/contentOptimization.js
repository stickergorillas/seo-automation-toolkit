const contentOptimization = require('../src/modules/content-optimization');
const Logger = require('../src/utils/logger');

const logger = new Logger('ContentOptimizationScript');

async function main() {
  try {
    logger.info('Starting content optimization check...');

    const content = {
      title: 'Best SEO Tools 2024 - Comprehensive Guide',
      description: 'Discover the best SEO tools for 2024. Our comprehensive guide covers keyword research, technical SEO, backlink analysis and more.',
      content: `
        SEO tools are essential for anyone looking to improve their search engine rankings. 
        In this comprehensive guide, we'll explore the best SEO tools available in 2024.
        
        From keyword research to technical SEO audits, these tools will help you optimize your website.
        We've tested dozens of tools to bring you the most effective options.
        
        Whether you're just starting out or you're an experienced SEO professional, 
        you'll find valuable tools in this guide.
        
        Let's dive into the best SEO tools for 2024.
      `,
      targetKeyword: 'SEO tools'
    };

    const results = await contentOptimization.checkContent(content);
    console.log('\n=== Content Optimization Results ===');
    console.log(JSON.stringify(results, null, 2));

    logger.success('Content optimization check completed');
  } catch (error) {
    logger.error('Content optimization check failed', error);
    process.exit(1);
  }
}

main();
