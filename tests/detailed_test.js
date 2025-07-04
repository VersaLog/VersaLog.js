const Versalog = require('versalog');

// show_file false
const logger = new Versalog('detailed', false);

logger.info('情報ログ');
logger.err('エラーログ');
logger.war('警告ログ');

// show_file true
const logger = new Versalog('detailed', true);

logger.info('情報ログ');
logger.err('エラーログ');
logger.war('警告ログ');