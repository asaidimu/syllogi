import { asFunction, asValue, AwilixContainer, createContainer } from "awilix"
import prisma from "../store/index.js"
import authentication from "../authentication/index.js"
import Server from "../server/index.js"
import strategies from "./strategies.js"


const Container  = async ({ root }: Config): Promise<AwilixContainer<System>> => {
    const container = createContainer()

    container.register({
        scope: asFunction(() => container.createScope()),
        server: asFunction(Server),
        authentication: asValue(authentication)
    })

    container.register({
        db: asValue(prisma)
    })
    for(const strategy of strategies) {
        await strategy({ container, root })
    }

    return container
}

export default Container
