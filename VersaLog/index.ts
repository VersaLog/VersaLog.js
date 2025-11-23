type LogMode = "simple" | "simple2" | "detailed" | "file";
type LogLevel = "INFO" | "ERROR" | "WARNING" | "DEBUG" | "CRITICAL";
import { format } from "date-fns";
const notifier = require("node-notifier");
import * as fs from "fs";
import * as path from "path";

const COLORS: Record<string, string> = {
  INFO: "\x1b[32m",
  ERROR: "\x1b[31m",
  WARNING: "\x1b[33m",
  DEBUG: "\x1b[36m",
  CRITICAL: "\x1b[35m",
};

const SYMBOLS: Record<string, string> = {
  INFO: "[+]",
  ERROR: "[-]",
  WARNING: "[!]",
  DEBUG: "[D]",
  CRITICAL: "[C]",
};

const RESET = "\x1b[0m";

class Versalog {
  public mode: LogMode;
  public tag: string | string[];
  public show_file: boolean;
  public show_tag: boolean;
  public notice: boolean;
  public all_save: boolean;
  public save_levels: LogLevel[];
  public silent: boolean;
  private log_queue: Array<{ log_text: string; level: string }> = [];
  private is_worker_running: boolean = false;
  private catch_exceptions: boolean;
  private last_cleanup_date: string | null = null;

  constructor(
    mode: LogMode = "simple",
    show_file: boolean = false,
    show_tag: boolean = false,
    tag: string | string[] = "",
    enable_all: boolean = false,
    notice: boolean = false,
    all_save: boolean = false,
    save_levels: LogLevel[] | null = null,
    silent: boolean = false,
    catch_exceptions: boolean = false,
  ) {
    if (enable_all) {
      show_file = true;
      show_tag = true;
      notice = true;
      all_save = true;
    }

    const valid_modes: LogMode[] = ["simple", "simple2", "detailed", "file"];
    if (!valid_modes.includes(mode)) {
      throw new Error(
        `Invalid mode '${mode}'. Valid modes are: ${valid_modes.join(", ")}`,
      );
    }

    this.mode = mode;
    this.show_file = show_file;
    this.show_tag = show_tag;
    if (Array.isArray(tag)) {
      this.tag = tag;
    } else if (typeof tag === "string") {
      this.tag = tag ? [tag] : [];
    } else {
      this.tag = [];
    }
    this.notice = notice;
    this.all_save = all_save;
    const valid_save_levels: LogLevel[] = [
      "INFO",
      "ERROR",
      "WARNING",
      "DEBUG",
      "CRITICAL",
    ];
    this.save_levels = save_levels ?? [...valid_save_levels];
    if (
      !Array.isArray(this.save_levels) ||
      !this.save_levels.every((l) => valid_save_levels.includes(l))
    ) {
      throw new Error(
        `Invalid save_levels specified. Valid levels are: ${valid_save_levels.join(", ")}`,
      );
    }
    this.silent = silent;
    this.catch_exceptions = catch_exceptions;
    if (this.catch_exceptions) {
      process.on("uncaughtException", (err) => {
        this.critical(`Unhandled exception:\n${err.stack || err}`);
      });
      process.on("unhandledRejection", (reason: any) => {
        this.critical(`Unhandled rejection:\n${reason?.stack || reason}`);
      });
    }
  }

