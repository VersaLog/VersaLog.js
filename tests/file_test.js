const Versalog = require('versalog');

const logger = new Versalog('file');

logger.info('情報ログ');
logger.err('エラーログ');
logger.war('警告ログ');