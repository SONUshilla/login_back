const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 5000;

// Hardcoded username and password
const USERNAME = 'user';
const PASSWORD = 'password';

// CORS configuration
app.use(cors({
  origin: 'https://login-front-ar4e.onrender.com',
  credentials: true,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key', // replace with your own secret key
  resave: true,
  saveUninitialized: true,
  cookie:{
   sameSite:"lax",
   secure:true,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  if (username === USERNAME && password === PASSWORD) {
    return done(null, { username: USERNAME });
  } else {
    return done(null, false, { message: 'Incorrect credentials.' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  if (username === USERNAME) {
    done(null, { username: USERNAME });
  } else {
    done(new Error('User not found'), null);
  }
});

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send({ message: 'Logged in successfully' });
});

app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ message: 'Session active' });
  } else {
    res.status(401).send({ message: 'No active session' });
  }
});

app.post('/logout', (req, res) => {
  req.logout();
  res.status(200).send({ message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
