const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/mensagens', (req, res) => {
    fs.readFile('mensagens.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler mensagens');
        const mensagens = data.trim().split('\n').filter(Boolean).map(m => JSON.parse(m));
        res.json(mensagens);
    });
});

app.post('/mensagens', (req, res) => {
    const mensagem = req.body;
    fs.appendFile('mensagens.txt', JSON.stringify(mensagem) + '\n', err => {
        if (err) return res.status(500).send('Erro ao salvar mensagem');
        res.status(200).send('Mensagem salva');
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
