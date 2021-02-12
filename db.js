const mongoose = require('mongoose');

// MongoDB configuration and connection
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.on('error', error => console.log(`Mongo connection error: ${error}`));
connection.once('open', () => console.log('MongoDB database connection established successfully'));

