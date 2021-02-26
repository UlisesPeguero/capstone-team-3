const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const dotenv = require('dotenv');
const { auth } = require('express-openid-connect');

dotenv.config(); // load .env 

// include the database connection code db.js
require('./db');

// Starts Express server configuration
const PORT = process.env.PORT || process.env.HTTP_PORT;
const app = express();

//auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.BASE_URL || 'http://localhost:8080',
  clientID: 'jY6sbfv8Ruvhqcsh7dQ5cwoJ8BFCy3WA',
  issuerBaseURL: 'https://dev-qqu1ukry.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// express middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');


// public files
app.use('/public', express.static('public'));
// internal application files
app.use('/app', express.static('app'));

// API
// routes
const appRouter = require('./routes/app.routes');
const publicRouter = require('./routes/public.routes');
const ticketsRouter = require('./routes/tickets.routes');

app.use('/public', publicRouter);
app.use('/app', appRouter);
app.use('/api/tickets', ticketsRouter);

// health check
app.use('/api', (request, response) => {
    response.json({
        status: 'pass',
        version: process.env.APP_VERSION
    });
});

// localhost:8080/
app.get('/', (request, response) => {
    if (request.oidc.isAuthenticated()) {
        response.redirect('./app');
    } else {
        response.redirect('login');
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Base url: ${config.baseURL}`);
    console.log(`Server is listening on ${PORT}`);
});
