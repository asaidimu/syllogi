import { DataModel } from "@syllogi/model";
import { Request, Router } from "express";
import { ZodType } from "zod";

declare global {
    /*  TODO: Jul 13, 2023 Saidimu
     *  Add config option that specifies where logs go
     *  eg:
     *  logs: {
     *      network:uri,
     *      system:uri
     *  }
     *  */
    interface Config {
        root: string;
        db: DataModel | DeepMockProxy<DataModel>;
    }

    interface Route<Controller> {
        router: Router;
        authentication: Authentication;
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
        db: DataModel;
        server: Server;
        authentication: Authentication;
        scope: AwilixContainer<System>;
        routes: Array<RouteComponents>;
        utils: UtilityFunctions;
        logger: Logger;
        [key: string | symbol]: any;
    }

    interface ValidationSchema {
        [key: string]: ZodType;
    }
}
