/*
Allow users to get info from the census for their city, and compare with state and national averages
*/

// From a dropdown, select the CATEGORY of info to search for
// Select GEOGRAPHIC AREA

const stateSelector = document.getElementById('stateDropdown');
const groupSelector = document.getElementById('groupDropdown');
const countySelector = document.getElementById('countyDropdown');
const variableSelector = document.getElementById('variableDropdown');
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

// Get groups
const groups = fetch('https://api.census.gov/data/2017/acs/acs1/groups')
  // Transform promise with .then, which is unformatted
  .then(res =>
    // Call it in json, which will return a promise
    res.json()
  )
  .then(res => {
    //   A single array of groups
    for (const object of res.groups) {
      groupSelector.innerHTML += `<option value=${object.name}>${object.description}</option>`;
    }
  });

/* eslint-disable */
groupSelector.addEventListener("change", () => {
  queryValue = groupSelector.value;
  getVariables(queryValue);
  // return queryValue;
});

variableSelector.addEventListener("change", mainQuery);
stateSelector.addEventListener("change", getCounties);

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

// gret variables
function getVariables(groupVal) {
  const values = fetch(
    `https://api.census.gov/data/2017/acs/acs1/groups/${groupVal}`
  )
    // Transform promise with .then, which is unformatted
    .then(values =>
      // Call it in json, which will return a promise
      values.json()
    )
    .then(values => {
      variableSelector.innerHTML = "";
      //   A single array of groups
      items = Object.entries(values.variables);
      // censusKeys = Object.keys(res.variables);
      // console.log(items);
      for (const [censusKey, censusObj] of items) {
        variableSelector.innerHTML += `<option value=${censusKey}>${censusObj.label}</option>`;
      }
    });
}

// // Get groups
// const groups = fetch('https://api.census.gov/data/2017/acs/acs1/subject/groups')
//   // Transform promise with .then, which is unformatted
//   .then(res =>
//     // Call it in json, which will return a promise
//     res.json()
//   )
//   .then(res => {
//     //   A single array of groups
//     for (const object of res.groups) {
//       groupSelector.innerHTML += `<option value=${object.name}>${object.description}</option>`;
//     }
//   });

// Build the main query
// https://api.census.gov/data/2017/acs/acs1?get=NAME,B19301E_001MA&for=state:state&KEY=${key}
// https://api.census.gov/data/2017/acs/acs1?get=NAME,B00001_001E&for=state:01&key=YOUR_KEY_GOES_HERE
// https://api.census.gov/data/2017/acs/acs1/subject/variables/S0102_C01_002E.json
function mainQuery() {
  const county = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,${variableSelector.value}&for=county:${countySelector.value}&in=state:${stateSelector.value}&key=${key}`
  );
  const state = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,${variableSelector.value}&for=state:${stateSelector.value}&key=${key}`
  );

  const country = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,${variableSelector.value}&for=us:1&key=${key}`
  );

  Promise.all([county, state, country])
    // Transform promise with .then, which is unformatted
    .then(
      responses => {
        return Promise.all(responses.map(res => res.json()));
      }
      // Call it in json, which will return a promise
      // answer.json()
    )
    .then(responses => {
      console.log(responses);
      countyDiv.innerHTML += `Value: ${responses[0][1]}`;
      stateDiv.innerHTML += `Value: ${responses[1][1]}`;
      countryDiv.innerHTML += `Value: ${responses[2][1]}`;
    });
}
