import fs from "fs";
import { createServer } from "http";

import express from "express";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import Link from "./resolvers/Link.js";
import Mutation from "./resolvers/Mutation.js";
import Subscription from "./resolvers/Subscription.js";
import Query from "./resolvers/Query.js";
import User from "./resolvers/User.js";
import Vote from "./resolvers/Vote.js";
import { getUserId } from "./utils.js";

(async () => {
  const app = express();
  const httpServer = createServer(app);

  const pubsub = new PubSub();
  const prisma = new PrismaClient();

  const typeDefs = fs.readFileSync("src/schema.graphql", "utf-8");
  const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log("Connected", Date());
        return { prisma, pubsub };
      },
      onDisconnect: () => console.log("Disconnected"),
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
