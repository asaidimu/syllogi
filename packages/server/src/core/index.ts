import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

async function init(config:Config) {
    const {default: Container} = await import("./container/index.js")
    const container = await Container(config)

    const terminate = (fn: () => void = () => {}) => {
            const signals = ["SIGINT", "SIGHUP", "SIGTERM"]
            signals.forEach(s => {
                process.on(s, async () => {
                    fn()
                    const db:PrismaClient = await container.resolve("db")
                    await db.$disconnect()
                    process.exit()
                })
            })
    }

    return {
        start: async () => {
            const server: Server = await container.resolve("server")
            const app = server.listen()
            /** @ts-ignore */
            terminate(() => app.close())
        },
        seed: async () => {
            await container.resolve("seeder")
            terminate()
        }
    }
}

export default init
