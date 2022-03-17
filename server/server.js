require('dotenv').config()
require("./mongo")
const express = require('express')
const path = require('path')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { graphqlUploadExpress } = require('graphql-upload');
const http = require('http');
const {typeDefs} = require('./resolvers/typeDefs')
const resolvers = require('./resolvers/resolvers');
// const {books, authors} = require('./resolvers/db');
const Data = require('./resolvers/db');
const User = require("./Models/userSchema")
const StarwarsAPI = require('./Data/DataApi')
const postTypeDef = require('./resolvers/PostTypedefs')
const userTypeDefs = require('./resolvers/userTypeDefs')
const auth = require('./utils/auth')
const { makeExecutableSchema } = require('@graphql-tools/schema');
const authDirectiveTransformer = require('./directives/authDirective')


async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);


  //if i want to use the makeExecutableSchema
  let schema = makeExecutableSchema({
    typeDefs: [typeDefs, postTypeDef, userTypeDefs],
    resolvers
  });

  // to use the custom auth directive i created
  schema = authDirectiveTransformer(schema, 'auth');



  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    schema,

  //i can put the typedef and resolver here directly without the makeExecutableSchema
      // typeDefs
      // resolvers,

  //if the typedefis more than one
      // typeDefs: [typeDefs, postTypeDef, userTypeDefs],

  //dataSources can be used instead of context as it is a part of context

      // dataSources: () => ({
      //   ...Data,
      //   User,
      //   starwars: new StarwarsAPI()
      //   //   books,
      //   //  authors,
      // }),


    context: async ({ req }) => {
      let { isAuth, user } = req
      // console.log(user);
      return {
        isAuth,
        user,
        ...Data,
        User,
        starwars: new StarwarsAPI(),

      }
    },

    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  let corsOptions = {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true
  };



  // More required logic for integrating with Express
  await server.start();

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(express.static(path.join(__dirname, './Upload')))
  app.use(auth)

  // app.use(
  //   "/graphql",
  //   graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  //   graphqlHTTP({ schema })
  // )




  server.applyMiddleware({
    app,
    path: '/',
    cors: corsOptions
  });

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}



startApolloServer(typeDefs, resolvers)
