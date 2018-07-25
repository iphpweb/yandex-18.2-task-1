import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

// export DEFAULT иначе не по фэн-шую
export default function initMap(ymaps, containerId) {
  var myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: ['zoomControl'], // для саморазвития
    zoom: 11
  }),
  // объявим objectManager тут же в картах
  objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',
    clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: true, // сменив эту опцию на true не надо открывать "руками" balloon при клике
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
  });

  // хочу видеть реальный мир
  // в задании не указана конкретика вида карты
  // гибридный спутник это огонь
  myMap.setType('yandex#hybrid');

  // эта опция не соответствует ТЗ тк делает весь кластер зеленым
  // и не учитывает что в нем могут быть станции 2х типов (active || defective)
  // в mappers устанавливается правильный цвет
  //objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

  loadList().then(data => {
    objectManager.add(data);
  }).catch(function(err) { // добавим обработку промиса ... а вдруг
    console.log(err);
  });
  // пропущен/отсутствует важный шаг:
  // после получения коллекции гео-меток их надо "закинуть" в objectManager
  // делаем это в соответствии с документацией
  myMap.geoObjects.add(objectManager);

  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    // факультативно - получение типа метки
    //console.dir(objectManager.objects.getById(objectId).geometry.type);

    // зачем открывать его тут если еще не выяснили есть ли там ИНФО
    // можно смело отказаться от этого действия здесь
    // опция 'geoObjectOpenBalloonOnClick: true' прекрасно с этим справляется
    //objectManager.objects.balloon.open(objectId);

    if (!obj.properties.details) {
      // Метод then() ожидает функцию
      // поэтому здесь в promise кидаем именно функцию
      loadDetails(objectId).then(function (data) {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      }).catch(function(err) { // добавим обработку промиса ... а вдруг
        console.log(err);
      });
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });

  // координаты клика (для саморазвития)
  // хотя мне кажется в самом начале на странице задания было написано вывести координаты
  // в ту же обсласть где и вся инфа о станции с графиком
  myMap.events.add('click', function (e) {
    console.log(e.get('coords').join(', '));
  });
}
