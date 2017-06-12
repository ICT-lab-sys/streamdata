var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({origin: 'http://localhost:4200'}));

//bestanden van verschillende sensors
app.use(require('./controllers/temp'));
app.use(require('./controllers/humidity'));
app.use(require('./controllers/light'));

//luister naar deze poort
app.listen('3001', function () {
    console.log('listening on port 3001');
});