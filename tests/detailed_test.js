const Versalog = require('versalog');

// show_file false
const logger = new Versalog('detailed', false);

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// show_file true
const logger = new Versalog('detailed', true);

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');