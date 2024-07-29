const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Caminho absoluto para o diretório de uploads
const basePath = '/Users/jeanlima/Desktop/TRANS CREATIONS/client/HTML-CSS/pages';
const uploadsDir = path.join(basePath, 'uploads');

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ireland2024', // substitua pela sua senha
  database: 'photo_gallery'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conected to MySQL!');
});

// Configuração do Multer para uploads de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.static(basePath));
app.use('/uploads', express.static(uploadsDir));

// Rota para exibir a galeria
app.get('/gallery', (req, res) => {
  db.query('SELECT * FROM photos ORDER BY uploaded_at DESC', (err, results) => {
    if (err) throw err;
    res.send(`
      <html>
        <head>
          <title>Photo Gallery</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        </head>
        <body>
          <div class="container">
            <h1 class="mt-5">Photo Gallery</h1>
            <div class="row">
              ${results.map(photo => `
                <div class="col-md-4 mb-4">
                  <img src="/uploads/${photo.filename}" class="img-fluid" alt="${photo.filename}">
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `);
  });
});

// Rota para upload de fotos
app.post('/upload', upload.single('photo'), (req, res) => {
  const { filename } = req.file;
  db.query('INSERT INTO photos (filename) VALUES (?)', [filename], (err) => {
    if (err) throw err;
    res.redirect('/gallery');
  });
});

app.listen(port, () => {
  console.log(`Server running port: ${port}`);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
});
