var express = require('express');
var app = express();


app.use(require('./controllers/temp'));
app.use(require('./controllers/humidity'));
app.use(require('./controllers/light'));

app.listen('3001', function () {
    console.log('listening on port 3001');
});