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


const states = [
  [
    "NAME",
    "state"
  ],
  [
    "Alabama",
    "01"
  ],
  [
    "Alaska",
    "02"
  ],
  [
    "Arizona",
    "04"
  ],
  [
    "Arkansas",
    "05"
  ],
  [
    "California",
    "06"
  ],
  [
    "Colorado",
    "08"
  ],
  [
    "Connecticut",
    "09"
  ],
  [
    "Delaware",
    "10"
  ],
  [
    "District of Columbia",
    "11"
  ],
  [
    "Florida",
    "12"
  ],
  [
    "Georgia",
    "13"
  ],
  [
    "Hawaii",
    "15"
  ],
  [
    "Idaho",
    "16"
  ],
  [
    "Illinois",
    "17"
  ],
  [
    "Indiana",
    "18"
  ],
  [
    "Iowa",
    "19"
  ],
  [
    "Kansas",
    "20"
  ],
  [
    "Kentucky",
    "21"
  ],
  [
    "Louisiana",
    "22"
  ],
  [
    "Maine",
    "23"
  ],
  [
    "Maryland",
    "24"
  ],
  [
    "Massachusetts",
    "25"
  ],
  [
    "Michigan",
    "26"
  ],
  [
    "Minnesota",
    "27"
  ],
  [
    "Mississippi",
    "28"
  ],
  [
    "Missouri",
    "29"
  ],
  [
    "Montana",
    "30"
  ],
  [
    "Nebraska",
    "31"
  ],
  [
    "Nevada",
    "32"
  ],
  [
    "New Hampshire",
    "33"
  ],
  [
    "New Jersey",
    "34"
  ],
  [
    "New Mexico",
    "35"
  ],
  [
    "New York",
    "36"
  ],
  [
    "North Carolina",
    "37"
  ],
  [
    "North Dakota",
    "38"
  ],
  [
    "Ohio",
    "39"
  ],
  [
    "Oklahoma",
    "40"
  ],
  [
    "Oregon",
    "41"
  ],
  [
    "Pennsylvania",
    "42"
  ],
  [
    "Rhode Island",
    "44"
  ],
  [
    "South Carolina",
    "45"
  ],
  [
    "South Dakota",
    "46"
  ],
  [
    "Tennessee",
    "47"
  ],
  [
    "Texas",
    "48"
  ],
  [
    "Utah",
    "49"
  ],
  [
    "Vermont",
    "50"
  ],
  [
    "Virginia",
    "51"
  ],
  [
    "Washington",
    "53"
  ],
  [
    "West Virginia",
    "54"
  ],
  [
    "Wisconsin",
    "55"
  ],
  [
    "Wyoming",
    "56"
  ],
  [
    "Puerto Rico",
    "72"
  ]
]


// Get the states

stateSelector.innerHTML = '';
for (state of states) {
  stateSelector.innerHTML += `<option value="${state[1]}">${
    state[0]
    }</option>`;
};




stateSelector.addEventListener("change", getCounties);

countySelector.addEventListener("change", getTags);

// get counties
async function getCounties() {

  // https://api.census.gov/data/2017/acs/acs1?get=NAME,B00001_001E&for=county:020&in=state:02&key=YOUR_KEY_GOES_HERE
  const counties = await fetch(
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
var randValues;
let censusItems = [];

async function getTags() {
  const tagVars = await fetch(`
  https://api.census.gov/data/2017/acs/acs1/subject/variables.json
  `).then(tagVars =>
    tagVars.json().then(tagVars => {

      let allValues = Object.entries(tagVars.variables); //create an array of arrays
      //create an array of objects
      var censusValues = allValues.map((val, i) => ({ name: val[1].label, censusKey: val[0], category: val[1].concept, k: i }));

      // get 20 random values
      for (var i = 0; i < 20; i++) {
        censusItems.push(censusValues[Math.floor(Math.random() * censusValues.length)]);
      }
      mainQuery(censusItems);
    }
    )
  );
}
getTags();
function mainQuery(randVars) {

  let newVar = "";
  // Get a string of census vairables
  const newQVars = randVars.map(randVar => {
    newVar += "," + randVar.censusKey;
  });

  setTimeout(getVariables(), 300);
  function getVariables() {
    const county = fetch(`
    https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${newVar}&for=county:${countySelector.value}&in=state:${stateSelector.value}&key=${key}`);

    const state = fetch(
      `https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${newVar}&for=state:${stateSelector.value}&key=${key}`
    );
    const country = fetch(
      `https://api.census.gov/data/2017/acs/acs1/subject?get=NAME${newVar}&for=us:1&key=${key}`
    );

    Promise.all([county, state, country])
      // Transform promise with .then, which is unformatted
      .then(
        responses => {
          return Promise.all(responses.map(res => res.json()))
        })

      .then(res => {
        for (const [i, itemName] of randVars.entries()) {
          gridSelector.innerHTML += `<div class="gridItem"> Property: ${itemName[0][1].label}</br>
          County: ${res[0][1][i + 1]} </br>
          State:${res[1][1][i + 1]} </br>
          Country: ${res[2][1][i + 1]}
            </div>
                `
        }
      });
  }

  getTags();

}


