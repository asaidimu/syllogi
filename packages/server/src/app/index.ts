import * as dotenv from "dotenv";
dotenv.config();

async function init(config: Config) {
  const { default: Container } = await import("./container/index.js");
  const container = await Container(config);
  const appProcess: ApplicationProcessManager = await container.resolve(
    "process"
  );

  return {
    start: async () => {
      const server: Server = await container.resolve("server");
      const app = server.listen();
      /** @ts-ignore */
      appProcess.onCleanUp(() => app.close());
    },
    seed: async () => {
      await container.resolve("seeder");
      process.exit();
    },
  };
}

export default init;
