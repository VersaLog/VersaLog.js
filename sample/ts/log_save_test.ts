import Versalog = require("versalog");

const logger = new Versalog();
logger.setConfig({
  show_file: false,
  show_tag: false,
  notice: false,
  all_save: true,
  tag: "",
  mode: "detailed",
});

logger.info("情報ログ");
logger.error("エラーログ");
logger.warning("警告ログ");
logger.debug("デバッグログ");
logger.critical("クリティカルログ");