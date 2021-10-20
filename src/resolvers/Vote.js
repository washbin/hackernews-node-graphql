const link = (parent, _args, context) =>
  context.prisma.vote
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .link();

const user = (parent, _args, context) =>
  context.prisma.vote
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .user();

export default {
  link,
  user,
};
