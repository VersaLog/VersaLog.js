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
    constructor(mode = "simple", show_file = false) {
        this.mode = mode.toLowerCase();
        this.show_file = show_file;
        const valid_modes = ["simple", "detailed", "file"];
        if (!valid_modes.includes(this.mode)) {
            throw new Error(`Invalid mode '${this.mode}' specified. Valid modes are: ${valid_modes.join(", ")}`);
        }
    }
    GetTime() {
        return (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
    GetCaller() {
        var _a;
        const err = new Error();
        const stack = (_a = err.stack) === null || _a === void 0 ? void 0 : _a.split('\n');
        const callerLine = stack && stack[3] ? stack[3] : stack && stack[2] ? stack[2] : '';
        const match = callerLine.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            const parts = match[1].split(":");
            const file = parts[0].split("/").pop();
            const line = parts[1];
            return `${file}:${line}`;
        }
        return '';
    }
    Log(msg, type) {
        const colors = COLORS[type] || '';
        const types = type.toUpperCase();
        const symbol = SYMBOLS[type] || '[?]';
        const caller = (this.show_file || this.mode === "file") ? this.GetCaller() : '';
        let formatted = '';
        if (this.mode === "simple") {
            if (this.show_file) {
                formatted = `[${caller}]${colors}${symbol}${RESET} ${msg}`;
            }
            else {
                formatted = `${colors}${symbol}${RESET} ${msg}`;
            }
        }
        else if (this.mode === "file") {
            formatted = `[${caller}]${colors}[${types}]${RESET} ${msg}`;
        }
        else {
            const time = this.GetTime();
            if (this.show_file) {
                formatted = `[${time}]${colors}[${types}]${RESET}[${caller}] : ${msg}`;
            }
            else {
                formatted = `[${time}]${colors}[${types}]${RESET} : ${msg}`;
            }
        }
        console.log(formatted);
    }
    info(msg) {
        this.Log(msg, "INFO");
    }
    error(msg) {
        this.Log(msg, "ERROR");
    }
    warning(msg) {
        this.Log(msg, "WARNING");
    }
    debug(msg) {
        this.Log(msg, "DEBUG");
    }
    critical(msg) {
        this.Log(msg, "CRITICAL");
    }
}
module.exports = Versalog;
