import { createChart } from './chart';

export function getDetailsContentLayout(ymaps) {
  // добавил в шаблон вывод координат
  // почти на 100% уверен что в самом начале, после размещения задания, надо было их вывести
  // сейчас такого уже не написано, в задании
  // но я решил оставить, ибо нарыл это в API
  // в дополнение вывел progress-bar для отрисовки графика
  // вам это возможно покажется лишним, но я просто "заигрался" с chart.js ... lol
  const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
    `<div class="details-info">
      {% if (properties.details) %}
        <div class="details-info">
          <div class="details-label">base station</div>
          <div class="details-title">{{properties.details.serialNumber}}</div>

          <div class="details-label">coordinates</div>
          <div class="details-title">lat: {{properties.details.lat}}</div>
          <div class="details-title">long: {{properties.details.long}}</div>

          {% if (properties.details.isActive) %}
            <div class="details-state details-state_active">active</div>
          {% else %}
            <div class="details-state details-state_defective">defective</div>
          {% endif %}

          <div class="details-state details-state_connections">
          connections: {{properties.details.connections}}
          </div>
        </div>

        <div class="details-info">
          <div class="details-label">connections</div>
          <canvas class="details-chart" width="270" height="100" />
        </div>
        <progress id="animationProgress" max="1" value="0" style="width: 100%"></progress>
      {% else %}
        <div class="details-info">
          Идет загрузка данных...
        </div>
      {% endif %}
    `,
    {
      // просто следуем документации
      build: function () {
        BalloonContentLayout.superclass.build.call(this);

        const { details } = this.getData().object.properties;

        if (details) {
          const container = this.getElement().querySelector('.details-chart');

          this.connectionChart = createChart(
            container,
            details.chart,
            details.isActive
          );
        }
      },

      // просто следуем документации
      clear: function () {
        if (this.connectionChart) {
          this.connectionChart.destroy();
        }

        BalloonContentLayout.superclass.clear.call(this);
      }
    }
  );

  return BalloonContentLayout;
}
