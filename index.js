const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const api = require('./api')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {

    console.log('Usuário conectado');
    
    socket.on('votar', async ({ enqueteId, opcao }) => {
        const voto = await api.votar(enqueteId, opcao)
        io.emit('novoVoto', voto);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(8080, () => {
    console.log('Servidor está ouvindo na porta 8080');
});