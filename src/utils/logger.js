const chalk = require('chalk');
const config = require('../../config/config');

class Logger {
  constructor(name) {
    this.name = name;
    this.level = config.logging.level;
  }

  info(message, data = null) {
    console.log(chalk.blue(`[${this.name}]`), chalk.white(message), data ? data : '');
  }

  success(message, data = null) {
    console.log(chalk.green(`[${this.name}]`), chalk.green('✓'), chalk.white(message), data ? data : '');
  }

  warn(message, data = null) {
    console.warn(chalk.yellow(`[${this.name}]`), chalk.yellow('⚠'), chalk.white(message), data ? data : '');
  }

  error(message, error = null) {
    console.error(chalk.red(`[${this.name}]`), chalk.red('✗'), chalk.white(message), error ? error : '');
  }

  debug(message, data = null) {
    if (this.level === 'debug') {
      console.log(chalk.gray(`[${this.name}]`), chalk.gray('🔍'), chalk.gray(message), data ? data : '');
    }
  }
}

module.exports = Logger;
