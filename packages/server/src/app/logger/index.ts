import { createWriteStream, promises as fsPromises } from "fs";
import { join } from "path";
import { Writable } from "stream";
import createSystemLogger from "./logger.js";

async function initSystemLogger(
  config: Config["logs"]
): Promise<SystemLogger & { terminate: () => Promise<void> }> {
  const streams: Array<Writable> = [];

  async function closeStreams() {
    const promises = streams.map((stream): Promise<void> => {
      return new Promise((resolve) => {
        stream.end(() => resolve());
      });
    });
    await Promise.all(promises);
  }

  try {
    await fsPromises.mkdir(config.local.root, {
      recursive: true,
      mode: 0o755,
    });

    const logFile = join(config.local.root, config.local.file || "system.log");
    const stream = createWriteStream(logFile, { flags: "a" });
    streams.push(stream);

    if (config.stream) streams.push(config.stream);

    return Object.assign(createSystemLogger(streams), {
      terminate: closeStreams,
    });
  } catch (err) {
    console.error("Error initializing system logger:", err);
    throw err;
  }
}

declare global {
  type InternalSystemLogger = ReturnType<typeof initSystemLogger>;
}
export default initSystemLogger;
