import { dirname } from 'path';
import { fileURLToPath } from 'url';
import app from './src/core/index.js'

app.start({
    root: dirname(fileURLToPath(import.meta.url))
})
