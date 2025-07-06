declare class Versalog {
    private mode;
    private show_file;
    constructor(mode?: string, show_file?: boolean);
    private GetTime;
    private GetCaller;
    private Log;
    info(msg: string): void;
    error(msg: string): void;
    warning(msg: string): void;
    debug(msg: string): void;
    critical(msg: string): void;
}
export = Versalog;
