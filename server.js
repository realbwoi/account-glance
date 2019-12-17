const dotenv = require('dotenv');
const express = require('express');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const Keygrip = require('keygrip');
const initBank = require('./util/init-bank');
const app = express();

dotenv.config();

keys = new Keygrip(['1573800939616', '1573800970020', '1573801000021', '1573801029616', '1573801059615']);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy',true);
app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: keys,
  httpOnly: false,
  maxAge: 1000*60*10,
  sameSite: true,
  secure: false
}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods',
  'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});


// ROUTES
app.get('/', (req, res) => {
  res.send('Hello, it works!');
});

app.post('/login/:banking', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const banking = req.body.banking;

  initBank.isAuthorized(username, password, banking, res, req);
  console.log(req.session);
});

app.post('/logout', (req, res) => {
  req.session = null;
  console.log(req.session);
  res.send(`Logout successful`);
})

app.listen(8888, () => {
  console.log('Serving on localhost:8888');
});