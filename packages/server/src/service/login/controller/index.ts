import { Login, LoginGroup } from "@syllogi/model"

declare global {
    type LoginCredentials = Pick<Login, "id"|"password"|"groups">
    type PublicLoginData = Omit<Login, "password">
    interface LoginController {
        createLogin: (args:Omit<Login, "id"|"createdOn">) => Promise<{ id: number } | null>
        createLoginGroup: (args:LoginGroup) => Promise<{ id: number} | null>
        updateLogin: (args: Pick<Login, "id"> & { data: Partial<Omit<Login, "id"|"createdOn"|"active" >>}) => Promise<boolean>
        findLoginCredentials: (where: Pick<Login, "username"> ) => Promise<LoginCredentials | null>
        findLogin: (where: Partial<Omit<Login, "groups"|"createdOn"| "password" >> ) => Promise<PublicLoginData | null>
        activateLogin: (args: Pick<Login, "id">) => Promise<boolean>
        deactivateLogin: (args: Pick<Login, "id">) => Promise<boolean>
    }
}

const controller: Controller<LoginController> = ({ db, utils, logger }) => {

    return {
        async createLoginGroup(data) {
            const fn = async () => {
                const { id } = await db.loginGroup.create({
                    data,
                });
                return { id };
            }
            return logger.tryLog(fn, null)
        },

        async createLogin(data) {
            const fn = async () => {
                const { id } = await db.login.create({
                    data,
                });

                return { id };
            }
            return logger.tryLog(fn, null)
        },

        async updateLogin({ id, data }) {
            const fn = async () => {
                await db.login.update({
                    where: { id },
                    data,
                });
                return true
            }
            return logger.tryLog(fn, false)
        },

        async findLoginCredentials(where) {
            const fn = async () => {
                const login = await db.login.findUnique({
                    where
                })

                if(login === null || login === undefined) {
                    throw new Error(`Login not found: ${JSON.stringify(where)}`)
                }

                return utils.pick(login, ["id", "groups", "password"])
            }

            return logger.tryLog(fn, null)
        },

        async findLogin(where) {
            return logger.tryLog(async () => {
                const login = await db.login.findUnique({
                    where,
                })

                if(login === null) {
                    throw new Error(`Login not found: ${JSON.stringify(where)}`)
                }

                return utils.exclude(login, ['password'])

            }, null)
        },
        async activateLogin(where) {
            const fn = async () => {
                await db.login.update({
                    where,
                    data : {
                        active: true
                    }
                })
                return true
            }
            return logger.tryLog(fn, false)
        },
        async deactivateLogin(where) {
            const fn = async () => {
                await db.login.update({
                    where,
                    data : {
                        active: true
                    }
                })
                return true
            }
            return logger.tryLog(fn, false)
        }
    };
};

export default controller;
