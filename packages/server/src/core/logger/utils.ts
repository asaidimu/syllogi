
export function enableDebug(): boolean {
    const debugEnv = process.env.DEBUG;
    const nodeEnv = process.env.NODE_ENV;

    return (
        (nodeEnv !== undefined &&
            nodeEnv?.toLowerCase().match("dev") !== null) ||
        debugEnv !== undefined
    );
}

export const repeatChar = (char: string, size: number): string => {
    return Array.from(new Array(size))
        .map((_) => char)
        .join("");
};

export const parsedDateTime = (): { date:string, time: string} => {
    const dateTime = (new Date()).toISOString()
    const date = dateTime.substring(0, 10).replace(/-/g,":")
    const time = dateTime.substring(11, 19)
    return {
        date, time
    }
}

