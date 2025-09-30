const Versalog = require('versalog');

// show_file false
const logger = new Versalog();
logger.setConfig({
    show_file: false,
    show_tag: false,
    notice: false,
    tag: null,
    enable_all: false,
    all_save: true,
    mode: "detailed"
});