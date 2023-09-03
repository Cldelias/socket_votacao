const {PubSub} = require("graphql-subscriptions")

const pubsub = new PubSub();

const enquetes = [];

const resolvers = {
  Query: {
    enquetes: () => enquetes,
  },
  Mutation: {
    criarEnquete: (_, { titulo }) => {
      const novaEnquete = { id: String(enquetes.length + 1), titulo, opcoes: [] };

       // Emitir evento de enquete criada
      pubsub.publish('enqueteCriada', { novaEnquete });
      
      enquetes.push(novaEnquete);

      return novaEnquete;
    },
    votar: (_, { enqueteId, opcao }) => {
      const enquete = enquetes.find((e) => e.id === enqueteId);

      if (!enquete) {
        throw new Error('Enquete não encontrada.');
      }

      const opcaoExistente = enquete.opcoes.find((o) => o.nome === opcao);

      if (!opcaoExistente) {
        throw new Error('Opção de enquete não encontrada.');
      }

      opcaoExistente.votos++;

      // Emitir evento de voto registrado
      pubsub.publish('votoRegistrado', { enquete });

      return enquete;
    },
  },
};

module.exports = resolvers;