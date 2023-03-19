import { NextFunction, Request, Response } from 'express'
import { SafeParseError } from "zod"

export const nullifyBody = (req: Request, _: Response, next: NextFunction) => {
    const body = { ...req.body }

    Object.defineProperty(req, 'body', {
        get: () => {
            if (Object.entries(body).length === 0) {
                return null
            }
            return body
        },
    })

    next()
}


export const validateRequestBody = (schema?: ValidationSchema): Middleware => {
    if (schema === undefined) return (_, __, next) => next()

    return (req, res, next) => {
        const validator = schema[`${req.method}:${req.path}`]
        if (validator === undefined) {
            return next()
        }

        const result = validator.safeParse(req.body)

        if (!result.success) {
            res.status(400).send({ error: 'Bad Request' })
            const { error } = result as SafeParseError<any>
            console.warn(error)
            return
        }

        next()
    }
}
