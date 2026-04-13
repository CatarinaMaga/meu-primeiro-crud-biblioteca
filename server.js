require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

// Rota para buscar os livros
app.get('/livros', (req, res) => {
    db.query('SELECT * FROM livros', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Rota para EXCLUIR um livro pelo ID
app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM livros WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Livro excluído com sucesso!');
    });
});

// Rota para ATUALIZAR um livro existente
app.put('/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor, ano } = req.body;
    const sql = 'UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?';
    
    db.query(sql, [titulo, autor, ano, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Livro atualizado com sucesso!');
    });
});

// Rota de Cadastrar (POST)
app.post('/livros', (req, res) => {
    // 1. ADICIONE ESTA LINHA AQUI:
    console.log("O que chegou no servidor:", req.body);

    const { titulo, autor, ano } = req.body;
    const sql = 'INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)';

    db.query(sql, [titulo, autor, ano], (err, result) => {
        if (err) {
            console.error("Erro ao salvar no banco:", err); // Log de erro no terminal
            return res.status(500).send(err);
        }
        res.status(201).send('Livro cadastrado!');
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});