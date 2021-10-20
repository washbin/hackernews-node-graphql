import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils.js";

const post = async (_parent, args, context) => {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
};

const updateLink = async (_parent, args, context) =>
  context.prisma.link.update({
    where: {
      id: args.id,
    },
    data: {
      url: args.url,
      description: args.description,
    },
  });

const deleteLink = async (_parent, args, context) =>
  context.prisma.link.delete({
    where: {
      id: args.id,
    },
  });

const signup = async (_parent, args, context) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    APP_SECRET
  );

  return {
    token,
    user,
  };
};

const login = async (_parent, args, context) => {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    APP_SECRET
  );

  return {
    token,
    user,
  };
};

const vote = async (_parent, args, context) => {
  const userId = context.userId;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: {
        connect: { id: userId },
      },
      link: {
        connect: { id: Number(args.linkId) },
      },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
};

export default {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
  vote,
};
