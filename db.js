const mongoose = require('mongoose');

// MongoDB configuration and connection
mongoose.connect(process.env.EXTERNAL_DB_CONNECTION || process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const connection = mongoose.connection;

connection.on('error', error => console.log(`Mongo connection error: ${error}`));
connection.once('open', () => console.log('MongoDB database connection established successfully'));

