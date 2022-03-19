require('dotenv').config()
require("./mongo")
const express = require('express')
const path = require('path')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { graphqlUploadExpress } = require('graphql-upload');

// const { WebSocketServer } = require('ws');
// const { useServer } = require('graphql-ws/lib/use/ws')
// const { PubSub } = require('graphql-subscriptions');



const http = require('http');
const { typeDefs } = require('./resolvers/typeDefs')
const resolvers = require('./resolvers/resolvers');
// const {books, authors} = require('./resolvers/db');
const Data = require('./resolvers/db');
const User = require("./Models/userSchema")
const Post = require("./Models/postSchema")
const StarwarsAPI = require('./Data/DataApi')
const postTypeDef = require('./resolvers/PostTypedefs')
const userTypeDefs = require('./resolvers/userTypeDefs')
const auth = require('./utils/auth')
const { makeExecutableSchema } = require('@graphql-tools/schema');
const authDirectiveTransformer = require('./directives/authDirective')
const { authorizationDirectiveTransformer } = require('./directives/authorizationDirective')


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


  //authorization role schema
  schema = authorizationDirectiveTransformer(schema)


  //Subscription
  // Creating the WebSocket server
  // const wsServer = new WebSocketServer({
  //   // This is the `httpServer` we created in a previous step.
  //   server: httpServer,
  //   // Pass a different path here if your ApolloServer serves at
  //   // a different path.
  //   path: '/graphql',
  // });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  // const serverCleanup = useServer({ schema }, wsServer);
  // const pubsub = new PubSub();



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
        req,
        isAuth,
        user,
        ...Data,
        User,
        Post,
        // pubsub,
        starwars: new StarwarsAPI(),

      }
    },

    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
   
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    //   {
    //     async serverWillStart() {
    //       return {
    //         async drainServer() {
    //           await serverCleanup.dispose();
    //         },
    //       };
    //     },
    //   },
    // ],
    
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


  // httpServer.listen(process.env.PORT, () => {
  //   console.log(
  //     `Server is now running on http://localhost:${process.env.PORT}${server.graphqlPath}`,
  //   );
  // });
}



startApolloServer(typeDefs, resolvers)
