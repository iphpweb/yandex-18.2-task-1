import { mapServerData } from './mappers';

export function loadList() {
  return fetch('/api/stations')
    .then(response => response.json())
    .then(mapServerData)
    .catch(function(err) { // добавим обработку промиса ... а вдруг
      console.log(err);
    });
}

export function loadDetails(id) {
  return fetch(`/api/stations/${id}`)
    .then(response => response.json())
    .catch(function(err) { // добавим обработку промиса ... а вдруг
      console.log(err);
    });
}
