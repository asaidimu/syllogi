type LogLevel = "LOG" | "WARN" | "TRACE" | "DEBUG" | "ERROR";

type LogLevels = {
    [Property in Lowercase<LogLevel>]: (msg: string | number) => void;
};
