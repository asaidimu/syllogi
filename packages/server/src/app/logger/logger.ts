import { Writable } from "stream";
import { enableDebug, parsedDateTime, repeatChar } from "./utils.js";

export default function createSystemLogger(streams: Array<Writable>) {
  const log = (level: LogLevel, msg: string | number) => {
    const size = 6 - level.length;
    const { date, time } = parsedDateTime();
    streams.forEach((s) =>
      s.write(`[${date}:${time}]${repeatChar(" ", size)}${level} │ ${msg}\n`)
    );
  };

  const levels: LogLevels = {
    log: (msg: string | number) => log("LOG", msg),
    warn: (msg: string | number) => log("WARN", msg),
    trace: (msg: string | number) => log("TRACE", msg),
    debug: (msg: string | number) => enableDebug() && log("DEBUG", msg),
    error: (msg: string | number) => log("ERROR", msg),
  };

  return levels;
}

declare global {
  type SystemLogger = ReturnType<typeof createSystemLogger>;
}
