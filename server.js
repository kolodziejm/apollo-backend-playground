const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const { ApolloServer } = require('apollo-server-express');

const resolvers = require('./resolvers/index');
const typeDefs = require('./schema');
const User = require('./models/User');
const Item = require('./models/Item');

const PORT = process.env.PORT || 4000;

const app = express(); // dodajemy ewentualne middleware do app, ktore nastepnie z nimi wszystkimi uzywamy w applyMiddleware

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let currentUser = null;
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const token = bearerToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET);
      currentUser = await User.findOne({ _id: decoded.id });
    }

    return { User, Item, currentUser }
  }
})
server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`DB connected and app listening on port ${PORT}`)
    })
    .catch(err => console.log(err))
});
// graphql na tym samym adresie - localhost:4000