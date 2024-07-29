// violationsServer.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Configurações do servidor
const app = express();
const port = 3001; // Alterado para evitar conflito com outro servidor

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ireland2024', // Substitua por sua senha do MySQL
  database: 'Report_violations',
});

// Conexão com o MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota para receber os dados do formulário
app.post('/submit-report', (req, res) => {
  const { name, email, incident_date, location, violation_type, description } = req.body;

  const query = 'INSERT INTO reports (name, email, incident_date, location, violation_type, description) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, email, incident_date, location, violation_type, description];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir os dados:', err);
      res.status(500).send('Erro ao inserir os dados');
      return;
    }
    res.status(200).send('Relatório enviado com sucesso');
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor de relatórios rodando em http://localhost:${port}`);
});
