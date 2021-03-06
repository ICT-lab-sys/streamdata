var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');
const http = require('http')
var includes = require('array-includes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var router = express.Router();
var minLight = 120;
var id;
var maxLight = 150;
var light;
var currentTime;
var moment;
var activeLightNodes = 1;
var lightID = 2;
var arr = [];
var arrTempID = [];
var activeNodes = ["1"];
var randomLightData = setInterval(function() { createData();}, 3000);

router.use('/api/streamdata', router);

//maar random data
function createData(){
    light = Math.floor(Math.random() * (maxLight - minLight + 1)) + minLight
    currentTime = new Date()
}

//return de gemaakte data
function createdDataLight() {
    return '{"DateTime":' + '"' + currentTime + '"' + ', "Light":' + light + '}'
}

router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})

//return data met de bijhorende id of geef melding als deze niet bestaat of is gestopt.
router.get('/light/'+1, function (req, res) {
    res.send(createdDataLight())
});
router.get('/light/:id', function (req, res) {
    var id = req.params.id
    if(includes(arrTempID, id)){
        if(includes(arr, id)){
            res.send('sensor gestopt')
        } else{
            createData()
            res.send(createdDataLight())
        }
    } else {
        res.send("No sensor found")
    }
});

//alle inactieve sensors
router.get('/light/sensor/inactive', function (req, res) {
    res.send(arr)
})

//alle actieve sensors
router.get('/light/sensor/active', function (req, res) {
    res.send(activeNodes)
})

//herstart de senor en werk de arrays bij
router.get('/light/restart/:id', function (req, res) {
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
router.get('/update/light', function (req, res) {
    activeLightNodes++;
    console.log(activeLightNodes)
    makeNewNode()
    res.send(req.params.type)
});

//laat alle actieve nodes zien
router.get('/activenodes/light', function (req, res) {
    res.send(JSON.stringify({light : activeLightNodes}))
});

//stop de sensor en werk de array bij
router.get('/light/stop/:id', function (req, res) {
    var id = req.params.id
    arr.push(id);
    var i = activeNodes.indexOf(id);
    if(i > -1) {
        activeNodes.splice(i,1);
    }
    res.send('gelukt')
})

//laat de totale sensors zien (actief en inactiev)
router.get('/light/sensors/totaal', function (req, res) {
    var totaal = activeNodes.concat(arr)
    res.send(totaal)
})

//verwijder de sensor
router.get('/light/remove/:id', function (req,res) {
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
        router.get('/light/' + lightID, function (req, res) {
            res.send(createdDataLight())
        });
        arrTempID.push(lightID.toString())
        activeNodes.push(lightID.toString())
        lightID++;
    }
}

module.exports = router;