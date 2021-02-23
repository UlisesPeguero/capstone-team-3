const express = require('express');
const router = express.Router();

const Ticket = require('../models/ticket.model')
// /public

router.get('/', (request, response) => {
    response.render('index.ejs',{ticket:false,error:false});
});

router.post('/request', (request, response) => {
    const data = request.body; // body is the data we sent from the request
    //new instance of model Student
    let ticket = new Ticket(data);
    ticket.number = Math.random().toString(16).slice(-4).toUpperCase();// create random hexadecimal uuid of 4 characters
    // insert document into the collection
    ticket.save()// attempts to save into the database
        .then((savedTicket) => { // successful saving
            // response.render("index.ejs",{
                // ticket:savedTicket, error:false
            // })
            response.redirect("/public/"+savedTicket._id)
        })
        .catch(error => { // there was an error and couldn't be save
            console.log(error); // log in the console
            response.status(500); // status = 500
            response.json({ // respond to the client with a failure message
                success: false, // this can be anything
                message: 'The ticket could not be created',
                error: error.message || 'An error has ocurred'
            });
        });
});

router.get('/:id', (request, response) => {
    const id = request.params.id; // get parameter id from request
    Ticket.findById( // search by id in model Student
        id, // id to search for
        (error, result) => { // callback with error or result
            if (error) { // there is an error
                response.status(400); // status = 400
                response.json({ // Display error message
                    success: false,
                    message: 'Data was not found.',
                    error: error.message || 'An error has ocurred'
                });
            } else {
                response.render("index.ejs",{
                    ticket: result, error:false
                }) // Display document found
            }
        }
    )
});
module.exports = router;
