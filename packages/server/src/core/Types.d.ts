import { Request, Router } from "express";
import { Writable } from "stream";
import { ZodType } from "zod";

declare global {

    interface Config {
        root: string;
        db: PrismaClient | DeepMockProxy<PrismaClient>;
        logs: {
            stream?: Writable
            local: {
                root: string,
                file?:string
            }
        };
    }

    interface Route<Controller> {
        router: Router;
        auth: Authentication;
        controller: Controller;
        allow: AccessPolicyGenerator;
        validate: Middleware;
    }

    interface RouteComponents {
        path: string;
        schema?: ValidationSchema;
        io: (opts: Route<any>) => void;
        controller: any;
    }

    interface Server {
        app: Application;
        listen: () => void;
    }

    interface SystemLogin {
        id: number;
        groups: Array<number>;
        username?: string;
        password?: String;
    }

    interface ClientRequest extends Request {
        login?: AuthTokenPayload | null;
        params?: {
            uid?: number; // user id or something of the kind
        };
    }

    interface Middleware {
        (req: ClientRequest, res: Response, next: NextFunction): any;
    }

    interface Controller<T> {
        (args: System): T;
    }

    interface System {
        db: PrismaClient;
        server: Server;
        auth: Authentication;
        scope: AwilixContainer<System>;
        routes: Array<RouteComponents>;
        utils: UtilityFunctions;
        logger: Logger;
        seeder: Function
        [key: string | symbol]: any;
    }

    interface ValidationSchema {
        [key: string]: ZodType;
    }
}
