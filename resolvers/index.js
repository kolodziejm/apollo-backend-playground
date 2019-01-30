const resolvers = {
  Query: {
    getUser: async (parent, { username }, { User }) => {
      const user = await User.findOne({ username });
      return user;
    }
  },
  Mutation: {
    registerUser: async (parent, { username, password, passwordConfirm }, { User }) => {
      if (await User.findOne({ username })) return false;
      if (password !== passwordConfirm) return false;
      const user = new User({
        username,
        password
      })
      await user.save();

      return true;
    },
  }
};

module.exports = resolvers;