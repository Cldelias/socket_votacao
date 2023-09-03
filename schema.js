const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    enquetes: [Enquete]
  }

  type Mutation {
    criarEnquete(titulo: String!): Enquete
    votar(enqueteId: ID!, opcao: String!): Enquete
  }

  type Enquete {
    id: ID!
    titulo: String!
    opcoes: [OpcaoEnquete]
  }

  type OpcaoEnquete {
    nome: String!
    votos: Int!
  }
`;

module.exports = typeDefs;