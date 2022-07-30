let txtCurrentDate = document.querySelector("#currentDate")
let txtChileanCLP = document.querySelector("txtChileanCLP")
let dropdownCurrencyes = document.querySelector("#dropdownCurrencyes")
let txtConvertedValue = document.querySelector("#txtConvertedValue")

const convertCurrency = async(valueToConvert = 1, currencyId = "dolar") => {
    try {
        response = await fetch(`https://mindicador.cl/api`)
        const mindicador = await response.json()

        if (response.status !== 200) {
            throw new Error(response.statusText);
        } else {
            console.log(mindicador.dolar.valor)
            let convertedValue = (1 / mindicador.dolar.valor) * valueToConvert
            console.log(convertedValue.toFixed(4))
            
        }
    } catch (error) {
        console.log(error)
    }
}

convertCurrency();





















const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
];

const data = {
    labels: labels,
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {}
};

const myChart = new Chart(
    document.querySelector("#currencyChart"), config
);





document.addEventListener('DOMContentLoaded', function () {
    txtCurrentDate.innerHTML = moment().format("dddd, MMMM, D")
});

