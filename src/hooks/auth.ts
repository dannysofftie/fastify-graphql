import { rule } from 'graphql-shield';

export const isAuthorized = rule({ cache: 'no_cache' })(async (parent, args, context, info) => {
    const { id } = context.app.plugins.decodeJwtToken(context.app, context.reply.request);

    if (!id) {
        return false;
    }

    const data = await context.app.prisma.account.findUnique({ where: { id } });
    if (!data) return false;

    return true;
});

export const isAdmin = rule({ cache: 'no_cache' })(async (parent, args, context, info) => {
    const { id } = context.app.plugins.decodeJwtToken(context.app, context.reply.request);

    if (!id) {
        const error = new Error('Authorization token not found');
        error.name = 'MISSING_TOKEN';
        return error;
    }

    const data = await context.app.prisma.account.findUnique({ where: { id } });

    if (data.role !== 'ADMIN') {
        const error = new Error('Admin priviliges required to acces resource');
        error.name = 'PRIVILEGE';
        return error;
    }

    return true;
});
