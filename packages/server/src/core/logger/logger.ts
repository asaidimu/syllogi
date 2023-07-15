import { Writable } from "stream";
import { enableDebug, parsedDateTime, repeatChar } from "./utils.js";

type L = (...args: any) => any;

interface TryLog {
    <A extends L, F>(action: A, fallback: F, level?: LogLevel): Promise<
        ReturnType<A> | F
    >;
}

export default function createSystemLogger(streams: Array<Writable>) {
    const log = (level: LogLevel, msg: string | number) => {
        const size = 6 - level.length;
        const { date, time } = parsedDateTime();
        streams.forEach((s) =>
            s.write(
                `[${date}:${time}]${repeatChar(" ", size)}${level} │ ${msg}\n`
            )
        );
    };

    const levels: LogLevels = {
        log: (msg: string | number) => log("LOG", msg),
        warn: (msg: string | number) => log("WARN", msg),
        trace: (msg: string | number) => log("TRACE", msg),
        debug: (msg: string | number) => enableDebug() && log("DEBUG", msg),
        error: (msg: string | number) => log("ERROR", msg),
    };

    const tryLog: TryLog = async (action, fallback, level = "WARN") => {
        try {
            const results = await action();
            return results;
        } catch (e:any) {
            const logfn = levels[level.toLowerCase() as Lowercase<LogLevel>];
            if(e instanceof Error && e.stack !== undefined) {
                logfn(e.stack)
            } else {
                logfn(String(e))
            }
            return fallback;
        }
    };

    return Object.assign(levels, { tryLog });
}

declare global {
    type SystemLogger = ReturnType<typeof createSystemLogger>;
}
