const typeDefs = `
  type User {
    username: String
    password: String
  }

  type Token {
    token: String!
  }

  type Item {
    _id: ID
    name: String
  }

  type Query {
    loginUser(username: String!, password: String!): Token
    getUser(username: String!): User
    getItems: [Item]
  }

  type Mutation {
    registerUser(username: String!, password: String!, passwordConfirm: String!): Boolean!
    createItem(name: String!): Item
    deleteItem(_id: ID!): Item
  }
`;

module.exports = typeDefs;