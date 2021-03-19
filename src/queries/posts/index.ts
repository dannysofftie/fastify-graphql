import { IResolvers } from 'mercurius';

const postsResolvers: IResolvers['Query'] = {
    async getPosts(root, args, ctx, info) {
        const posts = await ctx.app.prisma.account.findMany();
        console.log(posts);
        // root ~ {}
        // name ~ string
        // ctx.authorization ~ string | undefined
        // info ~ GraphQLResolveInfo
        return [{ id: 'uhdfu4h35t6b', name: 'Post content here' }];
    },
};

export default postsResolvers;
