import { IResolvers } from 'mercurius';
import { hash, compare } from 'bcrypt';
import { Prisma } from '@prisma/client';

const userAccountMutations: IResolvers['Mutation'] = {
  // @ts-ignore
  async signUp(_root, args, context, _info) {
    // validate email address
    if (!context.app.plugins.validateEmailAddress(args.input.email)) {
      return {
        error: {
          field: 'email',
          message: 'Email validation failed',
        },
      };
    }

    const data: Prisma.UserCreateInput = {
      ...args.input,
      password: await hash(args.input.password, 10),
      role: 'ADMIN',
      name: context.app.plugins.toPascalCase(args.input.name),
      ...(args.input.phone && { phone: context.app.plugins.formatPhoneNumber(args.input.phone) }),
    };

    const user = await context.app.libs.prisma.user.create({ data, include: { avatar: true } }).catch(err => {
      return {
        error: {
          field: 'email',
          message: 'Email already in use',
        },
      };
    });
    if (user?.['error'])
      return {
        error: {
          field: 'email',
          message: 'Email already in use',
        },
      };

    // optionally send an email
    return { message: 'Successfully created user account' };
  },
  async signIn(_root, args, context, _info) {
    const phone = context.app.plugins.formatPhoneNumber(args.input.phone);
    const user = await context.app.libs.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return {
        error: {
          field: 'user',
          message: 'Account does not exist',
        },
      };
    }

    // validate password
    if (!(await compare(args.input.password, user.password))) {
      return {
        error: {
          field: 'password',
          message: 'Password does not match',
        },
      };
    }

    return {
      message: 'Authenticated successfully',
      user,
      payload: {
        token: context.app.plugins.jwt.sign({ id: user.id, role: user.role, email: user.email, phone: user.phone }),
      },
    };
  },
};

export default userAccountMutations;
