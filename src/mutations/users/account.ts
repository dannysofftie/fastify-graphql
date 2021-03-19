import { IResolvers } from 'mercurius';
import { hash, compare } from 'bcrypt';
import { Prisma } from '@prisma/client';

const userAccountMutations: IResolvers['Mutation'] = {
    async signUp(_root, args, context, _info) {
        // validate email address
        if (!context.app.plugins.validateEmailAddress(args.input.email)) {
            return context.app.plugins.throwError('VALIDATION_ERROR', 'Email validation failed');
        }

        const data: Prisma.AccountCreateInput = {
            ...args.input,
            password: await hash(args.input.password, 10),
            role: 'ADMIN',
            name: context.app.plugins.toPascalCase(args.input.name),
            ...(args.input.phone && { phone: context.app.plugins.formatPhoneNumber(args.input.phone) }),
        };

        const user = await context.app.prisma.account.create({ data, include: { profile: true } }).catch(err => {
            return context.app.plugins.throwError('VALIDATION_ERROR', `${err?.meta?.target?.join(' ') as string} is already in use`);
        });

        // optionally send an email
        return user;
    },
    async signIn(_root, args, context, _info) {
        const phone = context.app.plugins.formatPhoneNumber(args.input.phone);
        const user = await context.app.prisma.account.findUnique({
            where: { phone },
        });

        if (!user) {
            return context.app.plugins.throwError('USER_NOT_FOUND', 'Account does not exist!');
        }

        // validate password
        if (!(await compare(args.input.password, user.password))) {
            return context.app.plugins.throwError('PASSWORD_MISMATCH', 'Password mismatch!');
        }

        return {
            message: 'Authenticated successfully',
            user,
            payload: {
                token: context.app.plugins.sign({ id: user.id, role: user.role, email: user.email, phone: user.phone }),
            },
        };
    },
};

export default userAccountMutations;
