declare class Versalog {
    mode: string;
    tag: string;
    show_file: boolean;
    show_tag: boolean;
    constructor(mode?: string, show_file?: boolean, show_tag?: boolean, tag?: string | null, all?: boolean);
    setConfig(options: {
        mode?: string;
        show_file?: boolean;
        show_tag?: boolean;
        tag?: string;
        all?: boolean;
    }): void;
    private GetTime;
    private GetCaller;
    private Log;
    info(msg: string, tag?: string): void;
    error(msg: string, tag?: string): void;
    warning(msg: string, tag?: string): void;
    debug(msg: string, tag?: string): void;
    critical(msg: string, tag?: string): void;
}
export = Versalog;
