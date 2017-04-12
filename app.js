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

var minTemp = 12;
var maxTemp = 30;
var minHumidity = 40;
var maxHumidity = 60;
var temp;
var humidity;
var currentTime;
var moment;

var randomData = setInterval(createData, 3000);

function createData(){
    temp = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp
    humidity = Math.floor(Math.random() * (maxHumidity - minHumidity + 1)) + minHumidity;
    currentTime = new Date()
}

function createdDataTemp() {
    return '{"DateTime":'+'"'+currentTime+'"'+', "Temperature":'+temp+'}'
}

function createdDataHumidity() {
    return '{"DateTime":'+'"'+currentTime+'"'+', "Humidity":'+humidity+'}'
}

function random() {
    console.log(createdDataTemp())
    return createdDataTemp()
}

function humidityFunc(){
   console.log(createdDataHumidity())
   return createdDataHumidity()
   // return "Jasmeet"
}



router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})


router.get('/temp', function (req, res) {
    res.send(random())
});

router.get('/humidity', function (req, res) {
    res.send(humidityFunc());
});


app.use('/api/streamdata', router);


app.listen(port, function () {
    console.log('Example app listening on port '+port+'!')
})

