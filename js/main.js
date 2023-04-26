'use strict';
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

//get question from our API (a little bit stupid, but it for study purposes)

// global variables
//http://127.0.0.1:5000'

// icons

const blueIcon = L.divIcon({className: 'blueIcon'});
const greenIcon = L.divIcon({className: 'greenIcon'});

// form for player name

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = response.json();
  return data;
}

// function to update game status
// satus = {}
function updateStatus(sattus){

}

// function to show weather at selected airport

// function to check if any goals have been reached

// function to update goal data and goal table in UI

// function to check if game is over

// function to set up game
async function gameSetup() {
  try {
    const gameData = await getData('testdata/newgame.json');
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
          const randomQuestion = {
            'status': 200,
            'id': 21,
            'question': 'Paljonko on Etel\u00e4mantereen mannerj\u00e4\u00e4n keskim\u00e4\u00e4r\u00e4inen paksuus?',
            'right_option': '2,5km',
            'wrong_option_1': '1,4km',
            'wrong_option_2': '4,1km',
          };
          console.log(randomQuestion);

          const qForm = document.createElement('select');
          qForm.classList.add('qForm');

          const pQuestion = document.createElement('p');
          pQuestion.innerHTML = randomQuestion.question;

          const flyButton = document.createElement("button");
          flyButton.innerHTML = "FLY!"
          flyButton.classList.add("flyButton");

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
