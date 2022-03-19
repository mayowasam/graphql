// const { PubSub } = require('graphql-subscriptions');
  // const pubsub = new PubSub();

const Subscription = {
    postCreated: {
        // More on pubsub below
        subscribe: (_,__,{pubsub}) => pubsub.asyncIterator(['POST_CREATED']),
      },
}

module.exports = Subscription

