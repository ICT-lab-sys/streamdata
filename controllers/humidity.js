var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');
const http = require('http')
var includes = require('array-includes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var router = express.Router();
var id;
var minHumidity = 40;
var maxHumidity = 60;
var humidity;
var currentTime;
var moment;
var activeHumidNodes = 1;
var humidID = 2;
var arr = [];
var arrTempID = [];
var activeNodes = ["1"];
var randomHumidData = setInterval(function() { createData();}, 3000);

router.use('/api/streamdata', router);

//maar random data
function createData(){
    humidity = Math.floor(Math.random() * (maxHumidity - minHumidity + 1)) + minHumidity;
    currentTime = new Date()
}

//return de gemaakte data
function createdDataHumidity() {
    return '{"DateTime":'+'"'+currentTime+'"'+', "Humidity":'+humidity+'}'
}

router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})

//return data met de bijhorende id of geef melding als deze niet bestaat of is gestopt.
router.get('/humidity/'+1, function (req, res) {
    res.send(createdDataHumidity());
});

router.get('/humidity/:id', function (req, res) {
    var id = req.params.id
    if(includes(arrTempID, id)){
        if(includes(arr, id)){
            res.send('sensor gestopt')
        } else{
            createData()
            res.send(createdDataHumidity())
        }
    } else {
        res.send("No sensor found")
    }
});

//alle inactieve sensors
router.get('/humidity/sensor/inactive', function (req, res) {
    res.send(arr)
})

//alle actieve sensors
router.get('/humidity/sensor/active', function (req, res) {
    res.send(activeNodes)
})

//herstart de senor en werk de arrays bij
router.get('/humidity/restart/:id', function (req, res) {
    var id = req.params.id
    var i = arr.indexOf(id);
    if(i > -1) {
        arr.splice(i,1);
    }
    activeNodes.push(id)
    arrTempID.push(id)
    res.send('gelukt')
});

//maak een nieuwe sensor aan
router.get('/update/humidity', function (req, res) {
    activeHumidNodes++;
    console.log(activeHumidNodes)
    makeNewNode()
    res.send(req.params.type)
});

//laat alle actieve nodes zien
router.get('/activenodes/humidity', function (req, res) {
    res.send(JSON.stringify({humidity : activeHumidNodes}))
});

//stop de sensor en werk de array bij
router.get('/humidity/stop/:id', function (req, res) {
    var id = req.params.id
    arr.push(id);
    var i = activeNodes.indexOf(id);
    if(i > -1) {
        activeNodes.splice(i,1);
    }
    res.send('gelukt')
})

//laat de totale sensors zien (actief en inactiev)
router.get('/humidity/sensors/totaal', function (req, res) {
    var totaal = activeNodes.concat(arr)
    res.send(totaal)
})

//verwijder de sensor
router.get('/humidity/remove/:id', function (req,res) {
    var id = req.params.id
    removeNode(id)
    res.send('gelukt')
})

//functie om de sensor te verwijden en de array bijwerken
function removeNode(id){
    var i = arrTempID.indexOf(id);
    var i1 = arr.indexOf(id);
    var i2 = activeNodes.indexOf(id);
    if(i > -1) {
        arrTempID.splice(i,1);
    }
    if(i1 > -1) {
        arr.splice(i1,1);
    }
    if(i2 > -1) {
        activeNodes.splice(i2,1);
    }
}

function makeNewNode() {
    makeResUrls(true)
}

function makeResUrls(boolean) {
    if(boolean == true){
        router.get('/humidity/' + humidID, function (req, res) {
            res.send(createdDataHumidity())
        });
        arrTempID.push(humidID.toString())
        activeNodes.push(humidID.toString())
        humidID++;
    }
}

module.exports = router;