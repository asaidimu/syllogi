import { asFunction, asValue, AwilixContainer, listModules } from 'awilix'
import { format } from 'path'

const makeControllerName = ({ name }: { name: string }): string => {
    const all = name.toLowerCase().split('')
    all[0] = all[0].toUpperCase()
    return `${all.join('')}Controller`
}

interface LoadStrategy {
    (args: { container: AwilixContainer<System>; root: string }): Promise<void>
}

const routes: LoadStrategy = async ({ container, root }) => {
    const base = `src/service`
    const match = (s: string) => `${format({ base, dir: root })}/**/presenter/${s}`

    const uriFromPath = ({ path }: { path: string }) => {
        const x = path.substring(root.length + base.length + 1)
        const uri = x.split('/')[1]
        return uri
    }

    const modules: Array<{ file: string; uri: string; controller: string }> =
        listModules([match('index.js')]).map((module) => {
            const uri = uriFromPath(module)
            const controller = makeControllerName({ name: uri })
            return { file: module.path, uri, controller }
        })

    const schemas = listModules([match('schema.js')]).map((schema) => {
        const uri = uriFromPath(schema)
        return { uri, file: schema.path }
    })

    const routes: Array<RouteComponents> = []

    for (const { file, uri, controller } of modules) {
        const schema = schemas.find((i) => i.uri === uri)

        routes.push({
            schema:
                schema === undefined
                    ? undefined
                    : (await import(schema.file)).default,
            io: (await import(file)).default,
            path: `/api/${uri}`,
            controller,
        })
    }

    container.register({
        routes: asValue(routes),
    })
}

const controllers: LoadStrategy = async ({ container, root }) => {
    const base = 'src/service'
    const match = `${format({ base, dir: root })}/**/controller/index.js`
    const nameFromPath = ({ path }: { path: string }) => {
        const x = path.substring(root.length + base.length + 1)
        return makeControllerName({
            name: x.split('/')[1]
        })
    }

    const modules = listModules([match])
     for (const { path } of modules) {
        const name = nameFromPath({ path })
        container.register({
            [name]: asFunction((await import(path)).default),
        })
    }
}

const strategies: Array<LoadStrategy> = [controllers, routes]

export default strategies
