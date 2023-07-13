import { Writable } from "stream";

type LogLevel = "LOG" | "WARN" | "TRACE" | "DEBUG" | "ERROR";

const repeatChar = (char: string, size: number): string => {
    return Array.from(new Array(size))
        .map((_) => char)
        .join("");
};

function enableDebug(): boolean {
    const debugEnv = process.env.DEBUG;
    const nodeEnv = process.env.NODE_ENV;

    return (
        (nodeEnv !== undefined &&
            nodeEnv?.toLowerCase().match("dev") !== null) ||
        debugEnv !== undefined
    );
}

export function createLogger(out: Writable = process.stdout) {
    const logger = (level: LogLevel, msg: string | number) => {
        const size = 6 - level.length;
        out.write(`${repeatChar(" ", size)}${level} │ ${msg}\n`);
        /* const dateTime = (new Date()).toISOString()
           const date = dateTime.substring(0, 10).replace(/-/g,":")
           const time = dateTime.substring(11, 19) */
    };

    type LogLevels = {
        [Property in Lowercase<LogLevel>]: (msg: string | number) => void;
    };

    const levels: LogLevels = {
        log: (msg: string | number) => logger("LOG", msg),
        warn: (msg: string | number) => logger("WARN", msg),
        trace: (msg: string | number) => logger("TRACE", msg),
        debug: (msg: string | number) => {
            if (enableDebug()) {
                logger("DEBUG", msg);
            }
        },
        error: (msg: string | number) => logger("ERROR", msg),
    };

    async function tryLog<T extends { (...args: any): any }, F>(
        fn: T,
        fallback: F,
        level: LogLevel = "WARN"
    ): Promise<ReturnType<T> | F> {
        try {
            const results = await fn();
            return results;
        } catch (e) {
            levels[level.toLowerCase() as Lowercase<LogLevel>](String(e));
            return fallback;
        }
    }

    return Object.assign(levels, { tryLog });
}

declare global {
    type Logger = ReturnType<typeof createLogger>;
}

/* TODO: Jul 13, 2023 Saidimu
 * Refactor logger so that it can take parameters declared in config
 * in particular, so that the developer can determine where logs
 * go.
 * The suggested param is an uri that can be used to open a writeable stream
 */
export default createLogger();
