var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const { initializeApp } = require('firebase-admin/app');
const { getDatabase} = require("firebase-admin/database");
const db_funcs = require("./public/javascripts/db_funcs.js")
var serviceAccount = require("./serviceAccountkey.json")

var indexRouter = require('./routes/index');

const { credential } = require('firebase-admin');

const firebaseConfig = {
  apiKey: "AIzaSyA11yd3qdsuSEnnO34lWcCG8LF_NxfV6ao",
  authDomain: "horserace-ce6c8.firebaseapp.com",
  databaseURL: "https://horserace-ce6c8-default-rtdb.firebaseio.com",
  projectId: "horserace-ce6c8",
  storageBucket: "horserace-ce6c8.appspot.com",
  messagingSenderId: "772663051185",
  appId: "1:772663051185:web:255bb8ab213903bc6fb390",
  credential: credential.cert(serviceAccount)
};

const dbapp = initializeApp(firebaseConfig);
var horse_db = getDatabase(dbapp)
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/javascripts/db_funcs.js',function(req,res){
  res.sendFile(path.join(__dirname + '/javascripts/db_funcs.js')); 
});
app.get('/javascripts/main.js',function(req,res){
  res.sendFile(path.join(__dirname + '/javascripts/main.js')); 
});

app.use(bodyParser.urlencoded({ 
  extended: true 
}));

app.use('/', indexRouter);

app.post('/addRace', urlencodedParser, function (req, res) {
  raceId = req.body.place + "_" + Date.now()
  db_funcs.writeRaces(horse_db, raceId, req.body.place, req.body.time, req.body.min, req.body.max)
  res.redirect('/')
})

app.get('/getRaces',urlencodedParser, async (req, res) => {
  const data = await db_funcs.readRaces(horse_db)
  res.send(data)
});

app.get('/getHorses',urlencodedParser, async (req, res) => {
  const data = await db_funcs.readHorses(horse_db)
  res.send(data)
});

app.get('/readResults',urlencodedParser, async (req, res) => {
  const data = await db_funcs.readResults(horse_db)
  res.send(data)
})

app.post('/addHorse', urlencodedParser, function (req, res) {
  horseId = req.body.name + "_"  + req.body.color + Date.now()
  db_funcs.writeHorses(horse_db, req.body.raceId, horseId, req.body.name, req.body.color)
  res.redirect('/')
});

app.post('/makeBet', urlencodedParser, function (req, res) {
  betId = req.body.race[0] + req.body.horse[0] + "_"  +  + Date.now()
  db_funcs.writeBet(horse_db,betId ,req.body.race, req.body.horse, req.body.bet)
  res.redirect('/')
});

app.get('/getBets',urlencodedParser, async (req, res) => {
  const data = await db_funcs.getBet(horse_db)
  res.send(data)
});

app.get('/getCompetitors',urlencodedParser, async (req, res) => {
  const data = await db_funcs.readCompetitors(horse_db)
  res.send(data)
});

app.post('/resultWrite', (req, res) => {
  console.log(req.body.raceId, req.body.winner, req.body.losers)
  db_funcs.writeResults(horse_db, req.body.raceId, req.body.winner, req.body.losers)
  res.sendStatus(200)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
