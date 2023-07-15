import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { Writable } from "stream";
import createSystemLogger from "./logger.js";

async function initSystemLogger(config: Config["logs"]): Promise<SystemLogger> {
    const streams: Array<Writable> = [];
    await mkdir(config.local.root,{recursive:true, mode:"0755"})
    const logFile = path.join(config.local.root, config.local.file || "system.log")
    const stream = createWriteStream(logFile, {flags: "a"})
    streams.push(stream)
    if(config.stream) streams.push(config.stream)

    return createSystemLogger(streams);
}

export default initSystemLogger;
