import { format } from "date-fns";

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

    constructor(
        mode: string = "simple",
        show_file: boolean = false,
        show_tag: boolean = false,
        tag: string | null = null,
        all: boolean = false
    ) {
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
        this.tag = tag ?? "";
    }

    public setConfig(options: {
        mode?: string;
        show_file?: boolean;
        show_tag?: boolean;
        tag?: string;
        all?: boolean;
    }): void {
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
        if (options.show_file !== undefined) this.show_file = options.show_file;
        if (options.show_tag !== undefined) this.show_tag = options.show_tag;
        if (options.tag !== undefined) this.tag = options.tag;
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

    private Log(msg: string, type: string, tag?: string): void {
        const color = COLORS[type] ?? "";
        const symbol = SYMBOLS[type] ?? "[?]";
        const types = type.toUpperCase();

        const finalTag = tag ?? (this.show_tag ? this.tag : "");
        const caller = this.show_file || this.mode === "file" ? this.GetCaller() : "";

        let formatted = "";

        if (this.mode === "simple") {
            formatted = "";
            if (this.show_file) {
                formatted += `[${caller}]`;
            }
            if (finalTag) formatted += `[${finalTag}]`;
            formatted += `${color}${symbol}${RESET} ${msg}`;
        } else if (this.mode === "file") {
            formatted = `[${caller}]`;
            if (finalTag) formatted += `[${finalTag}]`;
            formatted += `${color}[${types}]${RESET} ${msg}`;
        } else {
            const time = this.GetTime();
            formatted = `[${time}]${color}[${types}]${RESET}`;
            if (finalTag) formatted += `[${finalTag}]`;
            if (this.show_file) formatted += `[${caller}]`;
            formatted += ` : ${msg}`;
        }

        console.log(formatted);
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
