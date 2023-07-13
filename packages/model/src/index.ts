import { PrismaClient } from '@prisma/client'

export type DataModel = PrismaClient
const prisma = new PrismaClient()

export default prisma
export * from '@prisma/client'
export * as Validator from './validator/index.js'
