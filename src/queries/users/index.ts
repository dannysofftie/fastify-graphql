import { IResolvers } from 'mercurius';

const userResolvers: IResolvers['Query'] = {
  async getUsers(root, args, ctx, info) {
    const users = await ctx.app.libs.prisma.user.findMany();

    // handle any error just in case
    return users;
  },
};

export default userResolvers;
