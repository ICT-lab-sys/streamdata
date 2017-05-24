
var express = require('express')

var app = express();
var bodyParser = require('body-parser')
var moment = require('moment');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var port = process.env.PORT || 3001;
var router = express.Router();
var test = true;
var minTemp = 12;
var id;
var maxTemp = 30;
var minHumidity = 40;
var maxHumidity = 60;
var temp;
var humidity;
var currentTime;
var moment;
var activeTempNodes = 1;
var activeHumidNodes = 1;
var tempID = 2;
var humidID = 2;

var randomTempData = setInterval(function() { createData('temper');}, 3000);
var randomHumidData = setInterval(function() { createData('humid');}, 3000);

function createData(type){
    if(type == 'temper') {
        temp = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp
    }
    if(type == 'humid') {
        humidity = Math.floor(Math.random() * (maxHumidity - minHumidity + 1)) + minHumidity;
    }
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
}



router.get('/', function (req, res) {
    res.send("Please go to localhost:3001/api/streamdata/temp")
})


router.get('/temp/'+1, function (req, res) {
    res.send(random())
});

router.get('/humidity/'+1, function (req, res) {
    res.send(humidityFunc());
});

router.get('/update/:type', function (req, res) {
    if (req.params.type == 'temp') {
        activeTempNodes++;
    }
    if (req.params.type == 'humid') {
        activeHumidNodes++;
    }
    makeNewNode(req.params.type)
    res.send(req.params.type)
    });

router.get('/activenodes', function (req, res) {
    res.send(JSON.stringify({temp : activeTempNodes, humid : activeHumidNodes}))
});

router.get('/delete/temp/:id', function (req, res) {
     var id = req.params.id
        makeResUrls(false);
     res.send('proces gestopt')

    })


app.use('/api/streamdata', router);


app.listen(port, function () {
    console.log('Example app listening on port '+port+'!')
})

function makeNewNode(type) {
    if(type == 'temp'){
        makeResUrls(true)
    }

    if(type == 'humid'){
        router.get('/temp/'+humidID, function (req, res) {
            res.send(random())
        });
        humidID++;
    }

}

function makeResUrls(boolean) {
    console.log(boolean)
   if(boolean == true){
       router.get('/temp/' + tempID, function (req, res) {
           res.send(random())
       });
       tempID++;
   }
   if(boolean == false){
       router.get('/temp/' + id, function (req, res) {
           res.send('uitgeschakeld')
       });
   }
}
