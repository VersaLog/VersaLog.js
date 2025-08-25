import { format } from "date-fns";
const notifier = require("node-notifier");
import * as fs from "fs";
import * as path from "path";

const COLORS: Record<string, string> = {
    "INFO": "\x1b[32m",
    "ERROR": "\x1b[31m",
    "WARNING": "\x1b[33m",
    "DEBUG": "\x1b[36m",
    "CRITICAL": "\x1b[35m",
};

const SYMBOLS: Record<string, string> = {
    "INFO": "[+]",
    "ERROR": "[-]",
    "WARNING": "[!]",
    "DEBUG": "[D]",
    "CRITICAL": "[C]",
};

const RESET = "\x1b[0m";

class Versalog {
    public mode: string;
    public tag: string;
    public show_file: boolean;
    public show_tag: boolean;
    public notice: boolean;
    public all_save: boolean;
    public save_levels: string[];
    public silent: boolean;
    private log_queue: Array<{ log_text: string, level: string }> = [];
    private is_worker_running: boolean = false;
    private catch_exceptions: boolean;

    constructor(
        mode: string = "simple",
        show_file: boolean = false,
        show_tag: boolean = false,
        tag: string | null = null,
        enable_all: boolean = false,
        notice: boolean = false,
        all_save: boolean = false,
        save_levels: string[] | null = null,
        silent: boolean = false,
        catch_exceptions: boolean = false
    ) {
        if (enable_all) {
            show_file = true;
            show_tag = true;
            notice = true;
            all_save = true;
        }

        const valid_modes = ["simple", "simple2", "detailed", "file"];
        const lower_mode = mode.toLowerCase();
        if (!valid_modes.includes(lower_mode)) {
            throw new Error(`Invalid mode '${mode}'. Valid modes are: ${valid_modes.join(", ")}`);
        }

        this.mode = lower_mode;
        this.show_file = show_file;
        this.show_tag = show_tag;
        this.tag = tag ?? "";
        this.notice = notice;
        this.all_save = all_save;
        this.save_levels = save_levels ?? ["INFO", "ERROR", "WARNING", "DEBUG", "CRITICAL"];
        const valid_save_levels = ["INFO", "ERROR", "WARNING", "DEBUG", "CRITICAL"];
        if (!Array.isArray(this.save_levels) || !this.save_levels.every(l => valid_save_levels.includes(l))) {
            throw new Error(`Invalid save_levels specified. Valid levels are: ${valid_save_levels.join(", ")}`);
        }
        this.silent = silent;
        this.catch_exceptions = catch_exceptions;
        if (this.catch_exceptions) {
            process.on('uncaughtException', (err) => {
                this.critical(`Unhandled exception:\n${err.stack || err}`);
            });
            process.on('unhandledRejection', (reason: any) => {
                this.critical(`Unhandled rejection:\n${reason?.stack || reason}`);
            });
        }
    }

    public setConfig(options: {
        mode?: string;
        show_file?: boolean;
        show_tag?: boolean;
        tag?: string;
        enable_all?: boolean;
        notice?: boolean;
        all_save?: boolean;
        save_levels?: string[];
        silent?: boolean;
        catch_exceptions?: boolean;
    }): void {
        if (options.enable_all) {
            this.show_file = true;
            this.show_tag = true;
            this.notice = true;
            this.all_save = true;
        }

        if (options.mode !== undefined) {
            const valid_modes = ["simple", "detailed", "file"];
            const lower = options.mode.toLowerCase();
            if (!valid_modes.includes(lower)) {
                throw new Error(`Invalid mode '${options.mode}'. Valid modes are: ${valid_modes.join(", ")}`);
            }
            this.mode = lower;
        }
        if (options.show_file !== undefined) this.show_file = options.show_file;
        if (options.show_tag !== undefined) this.show_tag = options.show_tag;
        if (options.tag !== undefined) this.tag = options.tag;
        if (options.notice !== undefined) this.notice = options.notice;
        if (options.all_save !== undefined) this.all_save = options.all_save;
        if (options.save_levels !== undefined) this.save_levels = options.save_levels;
        if (options.silent !== undefined) this.silent = options.silent;
        if (options.catch_exceptions !== undefined) {
            this.catch_exceptions = options.catch_exceptions;
            if (this.catch_exceptions) {
                process.on('uncaughtException', (err) => {
                    this.critical(`Unhandled exception:\n${err.stack || err}`);
                });
                process.on('unhandledRejection', (reason: any) => {
                    this.critical(`Unhandled rejection:\n${reason?.stack || reason}`);
                });
            }
        }
    }

