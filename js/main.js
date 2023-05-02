'use strict';

const flightMax = 21;
let pointA, pointB;
let flightCounter = 0;

const apiUrl = 'http://127.0.0.1:5000/';
const startLoc = 'EFHK';

/*1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20, minZoom: 1, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

const airportMarkers = L.featureGroup().addTo(map);
const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});
const redIcon = L.divIcon({className: 'red-icon'});

//shuffleList for random order in answers
function shuffleList(list) {
  for (let i = 0; i < list.length; i++) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[randomIndex];
    list[randomIndex] = temp;
  }
  return list;
}

//
// form for player name, wich starts new game for player with name in text field
//
document.querySelector('#player-form').
    addEventListener('submit', function(evt) {
      evt.preventDefault();
      const playerName = document.querySelector('#player-input').value;
      document.querySelector('#player-modal').classList.add('hide');
      gameSetup(`${apiUrl}newgame?player=${playerName}&loc=${startLoc}`);
    });

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = await response.json();
  //console.log(url);
  //console.log(data);
  return data;
}

function updateFooter(status) {
  console.log(status);
  //document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;
  for (let land in status.visited_location) {
    console.log(land);
    if (status.visited_location[land]) {
      document.getElementById(land).classList.remove("goal");
      document.getElementById(land).classList.add("goal-reached");
    }
    else {
      document.getElementById(land).classList.add('goal');
    }
  }
}

// function to check if game is over
  function GameOver(status) {
    if (flightCounter >= flightMax) {
      map.setView([30, 24], 0.5);
      alert(`Game Over. Olet jo tehnyt 21 lentoa...`);
      return true;
    }
    if (status.game_over) {
      map.setView([30, 24], 0.5);
      alert(`Game Over. Olet käynyt kaikilla mantereilla...`);
      return true;
    }
    return false;
  }

// function to set up game
  async function gameSetup(url) {
    try {
      airportMarkers.clearLayers();

      const gameData = await getData(url);

      updateFooter(gameData.status);

      //console.log(JSON.stringify(gameData));

      if (GameOver(gameData.status)) {

        return;
      }

      for (let i = 0; i < gameData.location.length; i++) {

        const airport = gameData.location[i];
        //console.log(JSON.stringify(gameData.location[i]))
        const marker = L.marker([airport.latitude, airport.longitude]).
            addTo(map);
        airportMarkers.addLayer(marker);

        if (airport.active) {

          map.flyTo([airport.latitude, airport.longitude], 3);
          const markerRed = L.marker([airport.latitude, airport.longitude]).
              addTo(map);
          markerRed.setIcon(redIcon);
          pointA = L.latLng(airport.latitude, airport.longitude);
          marker.bindPopup('Olet tässä: ' + airport.name);
          marker.openPopup();
          marker.setIcon(greenIcon);
          console.log(greenIcon);

        } else {

          marker.setIcon(blueIcon);

          //get flag and country name translated in finish from API
          const countryInfo = await getData(
              'https://restcountries.com/v3.1/alpha/' + airport.iso_country);

          //console.log(countryInfo);

          //making form question
          const countryName = countryInfo[0].translations.fin.common;
          const airportFlag = countryInfo[0].flags.svg;

          const tagFigure = document.createElement('figure');
          const tagFlag = document.createElement('img');
          tagFlag.src = airportFlag;
          tagFlag.classList.add('flag');
          tagFigure.appendChild(tagFlag);

          const popupContent = document.createElement('div');
          const h4 = document.createElement('h4');
          h4.innerHTML = airport.name + '.<br> Maa ' +
              countryName + '. <br>';

          const qForm = document.createElement('select');
          qForm.classList.add('qForm');

          const pQuestion = document.createElement('p');
          pQuestion.innerHTML = airport.question['question'];

          const flyButton = document.createElement('button');
          flyButton.innerHTML = 'FLY!';
          flyButton.classList.add('flyButton');

          const formContainer = document.createElement('div'); // Add a container div for form elements
          formContainer.appendChild(h4); //append name
          formContainer.appendChild(tagFigure); //append flag
          formContainer.appendChild(pQuestion); // Append the p element to the container div
          formContainer.appendChild(qForm); // Append the select element to the container div

          // Create a new div for the button
          const buttonContainer = document.createElement('div');
          buttonContainer.appendChild(flyButton);
          formContainer.appendChild(buttonContainer); // Append the button div to the container div

          qForm.classList.add('qForm_elements');

          const shList = shuffleList([
            airport.question['right_option'],
            airport.question['wrong_option1'],
            airport.question['wrong_option2']]);
          for (let i = 0; i < 3; i++) {
            const option = document.createElement('option');
            option.text = shList[i];
            qForm.appendChild(option);
          }

          flyButton.classList.add('qForm_elements');
          popupContent.append(formContainer); // Append the container div to the popupContent element
          marker.bindPopup(popupContent);

          flyButton.addEventListener('click', function() {
            if (qForm.value === airport.question.right_option) {
              flightCounter = flightCounter + 1;
              pointB = L.latLng(airport.latitude, airport.longitude);
              const markerRed = L.marker([airport.latitude, airport.longitude]).
                  addTo(map);
              markerRed.setIcon(redIcon);

              L.polyline([pointA, pointB],
                  {dashArray: '10, 10', color: 'red', weight: 5}).addTo(map);
              gameSetup(
                  `${apiUrl}flyto?game=${gameData.status.id}&dest=${airport.ident}`);
            } else {
              alert('oho :( vastausi on väärä' + ' ro ' +
                  airport.question.right_option + ' wo1 ' +
                  airport.question.wrong_option1 + ' wo2 ' +
                  airport.question.wrong_option2);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

