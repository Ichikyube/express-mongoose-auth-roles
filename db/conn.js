const mongoose = require("mongoose");
const MONGODB_URI = process.env.DB_URI || 'mongodb://localhost:27017/basicauth';

//CONNECT TO MONGODB

const connectDb =  () => {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then((conn) => {
        console.log('DB Connection Successful');
    }).catch((err) => {
        console.log('error connecting to mongoose due: ' + err);
        process.exitCode = 1;
    });
    
    const database = mongoose.connection;
    database.on('error', err => {
        console.error('Error in MongoDB connection: ', err);
        database.close(() => {
            console.log('MongoDB connection closed due to an error.');
        });
        process.exitCode = 1;
    });

    database.once('connected', () => {
        console.log(
            "Database connected: ",
            database.host,
            database.name
        );
    });
    
    // When the connection is disconnected
    database.on('disconnected', function () {  
        console.log('Mongoose default connection disconnected'); 
    });
    
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {  
        database.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exitCode = 0; // Terminate the entire process
        }); 
    }); 
};

module.exports = connectDb;