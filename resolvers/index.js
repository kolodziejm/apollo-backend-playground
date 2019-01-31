const jwt = require('jsonwebtoken');
const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express'); // authorization for protected resource
// mozemy tutaj takze pobrac validator i szczegolowo sprawdzac przekazany input usera. Jesli sie nie zgadza - zwracamy error apollowy - userinputerror

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
      if (user.password !== password) throw new AuthenticationError('Invalid password');
      const token = createToken(user._id, username);
      return { token };
    },
    // **********************************************************************************************************
    getItems: async (parent, args, { Item }) => {
      const items = await Item.find();
      return items;
    }
  },
  Mutation: {
    // w server.js dekodujemy token, ale w loginUser ten token ustawiamy
    registerUser: async (parent, { username, password, passwordConfirm }, { User }) => {
      if (password !== passwordConfirm) throw new UserInputError('Passwords don\'t match');
      if (await User.findOne({ username })) throw new AuthenticationError('User already exists');
      const user = new User({
        username,
        password
      })
      await user.save();

      return true;
    },
    // **********************************************************************************************************
    createItem: async (parent, { name }, { Item }) => {
      const item = new Item({ name });
      await item.save();
      return item;
    },
    deleteItem: async (parent, { _id }, { Item }) => {
      const item = Item.findOne({ _id });
      await item.remove();
      return item;
    }
  }
};

module.exports = resolvers;