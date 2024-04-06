const app = express()
const morgan = require('morgan')
const cors= require('cors')
const express = require('express');
const passport = require('passport');

const session = require('express-session');

const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

// Configure Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());


// Include authentication routes
app.use('/', authRoutes);


app.use(express.json({}))
app.use(morgan('dev'))

app.use(cors())


module.exports = app