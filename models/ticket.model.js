const mongoose = require('mongoose');
const schema = mongoose.Schema;

let Ticket = new mongoose.Schema({
    description: {
        type: String
    }
});

module.exports = mongoose.model(
    'Ticket',   // identifier
    Ticket,     // schema
    'Tickets'   // collection's name
);