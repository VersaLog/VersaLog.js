const Versalog = require('versalog');

// show_file false
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: false,
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
    notice: false,
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
    notice: false,
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
    notice: false,
    tag: "VersaLog",
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// notice False
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: false,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// notice true
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: true,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// silent False
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: true,
    silent: false,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// silent False
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: true,
    silent: true,
    all_save: true,
    tag: null,
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');

// enable_all true
const logger = new Versalog();
logger.setConfig({
    enable_all: true,
    tag: "VersaLog",
    mode: "detailed"
})

logger.info('情報ログ');
logger.error('エラーログ');
logger.warning('警告ログ');
logger.debug('デバッグログ');
logger.critical('クリティカルログ');