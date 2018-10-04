// @flow
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const dataServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
  }),
});

export default dataServer;
