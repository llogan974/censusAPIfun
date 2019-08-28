/*
Allow users to get info from the census for their city, and compare with state and national averages
*/

// From a dropdown, select the CATEGORY of info to search for
// Select GEOGRAPHIC AREA

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

/* eslint-disable */
tagSelector.addEventListener("change", () => {
  queryValue = tagSelector.value;
  getTags(queryValue);
  // return queryValue;
});

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

// get tags
const tags = fetch(
  `https://api.census.gov/data/2017/acs/acs1/subject/tags.json`
).then(tags =>
  tags.json().then(tags => {
    for (items of tags.tags) {
      tagSelector.innerHTML += `<option value = ${items}>${items}</option>`;
    }
  })
);

var rand = "";
// On change of tags, run this finction
function getTags() {
  const tagValue = tagSelector.value;
  let myArray = [];
  const tagVars = fetch(`
  https://api.census.gov/data/2017/acs/acs1/subject/tags/${tagValue}.json
  `).then(tagVars =>
    tagVars.json().then(tagVars => {
      var array2 = myArray.concat(tagVars.items[0].variables);
      getRand(array2);
    })
  );
}

function getRand(arr) {
  for (var i = 0; i < 20; i++) {
    let randItems = arr[Math.floor(Math.random() * arr.length)];
    console.log(randItems);
  }
}
// function mainQuery() {
//   const county = fetch(
//     `https://api.census.gov/data/2017/acs/acs1/profile?get=NAME,${variableSelector.value}&for=county:${countySelector.value}&in=state:${stateSelector.value}&key=${key}`
//   );
//   const state = fetch(
//     `https://api.census.gov/data/2017/acs/acs1/profile?get=NAME,${variableSelector.value}&for=state:${stateSelector.value}&key=${key}`
//   );

//   const country = fetch(
//     `https://api.census.gov/data/2017/acs/acs1/profile?get=NAME,${variableSelector.value}&for=us:1&key=${key}`
//   );

//   Promise.all([county, state, country])
//     // Transform promise with .then, which is unformatted
//     .then(
//       responses => {
//         return Promise.all(responses.map(res => res.json()));
//       }
//       // Call it in json, which will return a promise
//       // answer.json()
//     )
//     .then(responses => {
//       console.log(responses);
//       countyDiv.innerHTML += `Value: ${responses[0][1][1]}`;
//       stateDiv.innerHTML += `Value: ${responses[1][1][1]}`;
//       countryDiv.innerHTML += `Value: ${responses[2][1][1]}`;
//     });
// }
