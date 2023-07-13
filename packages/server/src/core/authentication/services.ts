import argon2 from "argon2";
import { createSecretKey } from "crypto";
import { jwtVerify, SignJWT } from "jose";

const secretKey = createSecretKey(process.env.JWT_SECRET as string, "utf-8");

const keys: Array<string> = [];

export const generateAuthToken: AuthTokenGenerator = async (args) => {
    const { id, groups } = args;
    const token = await new SignJWT({ id, groups })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("8h")
        .sign(secretKey);

    keys.push(token)
    return token;
};

export const validateAuthToken: AuthTokenValidator = async ({ token }) => {
    const index = keys.findIndex((t) => t === token);

    if (index === -1) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as never as AuthTokenPayload;
    } catch (e: any) {
        if (e.code === "ERR_JWT_EXPIRED") {
            keys.splice(index);
        }
        return null;
    }
};

export const hashPassword: PasswordHashGenerator = async ({ password }) => {
    return await argon2.hash(password);
};

export const verifyPassword: PasswordValidator = async ({ password, hash }) => {
    return await argon2.verify(hash, password);
};
