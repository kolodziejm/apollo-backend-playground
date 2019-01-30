const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');

const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const resolvers = require('./resolvers/index');
const typeDefs = require('./schema');

const PORT = process.env.PORT || 4000;

const app = express(); // dodajemy ewentualne middleware do app, ktore nastepnie z nimi wszystkimi uzywamy w applyMiddleware

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // auth logic - dekodowanie jwt ustawionego w headerze, wyszukanie usera w bazie na podstawie zdekodowanych danych. Jesli jest - req.user = znaleziony user jesli nie - null
    return { User }
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