"use strict";
const date_fns_1 = require("date-fns");
const COLORS = {
    "INFO": "\x1b[32m",
    "ERROR": "\x1b[31m",
    "WARNING": "\x1b[33m",
    "DEBUG": "\x1b[36m",
    "CRITICAL": "\x1b[35m",
};
const SYMBOLS = {
    "INFO": "[+]",
    "ERROR": "[-]",
    "WARNING": "[!]",
    "DEBUG": "[D]",
    "CRITICAL": "[C]",
};
const RESET = "\x1b[0m";
class Versalog {
    constructor(mode = "simple", show_file = false, show_tag = false, tag = null, all = false) {
        if (all) {
            show_file = true;
            show_tag = true;
        }
        const valid_modes = ["simple", "detailed", "file"];
        const lower_mode = mode.toLowerCase();
        if (!valid_modes.includes(lower_mode)) {
            throw new Error(`Invalid mode '${mode}'. Valid modes are: ${valid_modes.join(", ")}`);
        }
        this.mode = lower_mode;
        this.show_file = show_file;
        this.show_tag = show_tag;
        this.tag = tag !== null && tag !== void 0 ? tag : "";
    }
    setConfig(options) {
        if (options.all) {
            this.show_file = true;
            this.show_tag = true;
        }
        if (options.mode !== undefined) {
            const valid_modes = ["simple", "detailed", "file"];
            const lower = options.mode.toLowerCase();
            if (!valid_modes.includes(lower)) {
                throw new Error(`Invalid mode '${options.mode}'. Valid modes are: ${valid_modes.join(", ")}`);
            }
            this.mode = lower;
        }
        if (options.show_file !== undefined)
            this.show_file = options.show_file;
        if (options.show_tag !== undefined)
            this.show_tag = options.show_tag;
        if (options.tag !== undefined)
            this.tag = options.tag;
    }
    GetTime() {
        return (0, date_fns_1.format)(new Date(), "yyyy-MM-dd HH:mm:ss");
    }
    GetCaller() {
        var _a, _b;
        const err = new Error();
        const stack = (_a = err.stack) === null || _a === void 0 ? void 0 : _a.split("\n");
        const callerLine = stack && stack[3] ? stack[3] : (_b = stack === null || stack === void 0 ? void 0 : stack[2]) !== null && _b !== void 0 ? _b : "";
        const match = callerLine.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            const parts = match[1].split(":");
            const file = parts[0].split("/").pop();
            const line = parts[1];
            return `${file}:${line}`;
        }
        return "";
    }
    Log(msg, type, tag) {
        var _a, _b;
        const color = (_a = COLORS[type]) !== null && _a !== void 0 ? _a : "";
        const symbol = (_b = SYMBOLS[type]) !== null && _b !== void 0 ? _b : "[?]";
        const types = type.toUpperCase();
        const finalTag = tag !== null && tag !== void 0 ? tag : (this.show_tag ? this.tag : "");
        const caller = this.show_file || this.mode === "file" ? this.GetCaller() : "";
        let formatted = "";
        if (this.mode === "simple") {
            if (this.show_file) {
                formatted = `[${caller}]`;
                if (finalTag)
                    formatted += `[${finalTag}]`;
                formatted += `${color}${symbol}${RESET} ${msg}`;
            }
            else {
                formatted = `${color}${symbol}${RESET} ${msg}`;
            }
        }
        else if (this.mode === "file") {
            formatted = `[${caller}]${color}[${types}]${RESET} ${msg}`;
        }
        else {
            const time = this.GetTime();
            formatted = `[${time}]${color}[${types}]${RESET}`;
            if (finalTag)
                formatted += `[${finalTag}]`;
            if (this.show_file)
                formatted += `[${caller}]`;
            formatted += ` : ${msg}`;
        }
        console.log(formatted);
    }
    info(msg, tag) {
        this.Log(msg, "INFO", tag);
    }
    error(msg, tag) {
        this.Log(msg, "ERROR", tag);
    }
    warning(msg, tag) {
        this.Log(msg, "WARNING", tag);
    }
    debug(msg, tag) {
        this.Log(msg, "DEBUG", tag);
    }
    critical(msg, tag) {
        this.Log(msg, "CRITICAL", tag);
    }
}
module.exports = Versalog;
