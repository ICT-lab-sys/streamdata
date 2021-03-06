var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');
const http = require('http')
var includes = require('array-includes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var router = express.Router();
var minTemp = 10;
var id;
var maxTemp = 30;
var temp;
var currentTime;
var moment;
var activeTempNodes = 1;
var tempID = 2;
var arr = [];
var arrTempID = [];
var activeNodes = ["1"];
var randomTempData = setInterval(function() { createData();}, 3000);

router.use('/api/streamdata', router);

//maar random data
function createData(){
    temp = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp
    currentTime = new Date()
}

//return de gemaakte data
function createdDataTemp() {
    return '{"DateTime":' + '"' + currentTime + '"' + ', "Temperature":' + temp + '}'
}

router.get('/', function (req, res) {
    res.send("")
})

//return data met de bijhorende id of geef melding als deze niet bestaat of is gestopt.
router.get('/temp/'+1, function (req, res) {
    res.send(createdDataTemp())
});
router.get('/temp/:id', function (req, res) {
    var id = req.params.id
    if(includes(arrTempID, id)){
        if(includes(arr, id)){
            res.send('sensor gestopt')
        } else{
            createData()
            res.send(createdDataTemp())
        }
    } else {
        res.send("No sensor found")
    }
});

//alle inactieve sensors
router.get('/temp/sensor/inactive', function (req, res) {
    res.send(arr)
})

//alle actieve sensors
router.get('/temp/sensor/active', function (req, res) {
    res.send(activeNodes)
})

//herstart de senor en werk de arrays bij
router.get('/temp/restart/:id', function (req, res) {
    var id = req.params.id
    var i = arr.indexOf(id);
    if(i > -1) {
        arr.splice(i,1);
    }
    arrTempID.push(id)
    activeNodes.push(id)
    res.send('gelukt')
});

//maak een nieuwe sensor aan
router.get('/update/temp', function (req, res) {
    activeTempNodes++;
    console.log(activeTempNodes)
    makeNewNode()
    res.send(req.params.type)
});

//laat alle actieve nodes zien
router.get('/activenodes/temp', function (req, res) {
    res.send(JSON.stringify({temp : activeTempNodes}))
});

//stop de sensor en werk de array bij
router.get('/temp/stop/:id', function (req, res) {
    var id = req.params.id
    arr.push(id);
    var i = activeNodes.indexOf(id);
    if(i > -1) {
        activeNodes.splice(i,1);
    }
    res.send('gelukt')
})

//laat de totale sensors zien (actief en inactiev)
router.get('/temp/sensors/totaal', function (req, res) {
    var totaal = activeNodes.concat(arr)
    res.send(totaal)
})

//verwijder de sensor
router.get('/temp/remove/:id', function (req,res) {
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

//functie om de
function makeNewNode() {
    makeResUrls(true)
}

function makeResUrls(boolean) {
    if(boolean == true){
        router.get('/temp/' + tempID, function (req, res) {
            res.send(createdDataTemp())
        });
        arrTempID.push(tempID.toString())
        activeNodes.push(tempID.toString())
        tempID++;
    }
}

module.exports = router;