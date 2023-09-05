//------------------------------------------------------------------------

require('dotenv').config();

const express = require('express');
const router = require('./routes');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const basicAuth = require('basic-auth');

const app = express();
const port = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Функция для сохранения данных
const saveData = (data) => {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync('data.json', jsonData);
};
// Функция для загрузки данных
const loadData = () => {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading the file:', err);
    return {
      h2: [],
      p: [],
    };
  }
};
// Загружаем данные из файла или используем начальные значения
const { h2, p } = loadData();

app.use(
  session({
    secret: 'aRandomSecretKey',
    resave: false,
    saveUninitialized: true,
  })
);

const authMiddleware = (req, res, next) => {
  const credentials = basicAuth(req);

  if (
    credentials &&
    credentials.name === ADMIN_USERNAME &&
    credentials.pass === ADMIN_PASSWORD
  ) {
    req.session.userId = `users/${credentials.name}`;
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Enter admin credentials"');
    res.status(401).send('Authentication required');
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); //для анализа application/json
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({ storage: multer.memoryStorage() });

//----------

app.get('/', (req, res) => {
  const isLoggedIn = !!req.session.userId;

  res.render('index', { h2, p, title: 'Tobaco', isLoggedIn });
});

app.get('/admin-login', (req, res) => {
  res.render('admin-login');
});

app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.userId = `users/${username}`;
    res.redirect('/');
  } else {
    // res.status(401).send('Invalid credentials. Please try again.');
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/uploadfulls', authMiddleware, upload.single('image'), (req, res) => {
  const userId = req.session.userId;
  const number = String(req.body.number).padStart(2, '0');
  const filePath = `./public/images/fulls/${number}${path.extname(
    req.file.originalname
  )}`;
  fs.writeFileSync(filePath, req.file.buffer);
  res.redirect('/');
});

app.post(
  '/uploadthumbs',
  authMiddleware,
  upload.single('image'),
  (req, res) => {
    const userId = req.session.userId;
    const number = String(req.body.number).padStart(2, '0');
    const filePath = `./public/images/thumbs/${number}${path.extname(
      req.file.originalname
    )}`;
    fs.writeFileSync(filePath, req.file.buffer);
    res.redirect('/');
  }
);
app.post('/update', (req, res) => {
  const { articleIndex, elementType, newText } = req.body;

  // Обновляем нужный элемент по индексу и типу
  if (elementType === 'h2') {
    h2[articleIndex] = newText;
  } else if (elementType === 'p') {
    p[articleIndex] = newText;
  }
  saveData({ h2, p });

  res.json({ success: true });
});

app.get('/currentText', (req, res) => {
  const { articleIndex, elementType } = req.query;
  const data = loadData();
  const index = Number(articleIndex);

  if (
    data &&
    data[elementType] &&
    typeof data[elementType][index] !== 'undefined'
  ) {
    res.setHeader('Content-Type', 'application/json', { encoding: 'utf8' });
    res.json({ currentText: data[elementType][index] });
  } else {
    res.status(404).json({ error: 'Text not found' });
  }
});

app.use(router);

app.listen(port, () => {
  console.log(`Сервер работает на:${port}`);
});
