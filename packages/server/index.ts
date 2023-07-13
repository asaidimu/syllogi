import { dirname } from "path";
import { fileURLToPath } from "url";
import app from "./src/core/index.js";
import schema from "@syllogi/model"

app.start({
    root: dirname(fileURLToPath(import.meta.url)),
    db: schema,
});
