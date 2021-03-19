import { makeExecutableSchema } from '@graphql-tools/schema';
import userAccountMutations from '@mutations/users/account';
import postsResolvers from '@queries/posts';
import userResolvers from '@queries/users';
import permissions from '@rules/index';
import { readFileSync } from 'fs';
import { applyMiddleware } from 'graphql-middleware';
import { gql } from 'mercurius-codegen';
import { join } from 'path';

const schemas = readFileSync(join(process.cwd(), 'graphql', 'schema.graphql'));
const queries = readFileSync(join(process.cwd(), 'graphql', 'queries.graphql'));
const mutations = readFileSync(join(process.cwd(), 'graphql', 'mutations.graphql'));

const typeDefs = gql`
    ${schemas}
    ${queries}
    ${mutations}
`;

export const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers: {
            Query: {
                ...userResolvers,
                ...postsResolvers,
            },
            Mutation: {
                ...userAccountMutations,
            },
        },
    }),
    permissions
);
