import { DataModel } from "@syllogi/model";
import * as dotenv from "dotenv";
dotenv.config();

const root = `${process.cwd()}/dist`

import { mockDeep } from "jest-mock-extended";

export const mockContainer = async () => {
    const { default: Container } = await import(
        root + "/src/core/container/index.js"
    );
    const container = await Container({
        root,
        db: mockDeep<DataModel>(),
    });
    return container;
};

export const app = async () => {
    const c = await mockContainer();
    const server: Server = await c.resolve("server");
    return server;
};
