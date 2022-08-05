let txtCurrentDate = document.querySelector("#currentDate");
let txtChileanCLP = document.querySelector("#txtChileanCLP");
let dropdownCurrencyes = document.querySelector("#dropdownCurrencyes");
let txtConvertedValue = document.querySelector("#txtConvertedValue");
let txtCurrentCurrency = document.querySelector("#txtCurrentCurrency");
let btnConvert = document.querySelector("#btnConvert");
let txtCurrentValue = document.querySelector("#txtCurrentValue");
let txtEqualsTo = document.querySelector("#txtEqualsTo");


// capitalize first letter of each word
// copy and paste from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-each-word-capitalize-in-a-string
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

/**
 * Calls mindicador.cl API to get the current value of the selected currency
 *
 * @param {integer} valueToConvert
 * @param {string} currencyId
 * @returns
 */

const convertCurrency = async (valueToConvert, currencyId = "dolar") => {
  try {
    response = await fetch(`https://mindicador.cl/api/${currencyId}`);
    const mindicador = await response.json();

    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      let convertedValue = valueToConvert / mindicador.serie[0].valor;
      return convertedValue.toFixed(5);
    }
  } catch (error) {
    console.log(error);
  }
};

// convert currency when btnConvert is clicked
btnConvert.addEventListener("click", async () => {
  txtConvertedValue.innerHTML = await convertCurrency(
    txtChileanCLP.value,
    dropdownCurrencyes.value
  );
});

// when changed currency, show converted value and fill chart with new data
dropdownCurrencyes.addEventListener("change", async () => {
  txtConvertedValue.innerHTML = await convertCurrency(
    txtChileanCLP.value,
    dropdownCurrencyes.value
  );
  fillChart(dropdownCurrencyes.value);

  // change texts when currency is changed
  changeTexts();
});

// convert currency when txtChileanCLP is changed
txtChileanCLP.addEventListener("change", async () => {
  txtConvertedValue.innerHTML = await convertCurrency(
    txtChileanCLP.value,
    dropdownCurrencyes.value
  );

  // change texts when currency is changed
  changeTexts();
});

// change texts when currency is changed
function changeTexts() {
  if (txtChileanCLP.value === "" || txtChileanCLP.value === " ") {
    txtCurrentCurrency.innerHTML = dropdownCurrencyes.value.capitalize();
    return;
  }
  let value = parseInt(txtChileanCLP.value);
  txtEqualsTo.innerHTML =
    value.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    }) + " Chilean peso equals to";

  txtCurrentCurrency.innerHTML = dropdownCurrencyes.value.capitalize();
}

// gets last 10 values from mindicador.cl API, then calls createChart() function to create a chart
const fillChart = async (selectedCurrency = "dolar") => {
  try {
    response = await fetch(`https://mindicador.cl/api/${selectedCurrency}`);
    const mindicador = await response.json();

    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      // get first 10 days of serie
      let serie = mindicador.serie.slice(0, 10);
      let dates = serie.map((item) => item.fecha);
      let values = serie.map((item) => item.valor);
      // convert dates values to locale string
      dates = dates.map((date) => new Date(date).toLocaleDateString("es-CL"));

      // create an array of objects with dates and values
      let data = [];
      for (let i = 0; i < dates.length; i++) {
        data.push({
          date: dates[i],
          value: values[i],
        });
      }

      createChart(data);
    }
  } catch (error) {
    console.log(error);
  }
};


// create a chart with the data received from mindicador.cl API
function createChart(chartData) {
  // needs to invert chart data to view it from old to new
  // invert chartData
  chartData.reverse();

  // map labels from chartData date
  const labels = chartData.map((item) => item.date);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Ultimos 10 dias",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        // map data from chartData value
        data: chartData.map((item) => item.value),
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  // canvas needs to be destroyed before changed to another currency
  // destroy canvas if it exists
  if (document.getElementById("currencyChart")) {
    document.getElementById("currencyChart").remove();
  }

  // create canvas
  const canvas = document.createElement("canvas");
  canvas.id = "currencyChart";

  document.querySelector("#chart").appendChild(canvas);
  const myChart = new Chart(document.querySelector("#currencyChart"), config);
}

document.addEventListener("DOMContentLoaded", function () {
  txtCurrentDate.innerHTML = moment().format("dddd, MMMM, D");
  txtEqualsTo.innerHTML = txtChileanCLP.value + " Chilean peso equals to:";
  txtCurrentCurrency.innerHTML = dropdownCurrencyes.value.capitalize();
  fillChart();
});
