const express = require('express');
const router = express.Router();
let Ticket = require('../models/ticket.model');

// /api/tickets

router.get('/', (request, response) => {
    Ticket.find((error /* error message if there was an error*/
        , result /* result from search */) => {
        if (error) { // if error is not empty send error message
            response.status(400).json({
                success: false,
                message: 'Data was not found',
                error: error.message || 'An error has ocurred'
            });
        } else { // if there was no error return result
            response.json({
                success: true,
                tickets: result
            });
        }
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
                response.json({
                    success: true,
                    ticket: result
                }); // Display document found
            }
        }
    )
});

router.post('/', (request, response) => {
    const data = request.body; // body is the data we sent from the request
    //new instance of model Student
    let ticket = new Ticket(data);
    ticket.number = Math.random().toString(16).slice(-4).toUpperCase();// create random hexadecimal uuid of 4 characters
    // insert document into the collection
    ticket.save()// attempts to save into the database
        .then((savedTicket) => { // successful saving
            response.json({ // respond to the client with a success message and the new ticket
                success: true,
                ticket: savedTicket
            });
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

router.put('/:id', (request, response) => {
    const id = request.params.id; // get parameter id from request
    const data = request.body; // body is the data we sent from the request
    // attempt to search ticket by id and update with the new data
    Ticket.findByIdAndUpdate(id, data, { new: true }) // {new: true} tells mongoose to return the new modified ticket
        .then((updatedTicket) => {
            if (!updatedTicket) { // if the updatedTicket doesn't has data, the ticket couldn't be found
                response.status(400); // status = 400
                response.json({ // respond to client with an error message
                    message: 'Data was not found.',
                    success: false,
                });
            } else { // if updatedTicket has data, means that the ticket was found and updated
                response.json({ // respond to client with a success message and the updatedTicket
                    success: true,
                    ticket: updatedTicket
                });
            }
        })
        .catch(error => { // there was an error while trying to search and update the ticket
            console.log(error); // log in the console
            response.status(500); // status = 500
            response.json({ // respond to the client with a failure message
                success: false,
                message: "Could not update user ",
                error: error.message || 'An error has ocurred'
            });
        });
});

router.delete('/:id', (request, response) => {
    const id = request.params.id; // get parameter id from request
    // attempt to search ticket by id and delete it
    Ticket.findByIdAndRemove(id)
        .then((deletedTicket) => {
            if (!deletedTicket) { // if the deletedTicket doesn't has data, the ticket couldn't be found
                response.status(400); // status = 400
                response.json({ // respond to client with an error message
                    message: 'Data was not found.',
                    success: false,
                });
            } else {// if updatedTicket has data, means that the ticket was found and updated
                response.json({ // respond to client with a success message 
                    success: true
                });
            }
        })
        .catch(error => { // there was an error while trying to search and delete the ticket
            console.log(error); // log in the console
            response.status(500); // status = 500
            response.json({ // respond to the client with a failure message
                success: false,
                message: "Could not delete user ",
                error: error.message || 'An error has ocurred'
            });
        });
});

module.exports = router;