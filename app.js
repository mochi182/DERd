const path = require('path');

// Env variables
const dotenv = require('dotenv');
dotenv_path = path.join(__dirname, 'env', '.env');
dotenv.config({path: dotenv_path});

// App
const express = require('express');  
app = express();

// JSON
app.use(express.json());

// Templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));

// Static files
app.use('/res', express.static(path.join(__dirname, 'public')));

// Set the base URL for all links and assets
app.locals.baseUrl = function(req, res) {
    return req.protocol + '://' + req.get('host') + '/';
  }
  
// Routes
const index = require('./app/routes/index.js');
index.routes(app)

// Server
var port = process.env.SERVER_PORT;
app.listen(port);
console.log('API server started on: ' + port);