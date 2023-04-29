/*

#player-name form for paler's name in the game window
#airport-name
#airport-country
#airport-continent
#airport-flag

*/

'use strict';

const apiUrl = 'http://127.0.0.1:5000/';
const startLoc = 'EFHK';
const globalGoals = [];  //here will be reached goals

/*1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

const airportMarkers = L.featureGroup().addTo(map);
const flightCounter = 0;

const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

//

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
/*document.querySelector('#player-form').addEventListener('submit', function (evt) {
  evt.preventDefault();
  const playerName = document.querySelector('#player-input').value;
  document.querySelector('#player-modal').classList.add('hide');
  gameSetup(`${apiUrl}newgame?player=${playerName}&loc=${startLoc}`);
});*/

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = await response.json();
  //console.log(url);
  //console.log(data);
  return data
}

function updateStatus(status) {
  /*console.log(status)
  document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;

  for (land of status.visited_location) {
    document.querySelector(land).innerHTML = status.visied_location[land] ?
        '${land} on käytetty' :
        '${land }ei ole käytetty';
  }*/

}

// function to show information about airport

function showAirportDetails(airport) {
  document.querySelector('#airport-name').innerHTML = `This is ${airport.name}`;
  document.querySelector(
      '#airport-country').innerHTML = `It is situated in ${airport.country}`;
  document.querySelector(
      '#airport-continent').innerHTML = `${airport.country} is situated in ${airport.continent}`;
  document.querySelector('#airport-flag').src = airport.flag;
}

// function to check if any goals have been reached
function checkGoals(continent) {
  if (!globalGoals.includes(continent)) {
    document.querySelector('.goal').classList.remove('hide');
    location.href = '#goals';
  }
}

// function to check if game is over
function checkGameOver() {
  if (flightCounter => 21) {
    alert(`Game Over`);
    return false;
  }
  return true;
}

// function to set up game
async function gameSetup(url) {
  try {
    //document.querySelector('.goal').classList.add('hide');
    airportMarkers.clearLayers();
    const gameData = await getData(url + '/newgame?player=Vesa&loc=EFHK');
    //updateStatus(gameData.status);
    //console.log(JSON.stringify(gameData));

    for (let i=0; i<gameData.location.length;i++) {
      const airport = gameData.location[i];

      console.log(JSON.stringify(gameData.location[i]))

      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);

      if (airport.active) {
        map.flyTo([airport.latitude, airport.longitude], 10);
        marker.bindPopup(airport.name);
        marker.openPopup();
        marker.setIcon(greenIcon);
        console.log(greenIcon);
      } else {
        marker.setIcon(blueIcon);

        const countryInfo = await getData("https://restcountries.com/v3.1/alpha/"+ airport.iso_country);
        //console.log("https://restcountries.com/v3.1/alpha/"+ airport.iso_country);
        //console.log(countryInfo)

        const airportFlag = countryInfo[0].flags.svg;

        const tagFigure = document.createElement('figure')
        const tagFlag = document.createElement('img');
        tagFlag.src = airportFlag;
        tagFlag.style = "width: 100%; height: 100%;";
        tagFigure.appendChild(tagFlag);

        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;

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
        formContainer.appendChild(flyButton); //Append button

        const rightOption = airport.question['right_option'];
        const shList = shuffleList([
          airport.question['right_option'],
          airport.question['wrong_option1'],
          airport.question['wrong_option2']]);
        for (let i = 0; i < 3; i++) {
          const option = document.createElement('option');
          option.text = shList[i];
          qForm.appendChild(option);
        }
        popupContent.append(formContainer); // Append the container div to the popupContent element
        marker.bindPopup(popupContent);
        //console.log(qForm);


      }


    }
  } catch (error) {
    console.log(error);
  }
}

// event listener to hide goal splash

/*document.querySelector('.goal').addEventListener('click', function(evt) {
  evt.currentTarget.classList.add('hide');
});*/

// this is the main function that creates the game and calls the other functions

gameSetup(apiUrl);

/*
  try {
    document.querySelector('.goal').classList.add('hide');
    airportMarkers.clearLayers();
    const gameData = await getData(url);
    console.log(gameData);
    updateStatus(gameData.status);
    if (!checkGameOver(gameData.status.co2.budget)) return;
    for (let airport of gameData.location) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      airportMarkers.addLayer(marker);
      if (airport.active) {
        map.flyTo([airport.latitude, airport.longitude], 10);
        showWeather(airport);
        checkGoals(airport.weather.meets_goals);
        marker.bindPopup(`You are here: <b>${airport.name}</b>`);
        marker.openPopup();
        marker.setIcon(greenIcon);
      } else {
        marker.setIcon(blueIcon);
        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;
        popupContent.append(h4);
        const goButton = document.createElement('button');
        goButton.classList.add('button');
        goButton.innerHTML = 'Fly here';
        popupContent.append(goButton);
        const p = document.createElement('p');
        p.innerHTML = `Distance ${airport.distance}km`;
        popupContent.append(p);
        marker.bindPopup(popupContent);
        goButton.addEventListener('click', function () {
          gameSetup(`${apiUrl}flyto?game=${gameData.status.id}&dest=${airport.ident}&consumption=${airport.co2_consumption}`);
        });
      }
    }
    updateGoals(gameData.goals);
  } catch (error) {
    console.log(error);
  }
}


*/
