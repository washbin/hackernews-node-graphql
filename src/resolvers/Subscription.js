const newLinkSubscribe = (_parent, _args, context) =>
  context.pubsub.asyncIterator("NEW_LINK");

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

const newVoteSubscribe = (_parent, _args, context) =>
  context.pubsub.asyncIterator("NEW_VOTE");

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => payload,
};

export default {
  newLink,
  newVote,
};