    private GetTime(): string {
        return format(new Date(), "yyyy-MM-dd HH:mm:ss");
    }

    private GetCaller(): string {
        const err = new Error();
        const stack = err.stack?.split("\n");
        const callerLine = stack && stack[3] ? stack[3] : stack?.[2] ?? "";
        const match = callerLine.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            const parts = match[1].split(":");
            const file = parts[0].split("/").pop();
            const line = parts[1];
            return `${file}:${line}`;
        }
        return "";
    }

    private save_log(log_text: string, level: string): void {
        if (!this.save_levels.includes(level)) return;
        this.log_queue.push({ log_text, level });
        this.run_worker();
    }

    private run_worker() {
        if (this.is_worker_running) return;
        this.is_worker_running = true;
        const processQueue = () => {
            if (this.log_queue.length === 0) {
                this.is_worker_running = false;
                return;
            }
            const { log_text, level } = this.log_queue.shift()!;
            const logDir = path.join(process.cwd(), "log");
            if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
            const dateStr = format(new Date(), "yyyy-MM-dd");
            const logFile = path.join(logDir, `${dateStr}.log`);
            fs.appendFile(logFile, log_text + "\n", { encoding: "utf-8" }, () => {
                setImmediate(processQueue);
            });
        };
        setImmediate(processQueue);
    }

    private Log(msg: string, tye: string, tag?: string): void {
        const color = COLORS[tye] ?? "";
        const symbol = SYMBOLS[tye] ?? "[?]";
        const types = tye.toUpperCase();

        const finalTag = tag ?? (this.show_tag ? this.tag : "");
        const caller = this.show_file || this.mode === "file" ? this.GetCaller() : "";

        let formatted = "";
        let plain = "";

        if (this.notice && (types === "ERROR" || types === "CRITICAL")) {
            notifier.notify({
                title: `${types} Log notice`,
                message: msg,
                appName: "VersaLog"
            });
        }

        if (this.mode === "simple") {
            formatted = "";
            if (this.show_file) {
                formatted += `[${caller}]`;
            }
            if (finalTag) formatted += `[${finalTag}]`;
            formatted += `${color}${symbol}${RESET} ${msg}`;
            plain = (this.show_file ? `[${caller}]` : "") + (finalTag ? `[${finalTag}]` : "") + `${symbol} ${msg}`;
        } else if (this.mode === "simple2") {
            const time = this.GetTime();
            if (this.show_file) {
                formatted = `[${time}]`;
                if (caller) formatted += ` [${caller}]`;
                if (finalTag) formatted += `[${finalTag}]`;
                formatted += `${color}${symbol}${RESET} ${msg}`;
                plain = `[${time}]` + (caller ? ` [${caller}]` : "") + (finalTag ? `[${finalTag}]` : "") + `${symbol} ${msg}`;
            } else {
                formatted = `[${time}] ${color}${symbol}${RESET} ${msg}`;
                plain = `[${time}] ${symbol} ${msg}`;
            }
        } else if (this.mode === "file") {
            formatted = `[${caller}]`;
            if (finalTag) formatted += `[${finalTag}]`;
            formatted += `${color}[${types}]${RESET} ${msg}`;
            plain = `[${caller}]` + (finalTag ? `[${finalTag}]` : "") + `[${types}] ${msg}`;
        } else {
            const time = this.GetTime();
            formatted = `[${time}]${color}[${types}]${RESET}`;
            plain = `[${time}][${types}]`;
            if (finalTag) {
                formatted += `[${finalTag}]`;
                plain += `[${finalTag}]`;
            }
            if (this.show_file) {
                formatted += `[${caller}]`;
                plain += `[${caller}]`;
            }
            formatted += ` : ${msg}`;
            plain += ` : ${msg}`;
        }

        if (!this.silent) {
            console.log(formatted);
        }
        if (this.all_save && this.save_levels.includes(types)) {
            this.save_log(plain, types);
        }
    }

    public info(msg: string, tag?: string): void {
        this.Log(msg, "INFO", tag);
    }

    public error(msg: string, tag?: string): void {
        this.Log(msg, "ERROR", tag);
    }

    public warning(msg: string, tag?: string): void {
        this.Log(msg, "WARNING", tag);
    }

    public debug(msg: string, tag?: string): void {
        this.Log(msg, "DEBUG", tag);
    }

    public critical(msg: string, tag?: string): void {
        this.Log(msg, "CRITICAL", tag);
    }
}

export = Versalog;
