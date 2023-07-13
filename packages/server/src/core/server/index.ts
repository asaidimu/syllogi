import bodyParser from 'body-parser'
import cookie from 'cookie-parser'
import cors from 'cors'
import express, { Router } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { nullifyBody, validateRequestBody} from './middleware.js'

const app  = express()

/* security middleware */
app.use(helmet())

/* logging middleware */
app.use(morgan('tiny'))

/* body parser */
app.use(bodyParser.json())

/* cookie parser */
app.use(cookie())

/* nullify body if empty */
app.use(nullifyBody)

/* Cors */
app.use(cors())

/* prevent caching */
app.disable('etag');

const Server = async ({ routes, db, authentication, scope }:System): Promise<Server> => {
    app.use(authentication.decodeAuthToken)

    /* routes */
    routes.forEach(({ path, io, controller, schema }) => {
        const router = Router()
        const routeController = scope.resolve(controller)
        const validate = validateRequestBody(schema)
        io({ router, controller: routeController, validate, authentication, allow:authentication.allow })
        app.use(path, router);
    })

    const port = process.env.HTTP_PORT || 3000

    return {
        app,
        listen() {
            const server = app.listen(port, () => {
                console.log(`Started server on port ${port}!`)
            })

            const closeEvents = ['SIGINT', 'SIGHUP']

            closeEvents.forEach(e => {
                process.on(e, async () => {
                    console.log(`Stopping server!`)
                    server.close()
                    await db.$disconnect()
                });
            })

        },
    }
}

export default Server
