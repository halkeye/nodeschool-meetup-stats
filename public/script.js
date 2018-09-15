'use strict';

var meetupData;
function preload() {
  meetupData = loadJSON('./data.json')
}

function setup() {
  meetupData = Object.values(meetupData);
  createCanvas(720, 400);
  noStroke();
  noLoop();  // Run once and stop
}

function draw() {
  try {
    background(100);
    textSize(32);
    meetupData.slice(7, 8).forEach(function(meetup) {
      console.log('meetup', meetup);
      text(meetup.name, 10, 30);
      const responses = [meetup.responses.yes, meetup.responses.no];
      const total = responses.reduce((a, b) => a + b, 0);
      pieChart(
        300,
        responses.map(function (response) {
          return response/total;
        }),
        ['yes', 'no']
      );
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function pieChart(diameter, data, labels) {
  try {
    var lastAngle = 0;
    for (var i = 0; i < data.length; i++) {
      var gray = map(i, 0, data.length, 0, 255);
      fill(gray);
      var angle = radians(map(data[i], 0, 1, 0, 360));
      arc(width/2, height/2, diameter, diameter, lastAngle, lastAngle+angle);
      lastAngle += angle;

      var x = 0;
      var y = (55*i)+50;
      rect(x, y, 50, 50);
      fill(255)
      text(labels[i] + ' - ' + Math.round(data[i]*100) + '%', x + 60, y+30);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

