const config: Config = { root: `${process.cwd()}/dist` }
const cache: { server: Server|null } = { server: null}

export const app = async() => {
        if(cache.server !== null) return cache.server

        const {default: Container} = await import(
            config.root + "/src/core/container/index.js"
        )
        const container = await Container(config)
        const server: Server = await container.resolve("server")
        cache.server = server
        return cache.server
}

