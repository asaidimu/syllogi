import { Login, LoginGroup } from "@prisma/client";

type LoginCredentials = Pick<Login, "id" | "password" | "groups">;

const controller = ({ db, utils }: System) => {
  const actions = {
    async createLoginGroup(data: LoginGroup): Promise<{ id: number }> {
      const { id } = await db.loginGroup.create({
        data,
      });
      return { id };
    },

    async createLogin(
      data: Omit<Login, "id" | "createdOn">
    ): Promise<{ id: number }> {
      const { id } = await db.login.create({
        data,
      });

      return { id };
    },
    async updateLogin({
      id,
      data,
    }: Pick<Login, "id"> & {
      data: Partial<Omit<Login, "id" | "createdOn" | "active">>;
    }): Promise<boolean> {
      await db.login.update({
        where: { id },
        data,
      });
      return true;
    },

    async findLoginCredentials(
      where: Pick<Login, "username">
    ): Promise<LoginCredentials> {
      const login = await db.login.findUnique({
        where,
      });

      if (login === null || login === undefined) {
        throw new Error(`Login not found: ${JSON.stringify(where)}`);
      }

      return utils.pick(login, ["id", "groups", "password"]);
    },

    async findLogin(
      where: Partial<Omit<Login, "groups" | "createdOn" | "password">>
    ): Promise<Omit<Login, "password">> {
      const login = await db.login.findUnique({
        where,
      });

      if (login === null) {
        throw new Error(`Login not found: ${JSON.stringify(where)}`);
      }
      return utils.exclude(login as Login, ["password"]);
    },
    async activateLogin(where: Pick<Login, "id">): Promise<boolean> {
      await db.login.update({
        where,
        data: {
          active: true,
        },
      });

      return true;
    },
    async deactivateLogin(where: Pick<Login, "id">): Promise<boolean> {
      await db.login.update({
        where,
        data: {
          active: false,
        },
      });

      return true;
    },
  };
  return actions;
};

declare global {
  type LoginController = ReturnType<typeof controller>;
}
export default controller;
