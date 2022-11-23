import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsConfig = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
const PORT = 5000;

const posts = [
  {
    username: 'Rafał',
    title: 'Title 1',
  },
  {
    username: 'Mateusz',
    title: 'Title 2',
  },
];

app.get('/posts', authorization, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

const ACCESS_TOKEN_SECRET = '' + process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = '' + process.env.REFRESH_TOKEN_SECRET;
const tokens = [];

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const token = generateAccessToken(user);
  tokens.push(token);
  return res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .setHeader('X-Powered-By', 'sefirek')
    .json({ message: 'Logged in successfully 😊 👌' });
});

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!tokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.post('/logout', authorization, (req, res) => {
  return res
    .clearCookie('token')
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' });
});

app.listen(PORT);

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
}

function authorization(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = data.user;
    return next();
  } catch {
    return res.sendStatus(403);
  }
}
