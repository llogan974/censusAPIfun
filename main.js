/*
Allow users to get info from the census for their city, and compare with state and national averages
*/

// From a dropdown, select the CATEGORY of info to search for
// Select GEOGRAPHIC AREA

const gridSelector = document.querySelector('.gridContainer');
const stateSelector = document.getElementById('stateDropdown');
const tagSelector = document.getElementById('tagDropdown');
const countySelector = document.getElementById('countyDropdown');
const stateDiv = document.querySelector('.state');
const countyDiv = document.querySelector('.county');
const countryDiv = document.querySelector('.country');
const key = '80b3fa4b725c86f64a742f9bc799b2cb861e1644';
// var queryValue;
/* eslint-enable */

// Get the states
const res = fetch(
  `https://api.census.gov/data/2017/acs/acs1/subject?get=NAME&for=state:*&key=${key}`
)
  // Transform promise with .then, which is unformatted
  .then(res =>
    // Call it in json, which will return a promise
    res.json()
  )
  .then(res => {
    stateSelector.innerHTML = '';

    for (state of res) {
      stateSelector.innerHTML += `<option value="${state[1]}">${
        state[0]
        }</option>`;
    }
  });



stateSelector.addEventListener("change", getCounties);

countySelector.addEventListener("change", getTags);

// get counties
function getCounties() {
  // https://api.census.gov/data/2017/acs/acs1?get=NAME,B00001_001E&for=county:020&in=state:02&key=YOUR_KEY_GOES_HERE
  const counties = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,B01001_001E&for=county:*&in=state:${stateSelector.value}&key=${key}`
  )
    .then(counties => counties.json())
    .then(counties => {
      countySelector.innerHTML = "";
      for (const county of counties) {
        countySelector.innerHTML += `<option value=${county[3]}>${
          county[0]
          } </option>}`;
      }
    });
}

// On page load, get keys and values of 20 random items
let randValues = [];
let censusItems = [];

function getTags() {
  const tagVars = fetch(`
  https://api.census.gov/data/2017/acs/acs1/subject/variables.json
  `).then(tagVars =>
    tagVars.json().then(tagVars => {

      let allValues = Object.entries(tagVars.variables);
      let allKeys = Object.keys(tagVars.variables);


      // Create an array and push items to end of the array
      for (var i = 0; i < 10; i++) {
        randValues.push(allKeys[Math.floor(Math.random() * allKeys.length)]);
      }
      for (var values of randValues) {
        censusItems.push(allValues.filter(value => value[0] === values));
      }
      mainQuery(censusItems);
    }
    )
  );
}


function mainQuery(randVars) {
  let queryVars = "";
  for (var censusKeys of randVars) {
    queryVars += "," + censusKeys[0][0]
  }
  const county = fetch(`
    https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${queryVars}&for=county:${countySelector.value}&in=state:${stateSelector.value}&key=${key}`);

  const state = fetch(
    `https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${queryVars}&for=state:${stateSelector.value}&key=${key}`
  );
  const country = fetch(
    `https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${queryVars}&for=us:1&key=${key}`
  );
  Promise.all([county, state, country])
    // Transform promise with .then, which is unformatted
    .then(
      responses => {
        return Promise.all(responses.map(res => res.json()))
      }
      // Call it in json, which will return a promise
      // answer.json()
    )
    .then(res => {
      // County will have all county info
      // ItemName hase the value
      for (const [i, itemName] of randVars.entries()) {
        console.log(res, itemName);
        // gridSelector.innerHTML += `<div class="gridItem">County: ${itemName[0][1].label}</br>
        //   ${entries[1][i + 1]} </br>
        //   </div>
        //       `
      }
    });
}
