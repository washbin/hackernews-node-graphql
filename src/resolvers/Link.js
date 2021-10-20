const postedBy = (parent, _args, context) =>
  context.prisma.link
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .postedBy();

const votes = (parent, _args, context) =>
  context.prisma.link
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .votes();

export default {
  postedBy,
  votes,
};
