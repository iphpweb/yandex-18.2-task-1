import { Chart } from 'chart.js';

function getColor(isActive, alpha = 1) {
  return isActive
    ? `rgba(54, 162, 235, ${alpha})`
    : `rgba(255, 99, 132, ${alpha})`;
}

function getLabel(el, i, data) {
  const x = new Date();

  x.setHours(x.getHours() - data.length + i);
  x.setMinutes(0);
  x.setSeconds(0);
  x.setMilliseconds(0);

  return x.toString();
}

// здесь я решил покапаться в документации chart.js
// и мне понравилось ...
// в связи с чем на графике появилось много чего
// но оно не мешает и не запрещено
// progress bar, на мой взгляд, немного запаздывает либо график виден не весь
// есть какая-то задержка в завершении
export function createChart(container, data, isActive) {
  var progress = document.getElementById('animationProgress');
  const ctx = container.getContext('2d');

  const borderColor = getColor(isActive);
  const backgroundColor = getColor(isActive, 0.5);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(getLabel),
      datasets: [{
        data: data,
        borderWidth: 1,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        fill: true // default
      }]
    },
    options: { // опций стало значительно больше
      animation: {
        onProgress: function(animation) {
          progress.value = animation.currentStep / animation.numSteps;
        },
        onComplete: function() {
          progress.remove();
        },
      },
      responsive: true,
      title: {
        display: true,
        text: 'chart of the day'
      },
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: { display: false }
        }],
        yAxes: [{
          gridLines:  {
            drawBorder: false,
            color: ['orange', 'green'],
            zeroLineColor: `rgba(0, 0, 128, 1)`,
            zeroLineWidth: 1,
          },
          ticks: { beginAtZero: true }
        }]
      }
    }
  });

  return chart;
}
