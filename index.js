var Koa = require('koa');
var app = new Koa();

var Request = require('request');

var Service = require('./services/base.js');

var authorizationKey = "565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76";
var compId = "1322";
var fromDate = "10-8-2017";
var toDate = "7-5-2018";

app.use(function(ctx) {
  var requestUrl = "http://api.football-api.com/2.0/matches?comp_id="+compId+"&from_date="+fromDate+"&to_date="+toDate+"&Authorization="+authorizationKey;
  var requestResponse = Request(requestUrl, { json: true }, (err, res, body) => {
    var response = '';
    if(body.hasOwnProperty('error')) {
      response = Service.getFakeResponse();
    } else {
      response = body;
    }

    var allGames = [];

    for(var i = 0; i < response.length; i++) {
      allGames.push({
        date: response[i].formatted_date,
        time: response[i].time,
        homeTeam: response[i].localteam_name,
        visitorTeam: response[i].visitorteam_name,
        location: response[i].venue
      });
    }

    allGames.sort(function(a,b) {
      var splitDateA = a.date.split('.');
      var dateTimeStringA = Date.parse(splitDateA[2]+"-"+(splitDateA[1]-1)+"-"+splitDateA[0]+" "+a.time);

      var splitDateB = b.date.split('.');
      var dateTimeStringB = Date.parse(splitDateB[2]+"-"+(splitDateB[1]-1)+"-"+splitDateB[0]+" "+b.time);

      return dateTimeStringB-dateTimeStringA;
    });

    return JSON.stringify(allGames);
  });

  ctx.body = requestResponse;
});

app.listen(8080);
