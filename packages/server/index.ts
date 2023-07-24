import path, { dirname } from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import createApplication from "./src/app/index.js";
import yargs from "yargs";
const prisma = new PrismaClient();

const argv = await yargs(process.argv.slice(2)).options({
  seed: { type: "boolean", default: false },
  serve: { type: "boolean", default: false },
}).argv;

const root = dirname(fileURLToPath(import.meta.url));
const app = await createApplication({
  root,
  db: prisma,
  logs: {
    local: {
      root: path.join(root, ".logs"),
      file: "system.log",
    },
  },
});

if (argv.seed) {
  await app.seed();
  process.exit();
} else if (argv.serve) {
  app.start();
}
