import { validateAuthToken } from "./services.js";

enum AccessControlGroup {
  ROOT = 1,
}

export const decodeAuthToken: Middleware = async (req, _, next) => {
  const tokenFrom = ({ header }: { header: string }): string | null => {
    if (header === undefined || String(header).length === 0) return null;
    const matches = header.match(/Bearer\s(.*)/);
    if (matches === null) return null;
    if (matches[1] === undefined) return null;
    return matches[1];
  };

  const headerToken = tokenFrom({
    header: req.get("Authorization") as string,
  });
  const cookieToken = req.cookies.auth_token || null;
  const token = cookieToken !== null ? cookieToken : headerToken;

  if (token !== null) {
    const login = await validateAuthToken({ token });
    req.login = login;
  }

  next();
};

export const allow: AccessPolicyGenerator = (
  { groups, check } = { groups: [], check: () => true }
) => {
  const allowed = Array.isArray(groups) ? groups : [groups];

  return (req, res, next) => {
    const error = () => res.status(403).send({ error: "Unauthorized" });

    const login: AuthTokenPayload | null = req.login!;

    if (!login) {
      return error();
    }

    const { groups }: SystemLogin = login;

    /*
     * Filter out the groups which satisfy the following conditions:
     *  a). The group in question is allowed access to the resource
     *  b). The user is a member of the said group.
     */
    const accessibleGroups = groups.reduce((acc, curr) => {
      if (allowed.findIndex((i) => i === curr) !== -1) {
        acc.push(curr);
      }
      return acc;
    }, [] as Array<number>);

    const isRoot = () => {
      const index = accessibleGroups.findIndex(
        (a) => a === AccessControlGroup.ROOT
      );
      return index !== -1;
    };

    /* If no groups in common subject is denied access */

    /*
     * if atleast one access group is defined
     * and
     *  the user is root
     *  or
     *  the user has passed the custom check
     * allow access
     */

    if (accessibleGroups.length > 0 && (isRoot || check!(login))) {
      return next();
    }

    return error();
  };
};

/*
 * Rules:
 * - all subjects have a security id
 * - all subjects must belong to at least one group
 * - all groups have a security id
 * - all subjects have a user id
 * - a subject can belong to multiple groups
 * - only one type of access exists: execute
 * - once a group is granted access to a procedure, all members can execute it
 */
