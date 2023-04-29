//#player-name form for paler's name in the game window

'use strict';

const apiUrl = 'http://127.0.0.1:5000/';
const startLoc = 'EFHK';
const globalGoals = [];
const airportMarkers = L.featureGroup().addTo(map);

const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

/*1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

//shake answers
function shuffleList(list) {
  for (let i = list.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = list[i];
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
  const data = response.json();
  return data;
}

// function to update game status
// "status": {"id": "8UdJb2gimIHPpkGaP6hT",
//            "name": "Test Player",
//            "visited_location": {
//                "AS": false,
//                "EU": false,
//                "AF": false,
//                "NA": false,
//                "SA": false,
//                "AU": false,
//                "AN": false
//     }
function updateStatus(status) {
  document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;

  for (land of status.visited_location) {
    document.querySelector(land).innerHTML = status.visied_location[land] ?
            '${land} on käytetty' :
            '${land }ei ole käytetty';
     }

}

// function to show weather at selected airport
//TODO joke or coffe picture???

// function to check if any goals have been reached

// function to update goal data and goal table in UI

// function to check if game is over

// function to set up game
async function gameSetup(url) {
  try {
    const gameData = await getData(url);
    updateStatus(gameData.status);
    console.log(gameData);

    for (let airport of gameData.location) {
      console.log(airport.visited);

      //TODO: исправить на ложь if (!airport.visited)
      //Näytämme lentokentät vain vierailluilla maanosilla.

      if (airport.visited) {
        const marker = L.marker([airport.latitude, airport.longitude]).
            addTo(map);
        if (airport.active) {
          marker.bindPopup(airport.name);
          marker.openPopup();
          marker.setIcon(greenIcon);
        } else {
          marker.setIcon(blueIcon);
          const popupContent = document.createElement('div');
          const h4 = document.createElement('h4');
          h4.innerHTML = airport.name;

          //form for question
          /*
          const randomQuestion = {
            'status': 200,
            'id': 21,
            'question': 'Paljonko on Etel\u00e4mantereen mannerj\u00e4\u00e4n keskim\u00e4\u00e4r\u00e4inen paksuus?',
            'right_option': '2,5km',
            'wrong_option_1': '1,4km',
            'wrong_option_2': '4,1km',
          };*/

          /*from our own API*/
          const randomQuestion = getData('http://127.0.0.1:3000/q');
          console.log(randomQuestion);

          const qForm = document.createElement('select');
          qForm.classList.add('qForm');

          const pQuestion = document.createElement('p');
          pQuestion.innerHTML = randomQuestion.question;

          const flyButton = document.createElement('button');
          flyButton.innerHTML = 'FLY!';
          flyButton.classList.add('flyButton');

          const formContainer = document.createElement('div'); // Add a container div for form elements
          formContainer.appendChild(pQuestion); // Append the p element to the container div
          formContainer.appendChild(qForm); // Append the select element to the container div
          formContainer.appendChild(flyButton); //Append button

          const rightOption = randomQuestion.right_option;
          const shList = shuffleList([
            randomQuestion.right_option,
            randomQuestion.wrong_option_1,
            randomQuestion.wrong_option_2]);
          for (let i = 0; i < 3; i++) {
            const option = document.createElement('option');
            option.text = shList[i];
            qForm.appendChild(option);
          }

          popupContent.append(formContainer); // Append the container div to the popupContent element
          marker.bindPopup(popupContent);
          console.log(qForm);
        }
      }

    }
  } catch (error) {
    console.log(error);
  }
}

// this is the main function that creates the game and calls the other functions

gameSetup();

// event listener to hide goal splash

/*



// function to show weather at selected airport
function showWeather(airport) {
  document.querySelector('#airport-name').innerHTML = `Weather at ${airport.name}`;
  document.querySelector('#airport-temp').innerHTML = `${airport.weather.temp}°C`;
  document.querySelector('#weather-icon').src = airport.weather.icon;
  document.querySelector('#airport-conditions').innerHTML = airport.weather.description;
  document.querySelector('#airport-wind').innerHTML = `${airport.weather.wind.speed}m/s`;
}

// function to check if any goals have been reached
function checkGoals(meets_goals) {
  if (meets_goals.length > 0) {
    for (let goal of meets_goals) {
      if (!globalGoals.includes(goal)) {
        document.querySelector('.goal').classList.remove('hide');
        location.href = '#goals';
      }
    }
  }
}

// function to update goal data and goal table in UI
function updateGoals(goals) {
  document.querySelector('#goals').innerHTML = '';
  for (let goal of goals) {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    img.src = goal.icon;
    img.alt = `goal name: ${goal.name}`;
    figcaption.innerHTML = goal.description;
    figure.append(img);
    figure.append(figcaption);
    li.append(figure);
    if (goal.reached) {
      li.classList.add('done');
      globalGoals.includes(goal.goalid) || globalGoals.push(goal.goalid);
    }
    document.querySelector('#goals').append(li);
  }
}

// function to check if game is over
function checkGameOver(budget) {
  if (budget <= 0) {
    alert(`Game Over. ${globalGoals.length} goals reached.`);
    return false;
  }
  return true;
}

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
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

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('click', function (evt) {
  evt.currentTarget.classList.add('hide');
});
*/