import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFile } from 'node:fs/promises';
import { createDataLoaders } from './dataloaders.js';
import { db } from './database.js';
//import { resolvers } from './resolvers-naive.js';
import { resolvers } from './resolvers.js';

const typeDefs = await readFile(new URL('./schema.graphql', import.meta.url), 'utf8');
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    loaders: createDataLoaders(db)
  })
});
console.log(`🚀 Servidor Académico listo en: ${url}`);
