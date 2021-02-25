const express = require('express');
const router = express.Router();

// /app
router.use(function (request, response, next) {
    if (request.oidc.isAuthenticated()) {
        next();
    } else {
        response.redirect('../login');        
    }
});

router.get('/', (request, response) => {
    response.render('app/dashboard.ejs', {user: request.oidc.user});    
});


module.exports = router;