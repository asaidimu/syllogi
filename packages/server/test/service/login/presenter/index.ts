import request from "supertest";
import { Http2Server } from "http2";
import { DeepMockProxy } from "jest-mock-extended";
import { DataModel } from "@syllogi/model";
import { AwilixContainer } from "awilix";
import { mockContainer } from "../../../mock/index.js";

interface State {
    db: DeepMockProxy<DataModel>;
    app: Http2Server;
}

const loginPassword = "Doe"

const login = {
    username: "John",
    password: "Doe",
    groups: [],
    id: 1,
    createdOn: new Date(),
    active: false,
};

let container: AwilixContainer<System> | null = null;
let state: State | null = null;

beforeAll(async () => {
    container = await mockContainer();
    const auth:Authentication = await container?.resolve("authentication")!
    login.password = await auth.hashPassword({ password: loginPassword})
});

beforeEach(async () => {
    const db:DeepMockProxy<DataModel> = container?.resolve("db")!;
    const server:Server = await container?.resolve("server")!;
    state = { app:server.app, db} as any;
});

test("Can authenticate a login", async () => {
    const { app, db } = state!;
    db.login.findUnique.mockResolvedValue(login);
    const response = await request(app)
        .post("/api/login/authenticate")
        .type("json")
        .send(JSON.stringify({ username: login.username, password: loginPassword }));
    expect(response.status).toBe(201);
});
