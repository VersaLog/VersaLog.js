import Versalog from "./dist/index.js";

const logger = new Versalog();
logger.setConfig({
  save_levels: ["INFO", "ERROR"],
  mode: "simple2",
  notice: true,
  all_save: true,
});
logger.info("This is an info message", "INIT");
logger.error("This is an error message", "INIT");
