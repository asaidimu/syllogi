import { asFunction, asValue, AwilixContainer, createContainer } from "awilix";
import seeder from "../../seed/index.js";
import authentication from "../authentication/index.js";
import initSystemLogger from "../logger/index.js";
import createApplicationProcessManager from "../process.js";
import Server from "../server/index.js";
import strategies from "./strategies.js";

const Container = async ({
  root,
  db,
  logs,
}: Config): Promise<AwilixContainer<System>> => {
  const container = createContainer();
  const logger = await initSystemLogger(logs);

  container.register({
    scope: asFunction(() => container.createScope()),
    server: asFunction(Server),
    auth: asValue(authentication),
    logger: asValue(logger),
    seeder: asFunction(seeder),
    process: asFunction(createApplicationProcessManager),
  });

  container.register({
    db: asValue(db),
  });

  for (const strategy of strategies) {
    await strategy({ container, root, logger });
  }

  return container;
};

export default Container;
