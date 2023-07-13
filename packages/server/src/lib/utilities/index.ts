function exclude<Model, Key extends keyof Model>(
    model: Model,
    keys: Array<Key>
): Omit<Model, Key> {
    const result: Model = structuredClone(model) as any as Model;
    const all = Object.keys(result as any) as Array<keyof Model>;

    all.forEach((key) => {
        if (keys.findIndex((k) => k === key) !== -1) {
            delete result[key];
        }
    });

    return result as Omit<Model, Key>;
}

function pick<Model, Key extends keyof Model>(
    model: Model,
    keys: Array<Key>
): Pick<Model, Key> {
    const result: Model = structuredClone(model);
    const all = Object.keys(result as any) as Array<keyof Model>;

    all.forEach((key) => {
        if (keys.findIndex((k) => k === key) === -1) {
            delete result[key];
        }
    });

    return result;
}

const UtilityFunctions = {
    exclude,
    pick,
};

declare global {
    type UtilityFunctions = typeof UtilityFunctions;
}

export default UtilityFunctions;
