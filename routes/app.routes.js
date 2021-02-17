const express = require('express');
const router = express.Router();

// /app
const url = 'https://capstone-team-3.herokuapp.com/api/tickets';

router.get('/', (request, response) => {
    response.render('app/dashboard.ejs', { apiUrl: url});
});

router.get('/login', (request, response) => {
    response.render('app/login.ejs');
});

module.exports = router;