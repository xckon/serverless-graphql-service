require('dotenv').config();
const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const port = process.env.PORT * 1;
const introspectionEnabled = process.env.INSTROSPECTION === "true" ? true : false;
const playgroundEnabled = process.env.PLAYGROUND === "true" ? true: false;

const dbAccess = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');



// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    dbAccess,
  }),
  context: async (req) => ({
    req,
    secret: process.env.SECRET,
    secureUsername: process.env.SECURE_USERNAME,
    securePassword: process.env.SECURE_PASSWORD,
  }),
  resolvers,
  introspection: introspectionEnabled,
  playground: playgroundEnabled,
});

// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});