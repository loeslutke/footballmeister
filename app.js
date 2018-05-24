// Require en initiate de Koa-basis
var Koa = require('koa');
var app = new Koa();

// require de Koa request module
var Request = require('request');

// require de back-up functie
var Service = require('./services/base.js');

// Set de variabelen voor de GET Request
var authorizationKey = "565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76";
var compId = "1322";
var fromDate = "10-8-2017";
var toDate = "7-5-2018";

// Gebruik een normale functie voor de use i.p.v. generator of async, omreden dat er geen voordelen uit gehaald worden deze te gebruiken
app.use(function(ctx) {
  // Maak de request url, en maak de request
  var requestUrl = "http://api.football-api.com/2.0/matches?comp_id="+compId+"&from_date="+fromDate+"&to_date="+toDate+"&Authorization="+authorizationKey;
  var returnValue = Request(requestUrl, { json: true }, (err, res, body) => {
    // Check of de request een error oplevert; zoja, gebruik een faked response
    if(body.hasOwnProperty('error')) {
      var response = Service.getFakeResponse();
    } else {
      var response = body;
    }

    // De array om alle wedstrijden in op te vangen
    var allGames = [];

    // Loop over alle matches om alleen de correcte data aan allGames toe te voegen
    for(var i = 0; i < response.length; i++) {
      allGames.push({
        date: response[i].formatted_date,
        time: response[i].time,
        homeTeam: response[i].localteam_name,
        visitorTeam: response[i].visitorteam_name,
        location: response[i].venue
      });
    }

    // Sorteer de allGames array op speeltijd/speelvolgorde
    allGames.sort(function(a,b) {
      var splitDateA = a.date.split('.');
      var dateTimeStringA = Date.parse(splitDateA[2]+"-"+(splitDateA[1]-1)+"-"+splitDateA[0]+" "+a.time);

      var splitDateB = b.date.split('.');
      var dateTimeStringB = Date.parse(splitDateB[2]+"-"+(splitDateB[1]-1)+"-"+splitDateB[0]+" "+b.time);

      return dateTimeStringB-dateTimeStringA;
    });

    // set de gesorteerde allGames array als body voor de request, zodat de request daadwerkelijk gebruikt kan worden
    return allGames;
  });
  // Set de returnValue als body zodat deze gebruikt kan worden
  ctx.body = returnValue;
});

// Set de app op port 3000
app.listen(3000);
