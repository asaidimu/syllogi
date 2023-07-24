type CleanupCallback = () => Promise<void>;

function createApplicationProcessManager({ logger }: System) {
  const cleanupCallbacks: CleanupCallback[] = [];

  const handleEvent = async (event: string, error?: Error) => {
    console.error(`Event: ${event}`, error);
    await runCleanupCallbacks();

    // close logger
    await (logger as any).terminate();

    process.exit();
  };

  async function runCleanupCallbacks() {
    for (const callback of cleanupCallbacks) {
      try {
        await callback();
      } catch (err) {
        console.error("Error running cleanup callback:", err);
      }
    }
  }

  process.on("SIGINT", () => handleEvent("SIGINT"));
  process.on("SIGTERM", () => handleEvent("SIGTERM"));
  process.on("uncaughtException", (error: Error) =>
    handleEvent("uncaughtException", error)
  );
  process.on("unhandledRejection", (reason: any) =>
    handleEvent("unhandledRejection", reason)
  );
  return {
    onCleanUp: (callback: CleanupCallback) => {
      cleanupCallbacks.push(callback);
    },
  };
}

declare global {
  type ApplicationProcessManager = ReturnType<
    typeof createApplicationProcessManager
  >;
}

export default createApplicationProcessManager;
