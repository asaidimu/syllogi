import { validateAuthToken } from "./services.js";

export enum AccessControlGroup {
    ROOT = 0,
}

export const decodeAuthToken: Middleware = async (req, _, next) => {
    const tokenFrom = ({ header }: { header: string }): string | null => {
        if (header === undefined || String(header).length === 0) return null;
        const matches = header.match(/Bearer\s(.*)/);
        if (matches === null) return null;
        if (matches[1] === undefined) return null;
        return matches[1];
    };

    const headerToken = tokenFrom({ header: req.get('Authorization') as string })
    const cookieToken = req.cookies.auth_token || null
    const token = cookieToken !== null ? cookieToken : headerToken

    if (token !== null) {
        const login = await validateAuthToken({ token })
        req.login = login
    }

    next()
};


export const allow: AccessPolicyGenerator = ({ groups, check}={groups:[], check: () => true}) => {
    const allowed = Array.isArray(groups) ? groups : [ groups ]

    return (req, res, next) => {
        const error = () => res.status(403).send({ error: 'Unauthorized' })

        const login:AuthTokenPayload | null = req.login!

        if(login === null || login === undefined ) {
            return error()
        }

        const { groups }:SystemLogin = login

        /*
         * get intersection of groups to which the subject belongs and groups
         * to whom access is allowed
         */
        const accessibleGroups = groups.filter(require => allowed.findIndex(allow => allow === require) !== -1)

        const isRoot = () => {
            return accessibleGroups.findIndex(a => a === AccessControlGroup.ROOT) !== -1
        }

        /* If no groups in common subject is denied access */

        /*
         * if atleast one access group is defined
         * and
         *  the user is root
         *  or
         *  the user has passed the custom check
         * allow access
         */

        if(accessibleGroups.length > 0 && (isRoot || check!(login))) {
            return next()
        }

        return error()
    }
}

/*
 * Assumptions:
 * - all subjects have a security id
 * - all subjects must belong to at least one group
 * - all groups have a security id
 * - all subjects have a user id
 * - a subject can belong to multiple groups
 * - only one type of access exists: execute
 * - once a group is granted access to a procedure, all members can execute it
 */
