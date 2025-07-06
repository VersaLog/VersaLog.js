const Versalog = require('versalog');

// show_file false
const logger = new Versalog('simple', false);

logger.info('情報ログ');
logger.err('エラーログ');
logger.war('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// show_file true
const logger = new Versalog('simple', true);

logger.info('情報ログ');
logger.err('エラーログ');
logger.war('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');