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
var randomLightData = setInterval(function() { createData();}, 3000);

router.use('/api/streamdata', router);

function createData(){
    light = Math.floor(Math.random() * (maxLight - minLight + 1)) + minLight
    currentTime = new Date()
}

function createdDataLight() {
    return '{"DateTime":' + '"' + currentTime + '"' + ', "Light":' + light + '}'
}

router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})


router.get('/light/'+1, function (req, res) {
    res.send(createdDataLight())
});
router.get('/light/:id', function (req, res) {
    var id = req.params.id
    if(includes(arrTempID, id)){
        if(includes(arr, id)){
            res.send('sensor gestopt')
        } else{
            res.send(createdDataLight())
        }
    } else {
        res.send("No sensor found")
    }
});

router.get('/light/restart/:id', function (req, res) {
    var id = req.params.id
    var i = arr.indexOf(id);
    if(i > -1) {
        arr.splice(i,1);
    }
    res.send('gelukt')
});

router.get('/update/light', function (req, res) {
    activeLightNodes++;
    console.log(activeLightNodes)
    makeNewNode()
    res.send(req.params.type)
});

router.get('/activenodes/light', function (req, res) {
    res.send(JSON.stringify({light : activeLightNodes}))
});

router.get('/light/stop/:id', function (req, res) {
    var id = req.params.id
    arr.push(id);
    res.send('gelukt')
})

function makeNewNode() {
    makeResUrls(true)
}

function makeResUrls(boolean) {
    if(boolean == true){
        router.get('/light/' + lightID, function (req, res) {
            res.send(createdDataLight())
        });
        arrTempID.push(lightID.toString())
        lightID++;
    }
}

module.exports = router;