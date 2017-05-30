var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');
const http = require('http')
var includes = require('array-includes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var router = express.Router();
var minTemp = 12;
var id;
var maxTemp = 30;
var temp;
var currentTime;
var moment;
var activeTempNodes = 1;
var tempID = 2;
var arr = [];
var arrTempID = [];
var randomTempData = setInterval(function() { createData();}, 3000);

router.use('/api/streamdata', router);

function createData(){
    temp = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp
    currentTime = new Date()
}

function createdDataTemp() {
    return '{"DateTime":' + '"' + currentTime + '"' + ', "Temperature":' + temp + '}'
}

router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})


router.get('/temp/'+1, function (req, res) {
    res.send(createdDataTemp())
});
router.get('/temp/:id', function (req, res) {
    var id = req.params.id
    if(includes(arrTempID, id)){
        if(includes(arr, id)){
            res.send('sensor gestopt')
        } else{
            res.send(createdDataTemp())
        }
    } else {
        res.send("No sensor found")
    }
});

router.get('/temp/restart/:id', function (req, res) {
    var id = req.params.id
    var i = arr.indexOf(id);
    if(i > -1) {
        arr.splice(i,1);
    }
    res.send('gelukt')
});

router.get('/update/temp', function (req, res) {
    activeTempNodes++;
    console.log(activeTempNodes)
    makeNewNode()
    res.send(req.params.type)
});

router.get('/activenodes/temp', function (req, res) {
    res.send(JSON.stringify({temp : activeTempNodes}))
});

router.get('/temp/stop/:id', function (req, res) {
    var id = req.params.id
    arr.push(id);
    res.send('gelukt')
})

function makeNewNode() {
    makeResUrls(true)
}

function makeResUrls(boolean) {
    if(boolean == true){
        router.get('/temp/' + tempID, function (req, res) {
            res.send(createdDataTemp())
        });
        arrTempID.push(tempID.toString())
        tempID++;
    }
}

module.exports = router;