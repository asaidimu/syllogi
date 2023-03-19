import { Request, Router } from 'express'
import { ZodType } from 'zod'

declare global {

    interface Config {
        root: string
    }

    interface Route<Controller> {
        router: Router
        authentication: Authentication
        controller: Controller
        allow: AccessPolicyGenerator
        validate: Middleware
    }

    interface RouteComponents {
        path: string
        schema?: ValidationSchema
        io: (opts: Route<any>) => void
        controller: any
    }

    interface Server {
        app: Application
        listen: () => void
    }

    interface Login {
        uid: number,
        groups: Array<number>,
        password?: String
    }

    interface ClientRequest extends Request {
        login?: AuthTokenPayload | null
        params? : {
            uid?: number // user id or something of the kind
        }
    }

    interface Middleware {
        (req: ClientRequest, res: Response, next: NextFunction): any
    }

    interface Controller<T> {
        (args: System): T
    }

    interface System {
        db: PrismaClient
        server: Server
        authentication: Authentication
        scope: AwilixContainer<System>
        routes: Array<RouteComponents>
        [key: string | symbol]: any
    }

    interface ValidationSchema {
        [key: string]: ZodType
    }
}
