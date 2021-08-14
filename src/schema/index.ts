import { makeExecutableSchema } from '@graphql-tools/schema';
import mutations from '@mutations/index';
import queries from '@queries/index';
import permissions from '@rules/index';
import { readdirSync, readFileSync } from 'fs';
import { applyMiddleware } from 'graphql-middleware';
import { join } from 'path';

const rootPath = join(process.cwd(), 'graphql');
const definitons = [];

for (const file of readdirSync(rootPath)) {
  if (!/\.gql$/.test(file)) continue;
  const content = readFileSync(`${rootPath}/${file}`, 'utf-8');
  definitons.push(content);
}

export const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: definitons.join('\n'),
    resolvers: {
      Query: queries,
      Mutation: mutations,
    },
  }),
  permissions
);
