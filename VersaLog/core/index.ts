type LogMode = "simple" | "simple2" | "detailed" | "file";
type LogLevel = "INFO" | "ERROR" | "WARNING" | "DEBUG" | "CRITICAL";

import { format } from "date-fns";
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
  public tag: string[];
  public show_file: boolean;
  public show_tag: boolean;
  public notice: boolean;
  public all_save: boolean;
  public save_levels: LogLevel[];
  public silent: boolean;

  private notifyHandler?: (title: string, message: string) => void;

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
      throw new Error(`Invalid mode '${mode}'`);
    }

    this.mode = mode;
    this.show_file = show_file;
    this.show_tag = show_tag;
    this.tag = Array.isArray(tag) ? tag : tag ? [tag] : [];

    this.notice = notice;
    this.all_save = all_save;

    const valid_levels: LogLevel[] = [
      "INFO",
      "ERROR",
      "WARNING",
      "DEBUG",
      "CRITICAL",
    ];

    this.save_levels = save_levels ?? [...valid_levels];

    if (
      !Array.isArray(this.save_levels) ||
      !this.save_levels.every((l) => valid_levels.includes(l))
    ) {
      throw new Error(`Invalid save_levels`);
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

  public setNotifier(fn: (title: string, message: string) => void) {
    this.notifyHandler = fn;
  }

  private GetTime(): string {
    return format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  private GetCaller(): string {
    const stack = new Error().stack?.split("\n");
    const callerLine = stack && stack[3] ? stack[3] : stack?.[2] ?? "";
    const match = callerLine.match(/\(([^)]+)\)/);
    if (!match) return "";
    const parts = match[1].split(":");
    return `${parts[0].split("/").pop()}:${parts[1]}`;
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

      const { log_text } = this.log_queue.shift()!;
      const logDir = path.join(process.cwd(), "log");

      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

      const logFile = path.join(
        logDir,
        `${format(new Date(), "yyyy-MM-dd")}.log`
      );

      fs.appendFile(logFile, log_text + "\n", () => {
        setImmediate(processQueue);
      });
    };

    setImmediate(processQueue);
  }

  private cleanup_old_logs(days: number = 7): void {
    const logDir = path.join(process.cwd(), "log");
    if (!fs.existsSync(logDir)) return;

    const now = Date.now();

    for (const filename of fs.readdirSync(logDir)) {
      if (!filename.endsWith(".log")) continue;

      const filepath = path.join(logDir, filename);
      const stat = fs.statSync(filepath);

      const diffDays =
        (now - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays >= days) {
        try {
          fs.unlinkSync(filepath);
        } catch {}
      }
    }
  }

  private Log(msg: string, tye: LogLevel, tag?: string | string[]): void {
    const color = COLORS[tye];
    const symbol = SYMBOLS[tye];

    const tags: string[] = [];
    if (this.show_tag) {
      tags.push(...this.tag);
      if (tag) {
        if (Array.isArray(tag)) tags.push(...tag);
        else tags.push(tag);
      }
    }

    const tagStr = tags.length ? tags.map(t => `[${t}]`).join("") : "";

    const caller =
      this.show_file || this.mode === "file" ? this.GetCaller() : "";

    if (this.notice && (tye === "ERROR" || tye === "CRITICAL")) {
      this.notifyHandler?.(`${tye} Log notice`, msg);
    }

    let formatted = "";
    let plain = "";

    if (this.mode === "simple") {
      formatted =
        (this.show_file ? `[${caller}]` : "") +
        tagStr +
        `${color}${symbol}${RESET} ${msg}`;
      plain =
        (this.show_file ? `[${caller}]` : "") +
        tagStr +
        `${symbol} ${msg}`;
    } else if (this.mode === "simple2") {
      const time = this.GetTime();
      formatted = `[${time}]${caller ? ` [${caller}]` : ""}${tagStr}${color}${symbol}${RESET} ${msg}`;
      plain = `[${time}]${caller ? ` [${caller}]` : ""}${tagStr}${symbol} ${msg}`;
    } else if (this.mode === "file") {
      formatted = `[${caller}]${tagStr}${color}[${tye}]${RESET} ${msg}`;
      plain = `[${caller}]${tagStr}[${tye}] ${msg}`;
    } else {
      const time = this.GetTime();
      formatted = `[${time}]${color}[${tye}]${RESET}${tagStr}${
        this.show_file ? `[${caller}]` : ""
      } : ${msg}`;
      plain = `[${time}][${tye}]${tagStr}${
        this.show_file ? `[${caller}]` : ""
      } : ${msg}`;
    }

    if (!this.silent) {
      process.stdout.write(formatted + "\n"); // 🚀 高速化
    }

    if (this.all_save && this.save_levels.includes(tye)) {
      this.save_log(plain, tye);
    }
  }

  public info(msg: string, tag?: string | string[]) {
    this.Log(msg, "INFO", tag);
  }

  public error(msg: string, tag?: string | string[]) {
    this.Log(msg, "ERROR", tag);
  }

  public warning(msg: string, tag?: string | string[]) {
    this.Log(msg, "WARNING", tag);
  }

  public debug(msg: string, tag?: string | string[]) {
    this.Log(msg, "DEBUG", tag);
  }

  public critical(msg: string, tag?: string | string[]) {
    this.Log(msg, "CRITICAL", tag);
  }

  public board(): void {
    process.stdout.write("=".repeat(45) + "\n");
  }

  public progress(title: string, current: number, total: number, tag?: string | string[]) {
    const percent = total ? Math.floor((current / total) * 100) : 0;
    this.Log(`${title} : ${percent}% (${current}/${total})`, "INFO", tag);
  }

  public step(title: string, step: number, total: number, tag?: string | string[]) {
    this.Log(`[STEP ${step}/${total}] ${title}`, "INFO", tag);
  }

  public async timer(
    title: string,
    fn: () => Promise<void> | void,
    tag?: string | string[]
  ): Promise<void> {
    const start = Date.now();

    this.Log(`${title} : start`, "INFO", tag);

    try {
      await fn();
    } finally {
      const elapsed = (Date.now() - start) / 1000;
      this.Log(`${title} : done (${elapsed.toFixed(2)}s)`, "INFO", tag);
    }
  }
}

export default Versalog;
export { Versalog };