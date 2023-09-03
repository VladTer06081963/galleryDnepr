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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({ storage: multer.memoryStorage() });

//----------

app.get('/', (req, res) => {
  const isLoggedIn = !!req.session.userId;
  const headings = [
    'Моё любимое увлечение — курить. Постоянное хобби — пытаться бросить курить',
    'Что еще сделать, когда тебе скучно?',
    'Хорошо, когда есть сигареты.',
    'Сигара — это небольшой праздник в середине каждого дня.',
    'Сигареты не сбивают с толку. Они молчаливые друзья.',
    'Жизнь – это дым сигареты',
    'Папиросы — это способ погрузиться в свой мир.',
    'Друзья и сигары - это две вещи, которые делают нашу жизнь более приятной и особенной.',
    'Cемья - это как хорошая сигара: они принесут радость и удовольствие в твою жизнь.',
    'Курение папиросы — это отличный способ начать разговор.',
    'Курение - это путь к созерцательности и глубокому мышлению.',
    'Курение трубки - это мой способ расслабиться.',
  ];

  const paragraphs = [
    'Счастье? Это роскошный ужин, сигара и любимая девушка — или нелюбимая, в зависимости от того, каким количеством счастья вы можете в этот момент распорядиться.',
    'Счастье? Это роскошный ужин, сигара и любимая девушка-или нелюбимая.',
    'Я не обожаю курить трубку, но это забавный способ убить время.',
    'Жизнь - это дым сигареты, который исчезает, не оставляя следа. Но мы можем создать пламя, которое осветит наш путь.',
    'Парни не плачут, они выходят на лестницу покурить.',
    'Как дым сигареты, жизнь может исчезнуть в любой момент.',
    'Папироса — это единственная форма персональной свободы, которую я оставил себе.',
    'Самое прекрасное в дружбе - это то, что ты можешь делить сигары и разговоры с теми, кто понимает и ценит тебя.',
    'Каким количеством счастья вы можете в этот момент распорядиться.',
    'Я считаю папиросы лучшим способом дать выход своим мыслям, а после курения — начать что-то делать.',
    'Когда я думаю о своих друзьях, я представляю себе круглый стол, на котором стоят бокалы с виски и дымятся сигары.',
    'Трубка - это не только курительный инструмент, но и символ мудрости и размышлений. Она помогает мне отыскать внутренний покой.',
  ];

  res.render('index', { headings, paragraphs, title: 'Tobaco', isLoggedIn });
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
    res.status(401).send('Invalid credentials. Please try again.');
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

app.use(router);

app.listen(port, () => {
  console.log(`Сервер работает на:${port}`);
});
