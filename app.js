const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy
const initializePassport = require('./config/passport-config');
const authRoutes = require('./controllers/auth');
const morgan = require('morgan');
const ejs   = require('ejs');
const app = express();
const helmet = require('helmet');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/music-streaming-app', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});

//initialize passport
initializePassport();

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(session({
  secret: 'GAoUWU5IYhx5urn2VoaC',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
