let txtCurrentDate = document.querySelector("#currentDate");
let txtChileanCLP = document.querySelector("#txtChileanCLP");
let dropdownCurrencyes = document.querySelector("#dropdownCurrencyes");
let txtConvertedValue = document.querySelector("#txtConvertedValue");
let txtCurrentCurrency = document.querySelector("#txtCurrentCurrency");
let btnConvert = document.querySelector("#btnConvert");
let txtCurrentValue = document.querySelector("#txtCurrentValue");

const convertCurrency = async (valueToConvert, currencyId = "dolar") => {
  try {
    response = await fetch(`https://mindicador.cl/api/${currencyId}`);
    const mindicador = await response.json();

    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      let convertedValue = (1 / mindicador.serie[0].valor) * valueToConvert;
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

// change txtCurrentCurrency when dropdownCurrencyes is changed
dropdownCurrencyes.addEventListener("change", async () => {
  txtCurrentCurrency.innerHTML = dropdownCurrencyes.value;
  txtConvertedValue.innerHTML = await convertCurrency(
    txtChileanCLP.value,
    dropdownCurrencyes.value
  );
  fillChart(dropdownCurrencyes.value);
});

// convert currency when txtChileanCLP is changed
txtChileanCLP.addEventListener("change", async () => {
  txtConvertedValue.innerHTML = await convertCurrency(
    txtChileanCLP.value,
    dropdownCurrencyes.value
  );
});

// change txtCurrentValue when txtChileanCLP is changed
txtChileanCLP.addEventListener("change", () => {
  let value = parseInt(txtChileanCLP.value);
  txtCurrentValue.innerHTML = value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
});

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
      console.log(data);
      createChart(data);
    }
  } catch (error) {
    console.log(error);
  }
};

function createChart(chartData) {
  console.log(chartData);
  // invert chartData
  chartData.reverse();

  const labels = chartData.map((item) => item.date);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: chartData.map((item) => item.value),
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

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
  fillChart();
});
