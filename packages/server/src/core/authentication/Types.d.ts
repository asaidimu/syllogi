interface PasswordHashGenerator {
    (args: { password: string }): Promise<string>;
}

interface PasswordValidator {
    (args: { password: string; hash: string }): Promise<boolean>;
}

type AuthTokenPayload = Login & { exp: number }

interface AuthTokenValidator {
    (args: { token: string }): Promise<AuthTokenPayload | null>;
}

interface AuthTokenGenerator {
    (args: Login): Promise<string>;
}

interface AccessPolicyGenerator {
    (args:{
        groups: number | Array<number>
        check?: (args:AuthTokenPayload) => Boolean
    }): Middleware
}

