const typeDefs = `
  type User {
    username: String
    password: String
  }

  type Token {
    token: String!
  }

  type Query {
    loginUser(username: String!, password: String!): Token
    getUser(username: String!): User
  }

  type Mutation {
    registerUser(username: String!, password: String!, passwordConfirm: String!): Boolean!
  }
`;

module.exports = typeDefs;