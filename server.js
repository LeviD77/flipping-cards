const express = require('express');
const bodyParser = require('body-parser');

// Create express app
const app = express();

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
		.then(() => {
		    console.log("Successfully connected to the database");    
		}).catch(err => {
		    console.log('Could not connect to the database. Exiting now...');
		    process.exit();
		});

// Require routes
require('./app/routes/game.routes.js')(app);

// Listen for requests
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});