const express = require('express');
const router = express.Router();

// /api/tickets

router.get('/', (request, response) => {
    response.render('requestService.ejs');
});

module.exports = router;