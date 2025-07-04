declare class Versalog {
    private mode;
    private show_file;
    constructor(mode?: string, show_file?: boolean);
    private GetTime;
    private GetCaller;
    private Log;
    info(msg: string): void;
    err(msg: string): void;
    war(msg: string): void;
}
export = Versalog;
