import { format } from "date-fns";

const COLORS: Record<string, string> = {
    "INFO": "\x1b[32m",
    "ERROR": "\x1b[31m",
    "WARNING": "\x1b[33m",
    "DEBUG": "\x1b[36m",
    "CRITICAL": "\x1b[35m",
}

const SYMBOLS: Record<string, string> = {
    "INFO": "[+]",
    "ERROR": "[-]",
    "WARNING": "[!]",
    "DEBUG": "[D]",
    "CRITICAL": "[C]",
}

const RESET = "\x1b[0m"

class Versalog {
    private mode: string;
    private show_file: boolean;

    constructor(mode: string = "simple", show_file: boolean = false) {
        this.mode = mode.toLowerCase();
        this.show_file = show_file;

        const valid_modes = ["simple", "detailed", "file"];
        if (!valid_modes.includes(this.mode)) {
            throw new Error(`Invalid mode '${this.mode}' specified. Valid modes are: ${valid_modes.join(", ")}`);
        }
    }

    private GetTime(): string {
        return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    private GetCaller(): string {
        const err = new Error();
        const stack = err.stack?.split('\n');
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

    private Log(msg: string, type: string): void {
        const colors = COLORS[type] || '';
        const types = type.toUpperCase();
        const symbol = SYMBOLS[type] || '[?]';
        const caller = (this.show_file || this.mode === "file") ? this.GetCaller() : '';

        let formatted = '';
        if (this.mode === "simple") {
            if (this.show_file) {
                formatted = `[${caller}]${colors}${symbol}${RESET} ${msg}`;
            } else {
                formatted = `${colors}${symbol}${RESET} ${msg}`;
            }
        } else if (this.mode === "file") {
            formatted = `[${caller}]${colors}[${types}]${RESET} ${msg}`;
        } else {
            const time = this.GetTime();
            if (this.show_file) {
                formatted = `[${time}]${colors}[${types}]${RESET}[${caller}] : ${msg}`;
            } else {
                formatted = `[${time}]${colors}[${types}]${RESET} : ${msg}`;
            }
        }
        console.log(formatted);
    }

    public info(msg: string): void {
        this.Log(msg, "INFO");
    }

    public error(msg: string): void {
        this.Log(msg, "ERROR");
    }

    public warning(msg: string): void {
        this.Log(msg, "WARNING");
    }

    public debug(msg: string): void {
        this.Log(msg, "DEBUG");
    }

    public critical(msg: string): void {
        this.Log(msg, "CRITICAL");
    }
}

export = Versalog;