const jwt = require('jsonwebtoken');
const { AuthenticationError, ApolloError } = require('apollo-server-express'); // authorization for protected resource

const createToken = require('../utils/createToken');

const resolvers = {
  Query: {
    // PROTECTED
    getUser: async (parent, { username }, { User, currentUser }) => {
      if (!currentUser) throw new AuthenticationError('You must be logged in to view that resource');
      const user = await User.findOne({ username });
      if (!user) throw new ApolloError('No user found');
      return user;
    },
    loginUser: async (parent, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) throw new AuthenticationError('No user found with that username');
      if (user.password !== password) throw new ForbiddenError('Invalid password');
      const token = createToken(user._id, username);
      return { token };
    }
  },
  Mutation: {
    // w server.js dekodujemy token, ale w loginUser ten token ustawiamy
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