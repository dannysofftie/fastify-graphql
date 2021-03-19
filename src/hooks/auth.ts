import { rule } from 'graphql-shield';
import { MercuriusContext } from 'mercurius';

export const isAuthorized = rule({ cache: 'no_cache' })(async (parent, args, context: MercuriusContext, info) => {
    const { id } = context.app.plugins.decodeJwtToken(context.app, context.reply.request);
    if (!id) {
        return context.app.plugins.throwError('MISSING_TOKEN', 'Authorization token not found');
    }
    const data = await context.app.prisma.account.findUnique({ where: { id } });
    if (!data) return false;
    return true;
});

export const isAdmin = rule({ cache: 'no_cache' })(async (parent, args, context: MercuriusContext, info) => {
    const { id } = context.app.plugins.decodeJwtToken(context.app, context.reply.request);
    if (!id) {
        return context.app.plugins.throwError('MISSING_TOKEN', 'Authorization token not found');
    }
    const data = await context.app.prisma.account.findUnique({ where: { id } });

    if (data.role !== 'ADMIN') {
        return context.app.plugins.throwError('PRIVILEGE', 'Admin priviliges required to acces resource');
    }

    return true;
});
