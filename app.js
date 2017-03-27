/**
 * Created by Singh on 20-3-2017.
 */
/**
 * Created by Soukwinder on 17-2-2017.
 */
var express = require('express')

var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var port = process.env.PORT || 3001;
var router = express.Router();

var min = 12;
var max = 30;
var temp;
var currentTime;
var moment;

var randomData = setInterval(createData, 3000);

function createData(){
    temp = Math.floor(Math.random() * (max - min + 1)) + min;
    currentTime = new Date()

}

function createdData() {
    return '{"DateTime":'+'"'+currentTime+'"'+', "Temperature":'+temp+'}'
}

function random() {
    console.log(createdData())
    return createdData()
}


router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})


router.get('/temp', function (req, res) {
    res.send(random())
});


app.use('/api/streamdata', router);


app.listen(port, function () {
    console.log('Example app listening on port '+port+'!')
})

