// this file needs just simply code style corrected
// popup.js оказзался бесполезным и был удален
import initMap from './map';

ymaps.ready(() => {
  initMap(ymaps, 'map');
  console.log('inited');
});
