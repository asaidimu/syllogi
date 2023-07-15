import { AwilixContainer } from "awilix";
import { mockContainer } from "../../mock/index.js";

interface State {
    utils: UtilityFunctions
    logger: SystemLogger
}
let container: AwilixContainer<System> | null = null;

let state: State | null = null;
beforeAll(async () => {
    container = await mockContainer();
});

beforeEach(async () => {
    const utils = container?.resolve("utils");
    const logger = container?.resolve("logger")
    state = { utils, logger } as any;
});

test("pick() can select specific values from an object", () => {
    const data = { a: 1, b: 2, c:3}
    const selected = state!.utils.pick(data, ["a", "b"])
    expect(selected).toEqual({ a:1, b:2})
})

test("exclude() can exclude specific values from an object", () => {
    const data = { a: 1, b: 2, c:3}
    const selected = state!.utils.exclude(data, ["a", "b"])
    expect(selected).toEqual({ c:3})
})

test("tryLog() can catch and log errors", async () => {
    const fn = async () => {
        /* @ts-ignore */
        undefinedFunction()
    }
    const result = await state!.logger.tryLog(fn, false)
    expect(result).toEqual(false)
})
