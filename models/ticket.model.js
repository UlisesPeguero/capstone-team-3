const mongoose = require('mongoose');
const schema = mongoose.Schema;

let Ticket = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    requestor: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    phone: String,
    details: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address2: String,
    priority: {
        type: String,
        required: true,
        default: 'Low'        
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'        
    }
}, {
    timestamps: true
});


module.exports = mongoose.model(
    'Ticket',   // identifier
    Ticket,     // schema
    'Tickets'   // collection's name
);