# footballmeister
Assessment opdracht voor de Football-api

** Koa-request **
In het begin geprobeerd om koa-request te gebruiken i.p.v. node request.
Dit zorgde voor problemen met error handling, toch geoppt om over te stappen op node request.

** De fake response **
Vaak de error gehad dat er te veel request zijn gedaan op de API.
Voor de zekerheid een functie in de service toegevoegd die een "gecachde" versie van een request gebruikt om te gebruiken voor de verdere functie wanneer er een error word terug gestuurd. 
