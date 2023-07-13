import { PrismaClient } from '@prisma/client';
export type DataModel = PrismaClient;
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined>;
export default prisma;
export * from '@prisma/client';
export * as Validator from './validator/index.js';