  public setConfig(options: {
    mode?: LogMode;
    show_file?: boolean;
    show_tag?: boolean;
    tag?: string | string[];
    enable_all?: boolean;
    notice?: boolean;
    all_save?: boolean;
    save_levels?: LogLevel[];
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
      this.mode = options.mode;
    }
    if (options.show_file !== undefined) this.show_file = options.show_file;
    if (options.show_tag !== undefined) this.show_tag = options.show_tag;
    if (options.tag !== undefined) {
      if (Array.isArray(options.tag)) {
        this.tag = options.tag;
      } else if (typeof options.tag === "string") {
        this.tag = options.tag ? [options.tag] : [];
      } else {
        this.tag = [];
      }
    }
    if (options.notice !== undefined) this.notice = options.notice;
    if (options.all_save !== undefined) this.all_save = options.all_save;
    if (options.save_levels !== undefined) {
      const valid_save_levels: LogLevel[] = [
        "INFO",
        "ERROR",
        "WARNING",
        "DEBUG",
        "CRITICAL",
      ];
      if (
        !Array.isArray(options.save_levels) ||
        !options.save_levels.every((l) => valid_save_levels.includes(l))
      ) {
        throw new Error(
          `Invalid save_levels specified. Valid levels are: ${valid_save_levels.join(", ")}`,
        );
      }
      this.save_levels = options.save_levels;
    }
    if (options.silent !== undefined) this.silent = options.silent;
    if (options.catch_exceptions !== undefined) {
      this.catch_exceptions = options.catch_exceptions;
      if (this.catch_exceptions) {
        process.on("uncaughtException", (err) => {
          this.critical(`Unhandled exception:\n${err.stack || err}`);
        });
        process.on("unhandledRejection", (reason: any) => {
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
    const callerLine = stack && stack[3] ? stack[3] : (stack?.[2] ?? "");
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
    if (!this.save_levels.includes(level as LogLevel)) return;
    this.log_queue.push({ log_text, level });
    this.run_worker();

    const today = format(new Date(), "yyyy-MM-dd");
    if (this.last_cleanup_date !== today) {
      this.cleanup_old_logs(7);
      this.last_cleanup_date = today;
    }
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

  private cleanup_old_logs(days: number = 7): void {
    const logDir = path.join(process.cwd(), "log");
    if (!fs.existsSync(logDir)) return;

    const now = new Date();
    fs.readdirSync(logDir).forEach((filename) => {
      if (!filename.endsWith(".log")) return;
      const filepath = path.join(logDir, filename);

      let fileDate: Date;
      try {
        fileDate = new Date(filename.replace(".log", ""));
        if (isNaN(fileDate.getTime())) throw new Error();
      } catch {
        fileDate = new Date(fs.statSync(filepath).mtime);
      }

      const diffDays =
        (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays >= days) {
        try {
          fs.unlinkSync(filepath);
          if (!this.silent) this.info(`[LOG CLEANUP] removed: ${filepath}`);
        } catch (e) {
          if (!this.silent)
            this.warning(
              `[LOG CLEANUP WARNING] ${filepath} cannot be removed: ${e}`,
            );
        }
      }
    });
  }

  private Log(msg: string, tye: string, tag?: string | string[]): void {
    const color = COLORS[tye] ?? "";
    const symbol = SYMBOLS[tye] ?? "[?]";
    const types = tye.toUpperCase();

    const tags: string[] = [];
    if (this.show_tag) {
      if (Array.isArray(this.tag)) {
        tags.push(...this.tag);
      } else if (this.tag) {
        tags.push(this.tag);
      }
      if (tag) {
        if (Array.isArray(tag)) tags.push(...tag);
        else tags.push(tag);
      }
    }
    const tagStr = tags.length > 0 ? tags.map(t => `[${t}]`).join("") : "";
    const caller =
      this.show_file || this.mode === "file" ? this.GetCaller() : "";

    let formatted = "";
    let plain = "";

    if (this.notice && (types === "ERROR" || types === "CRITICAL")) {
      notifier.notify({
        title: `${types} Log notice`,
        message: msg,
        appName: "VersaLog",
      });
    }

    if (this.mode === "simple") {
      formatted = "";
      if (this.show_file) {
        formatted += `[${caller}]`;
      }
      formatted += tagStr;
      formatted += `${color}${symbol}${RESET} ${msg}`;
      plain =
        (this.show_file ? `[${caller}]` : "") +
        tagStr +
        `${symbol} ${msg}`;
    } else if (this.mode === "simple2") {
      const time = this.GetTime();
      if (this.show_file) {
        formatted = `[${time}]`;
        if (caller) formatted += ` [${caller}]`;
        formatted += tagStr;
        formatted += `${color}${symbol}${RESET} ${msg}`;
        plain =
          `[${time}]` +
          (caller ? ` [${caller}]` : "") +
          tagStr +
          `${symbol} ${msg}`;
      } else {
        formatted = `[${time}] ${color}${symbol}${RESET} ${msg}`;
        plain = `[${time}] ${symbol} ${msg}`;
      }
    } else if (this.mode === "file") {
      formatted = `[${caller}]`;
      formatted += tagStr;
      formatted += `${color}[${types}]${RESET} ${msg}`;
      plain =
        `[${caller}]` + tagStr + `[${types}] ${msg}`;
    } else {
      const time = this.GetTime();
      formatted = `[${time}]${color}[${types}]${RESET}`;
      plain = `[${time}][${types}]`;
      if (tagStr) {
        formatted += tagStr;
        plain += tagStr;
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
    if (this.all_save && this.save_levels.includes(types as LogLevel)) {
      this.save_log(plain, types);
    }
  }

  public info(msg: string, tag?: string | string[]): void {
    this.Log(msg, "INFO", tag);
  }

  public error(msg: string, tag?: string | string[]): void {
    this.Log(msg, "ERROR", tag);
  }

  public warning(msg: string, tag?: string | string[]): void {
    this.Log(msg, "WARNING", tag);
  }

  public debug(msg: string, tag?: string | string[]): void {
    this.Log(msg, "DEBUG", tag);
  }

  public critical(msg: string, tag?: string | string[]): void {
    this.Log(msg, "CRITICAL", tag);
  }

  public board(): void {
    console.log("=".repeat(45));
  }
}

export = Versalog;
