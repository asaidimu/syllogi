import * as dotenv from 'dotenv'
dotenv.config()

export default {

    async start(config: Config) {
        const {default: Container} = await import("./container/index.js")
        const container = await Container(config)
        const server: Server = await container.resolve("server")
        server.listen()
    }
}
