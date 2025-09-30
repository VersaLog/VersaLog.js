const Versalog = require("versalog");

// show_file false
const logger = new Versalog();
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: false,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// show_file true
logger.setConfig({
  show_file: true,
  show_tag: false,
  notice: false,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// show_tag False
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: false,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// show_tag true
logger.setConfig({
  show_file: false,
  show_tag: true,
  notice: false,
  tag: "VersaLog",
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// notice False
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: false,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// notice true
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: true,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// silent False
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: true,
  silent: false,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// silent True
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: true,
  silent: true,
  all_save: true,
  tag: null,
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");

// enable_all true
logger.setConfig({
  enable_all: true,
  tag: "VersaLog",
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");
