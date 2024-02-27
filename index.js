// convert to typescript
// use classes

(async function () {
  
  const currencyTypeCounters = {};
  const statisticsContainer = $('.statisticsContainer');
  
  async function createTablesAndStatistics(states) {
    const mainData = getPopulationData(states);
    const regionData = await getRegionData(states);
    mainData.forEach((state) => createRow('name', 'citizens', 'populationTable', state));
    regionData.forEach((state) => createRow('region', 'numOfStates', 'regionTable', state));
    getCurrencies(states);
    getOtherData(states);
  }
  
  function getPopulationData(states) {
    return states.map((state) => ({
      name: state.name.official,
      citizens: state.population,
    }))}

  async function getRegionData(states) {
    return await Promise.all(
      states.map(async (state) => ({
        region: state.region,
        numOfStates: (await getRegionStates(state.region)).length,
      })))};

    function getOtherData(states) {
      let sumOfCitizens = 0;
      states.forEach((state) => sumOfCitizens += state.population);
      statisticsContainer.append($('<h4>More Data:</h4>'));
      statisticsContainer.append(`<li><strong>Total states result:</strong> ${states.length}</li>`);
      statisticsContainer.append(`<li><strong>Sum of citizens count:</strong> ${sumOfCitizens}</li>`);
      statisticsContainer.append(`<li><strong>Average of citizens count:</strong> ${Math.floor(sumOfCitizens / states.length)}</li>`);
    }

  function getCurrencies(states) {
    statisticsContainer.append($('<h4>States Currencies:</h4>'));
    states.forEach((state) => {
      if (!state.currencies) 
        return currencyTypeCounters['No currency'] = (currencyTypeCounters['No currency'] || 0) + 1;
      let keys = Object.keys(state.currencies);
      keys.forEach((key) => currencyTypeCounters[key] = (currencyTypeCounters[key] || 0) + 1)});
      Object.keys(currencyTypeCounters).forEach((key) => statisticsContainer.append(`<li><strong>${key}</strong> ${currencyTypeCounters[key]}</li>`));
  }

  async function getRegionStates(region) {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    return await response.json();
  }

  function createRow(nameOrRegion, citizensOrStates, tableClass, data) {
    const tr = $('<tr>');
    const tdName = $('<td>').text(data[nameOrRegion]);
    tr.append(tdName, $('<td>').text(data[citizensOrStates]));
    $(`.${tableClass} tbody`).append(tr);
  }

  async function getStates(input) {
    const response = await fetch(
      `https://restcountries.com/v3.1/${input}`
    );
    const states = await response.json();
    createTablesAndStatistics(states);
  }

  $('.getStateBtn').on('click', function () {
    getStates(`name/${$('.searchStateInput').val()}`);
  });

  $('.allStatesBtn').on('click', function () {
    getStates('all');
  })})();
