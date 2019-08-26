/*
Allow users to get info from the census for their city, and compare with state and national averages
*/

// From a dropdown, select the CATEGORY of info to search for
// Select GEOGRAPHIC AREA

const stateSelector = document.getElementById('stateDropdown');
const groupSelector = document.getElementById('groupDropdown');
const variableSelector = document.getElementById('variableDropdown');
const resultsDiv = document.querySelector('.results');
const compareiv = document.querySelector('.USA');
// var queryValue;
/* eslint-enable */

// Get the states
const res = fetch(
  'https://api.census.gov/data/2017/acs/acs1/subject?get=NAME&for=state:*&key=80b3fa4b725c86f64a742f9bc799b2cb861e1644'
)
  // Transform promise with .then, which is unformatted
  .then(res =>
    // Call it in json, which will return a promise
    res.json()
  )
  .then(res => {
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
// https://api.census.gov/data/2017/acs/acs1?get=NAME,B19301E_001MA&for=state:state&KEY=80b3fa4b725c86f64a742f9bc799b2cb861e1644
// https://api.census.gov/data/2017/acs/acs1?get=NAME,B00001_001E&for=state:01&key=YOUR_KEY_GOES_HERE
// https://api.census.gov/data/2017/acs/acs1/subject/variables/S0102_C01_002E.json
function mainQuery() {
  const answer = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,${variableSelector.value}&for=state:${stateSelector.value}&key=80b3fa4b725c86f64a742f9bc799b2cb861e1644`
  );
  const compare = fetch(
    `https://api.census.gov/data/2017/acs/acs1?get=NAME,${variableSelector.value}&for=us:1&key=80b3fa4b725c86f64a742f9bc799b2cb861e1644`
  );

  Promise.all([answer, compare])
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
      resultsDiv.innerHTML += `Value: ${responses[0][1]}`;
      compareiv.innerHTML += `Value: ${responses[1][1]}`;
    });
}
