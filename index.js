const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const socketIo = require('socket.io');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const {PubSub} = require("graphql-subscriptions")

const app = express();
const httpServer = http.createServer(app);
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    pubsub,
  },
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


server.start().then(() => {
    server.applyMiddleware({
      app,
      cors: true,
    });
});

const io = socketIo(httpServer);

io.on('connection', (socket) => {
  console.log('Novo cliente conectado.');

  const subscriptionEnquete = pubsub.asyncIterator('enqueteCriada');

  (async () => {
    for await (const enquete of subscriptionEnquete) {
        console.log('enqueteCriada')
        socket.emit('enqueteCriada', enquete);
    }
  })();
 
  const subscriptionVoto = pubsub.asyncIterator('votoRegistrado');

  (async () => {
    for await (const voto of subscriptionVoto) {
      console.log('votoRegistrado')
      socket.emit('votoRegistrado', voto);
    }
  })();
 
  socket.on('disconnect', () => {
    console.log('Cliente desconectado.');
  });
  
 
});

httpServer.listen(4000, () => {
  console.log(`Servidor Apollo e Socket.IO rodando em http://localhost:4000${server.graphqlPath}`);
});