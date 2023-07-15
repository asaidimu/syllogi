export default async function seeder({db, auth}:System){
    const root = await db.loginGroup.upsert({
        where: { name: "root" },
        update: {},
        create: {
            name: "root"
        }
    })

    const user = await db.loginGroup.upsert({
        where: { name: "user" },
        update: {},
        create: {
            name: "user"
        }
    })

    const adminPassword = await auth.hashPassword({password: "admin"})
    await db.login.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            groups: [root.id, user.id],
            username: "admin",
            password: adminPassword,
            active: true
        }
    })

    const userPassword = await auth.hashPassword({password: "doe"})
    await db.login.upsert({
        where: { username: "john" },
        update: {},
        create: {
            groups: [user.id],
            username: "john",
            password: userPassword,
            active: true
        }
    })

    await db.login.upsert({
        where: { username: "jane" },
        update: {},
        create: {
            groups: [user.id],
            username: "jane",
            password: userPassword,
            active: true
        }
    })
}
