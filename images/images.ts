//import * as Interface from 'piarch-a-interfaces';
const churchImage = require('./map/icons/church.png');
const monumentImage = require('./map/icons/column.png');
const museumImage = require('./map/icons/museum.png');
const palaceImage = require('./map/icons/palace.png');
const shopImage = require('./map/icons/shop.png');
const bicycleImage = require('./icons/bicycle.png');
const hikerImage = require('./icons/hiker.png');
const trekkingImage = require('./icons/trekking.png');

export default {
  // TODO uncommenting this breaks the app
  // [Interface.Marker.Church]: churchImage,
  Church: churchImage,
  Monument: monumentImage,
  Museum: museumImage,
  Palace: palaceImage,
  Shop: shopImage,
  Bike: bicycleImage,
  Hike: hikerImage,
  Trekking: trekkingImage,
};
