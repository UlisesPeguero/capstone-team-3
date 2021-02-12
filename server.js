const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // load .env 

// include the database connection code db.js
require('./db');

// Starts Express server configuration
const PORT = process.env.HTTP_PORT;
const app = express();

// express middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// public files
app.use('/public', express.static('public'));
// internal application files
app.use('/app', express.static('app'));

// API
// routes
const ticketsRouter = require('./routes/tickets.routes');

app.use('/api/tickets', ticketsRouter);
// add more routers here

// health check
app.use('/api', (request, response) => {
    response.json({
        status: 'pass',
        version: process.env.APP_VERSION
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});