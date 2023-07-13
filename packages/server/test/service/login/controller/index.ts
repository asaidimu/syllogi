import { DataModel } from "@syllogi/model";
import { AwilixContainer } from "awilix";
import { DeepMockProxy } from "jest-mock-extended";
import { mockContainer } from "../../../mock/index.js";

interface State {
    controller: LoginController;
    db: DeepMockProxy<DataModel>;
}

let container: AwilixContainer<System> | null = null;
const login = {
    username: "John",
    password: "Doe",
    groups: [],
    id: 1,
    createdOn: new Date(),
    active: false,
};
let state: State | null = null;

beforeAll(async () => {
    container = await mockContainer();
});

beforeEach(async () => {
    const controller = container?.resolve("LoginController");
    const db = container?.resolve("db");
    state = { controller, db } as any;
});

test("createLogin(loginInfo)", async () => {
    const { db, controller } = state!;
    db.login.create.mockResolvedValue(login);
    const result = await controller.createLogin(login);
    expect(result).toStrictEqual({ id: login.id });
});

test("upateLogin({ id, data})", async () => {
    const { db, controller } = state!;
    const newUsername = "Jane";
    db.login.update.mockResolvedValue(login);
    const updated = await controller.updateLogin({
        id: login.id ,
        data: { username: newUsername },
    });
    expect(updated).toStrictEqual(true);
});

test("findLoginCredentials({ username, password })", async () => {
    const { db, controller } = state!;
    db.login.findUnique.mockResolvedValue(login);
    const credentials = await controller.findLoginCredentials({
        username: login.username,
    });
    expect(credentials).toEqual ({
        id: login.id,
        groups: login.groups,
        password: login.password,
    });
});

test("findLogin({ username })", async () => {
    const { db, controller } = state!;
    db.login.findUnique.mockResolvedValue(login);
    const expected = (container?.resolve("utils") as UtilityFunctions).exclude(
        login,
        ["password"]
    );
    const found = await controller.findLogin({ username: login.username });
    expect(found).toStrictEqual(expected);
});

test("activateLogin({ id })", async () => {
    const { db, controller} = state!
    db.login.update.mockResolvedValue(login);
    const success = await controller.activateLogin({ id:login.id})
    expect(success).toBe(true)
})

test("deactivateLogin({ id })", async () => {
    const { db, controller} = state!
    db.login.update.mockResolvedValue(login);
    const success = await controller.deactivateLogin({ id:login.id})
    expect(success).toBe(true)
})
