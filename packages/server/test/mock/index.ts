import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const root = `${process.cwd()}/dist`;

import { mockDeep } from "jest-mock-extended";
import path from "path";

export const mockContainer = async () => {
  const { default: Container } = await import(
    root + "/src/app/container/index.js"
  );
  const container = await Container({
    root,
    db: mockDeep<PrismaClient>(),
    logs: {
      local: {
        root: path.join(root, "./test/logs"),
        file: "system.log",
      },
    },
  });
  return container;
};

export const app = async () => {
  const c = await mockContainer();
  const server: Server = await c.resolve("server");
  return server;
};
