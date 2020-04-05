'use strict';

// initial server setup

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});


//handle any route

server.get('/', (request, response) => {
  response.status(200).send('Working');
});


//handling location route

server.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const city = request.query.city;
  const cityLocation = new LocationData(city, geoData);
  response.send(cityLocation);
});

//C.F to get location data as instances

function LocationData(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

//handle not found
server.use('*', (request, response) => {
  response.status(404).send('ERROR 404: PAGE NOT FOUND');
});

