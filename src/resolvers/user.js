export default {
  Query: {
    users: (parent, args, { models }) => models.User.findAll(),

    user: (parent, { id }, { models }) => models.User.findById(id),
  },

  Mutation: {},
};
