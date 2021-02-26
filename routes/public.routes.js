const express = require('express');
const dateFormat = require('dateformat');
const router = express.Router();

const Ticket = require('../models/ticket.model')
// /public

router.get('/', (request, response) => {
    // if number exists this is a retrieve request
    if (request.query.number) {
        Ticket.find({ 
                number: request.query.number.toUpperCase(), // search for number
                email: request.query.email //search for email
            },
            (error, result) => { // callback with error or result
                if (error) { // there is an error
                    console.log(error);
                    response.render('index.ejs', { 
                        query: request.query,
                        error: 'Data was not found.',
                        ticket: false,
                        post: false
                    });
                } else {
                    if (result.length > 0) {
                        let ticket = result[0].toJSON();
                        ticket.updatedAt = dateFormat(ticket.updatedAt, 'mmm dS, yyyy, h:MM TT');
                        response.render('index.ejs', {
                            ticket: ticket,
                            query: request.query,
                            error: false,
                            post: false
                        }); // Display document found
                    } else {
                        response.render('index.ejs', {
                            error: 'Data was not found.',
                            query: request.query,
                            ticket: false,
                            post: false
                        });
                    }
                }
            }
        )
    } else {
        // send regular option page
        response.render('index.ejs', { ticket: false, error: false, query: false });
    }
});

router.post('/', (request, response) => {
    const data = request.body; // body is the data we sent from the request
    //new instance of model Student
    let ticket = new Ticket(data);
    // create random hexadecimal uuid of 4 characters
    ticket.number = Math.random().toString(16).slice(-4).toUpperCase();
    // insert document into the collection
    ticket.save()// attempts to save into the database
        .then((savedTicket) => { // successful saving
            response.render("index.ejs", {
                ticket: savedTicket,
                error: false,
                query: false,
                post: true
            });
            //response.redirect("./"+savedTicket._id)
        })
        .catch(error => { // there was an error and couldn't be save
            console.log(error); // log in the console
            response.status(500); // status = 500
            response.json({ // respond to the client with a failure message
                success: false, // this can be anything
                message: 'The ticket could not be created',
                error: error.message || 'An error has ocurred',
                post: false
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
                    ticket: result,
                    error: false,
                    query: false,
                    post: false
                }) // Display document found
            }
        }
    )
});
module.exports = router;
