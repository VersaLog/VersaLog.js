const Versalog = require('versalog');

// show_file false
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    tag: null,
    mode: "detailed"
});

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// show_file true
const logger = new Versalog();
logger.setConfig({
    show_file: true,
    show_tag: false,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// show_tag False
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// show_tag true
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: true,
    tag: "VersaLog",
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// all true
const logger = new Versalog();
logger.setConfig({
    all: true,
    tag: "VersaLog",
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');