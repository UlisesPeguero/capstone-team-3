const express = require('express');
const router = express.Router();

// /public

router.get('/', (request, response) => {
    response.render('requestService.ejs');
});

module.exports = router;