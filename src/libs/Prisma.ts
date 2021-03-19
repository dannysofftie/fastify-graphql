import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp((app: FastifyInstance, _opts: unknown, done: (err?: Error) => void) => {
    const prisma = new PrismaClient();
    app.decorate('prisma', prisma);
    done();
});
