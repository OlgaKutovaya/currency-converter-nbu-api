const NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

let $btnCalculate = document.getElementById('btnCalculate'),
    $inputMoney = document.getElementById('inputMoney'),
    $resultOutput = document.getElementById('resultInfo'),
    $selectCurrency = document.getElementById('selectCurrency'),
    $exchangeCurrency = document.getElementById('exchangeCurrency'),
    $resultCurrency = document.getElementById('resultCurrency'),
    $buyBtn = document.getElementById('buy');

const RATE_PRECISION = 3;
let RATES = {};

$btnCalculate.addEventListener('click', function (event) {
    event.preventDefault();

    let selectedCurrency = $selectCurrency.value;
    if (selectedCurrency === 'none') {
        error('Виберіть валюту');
        return;
    } else {
        $resultOutput.style.color = '#232541';
    }
    let buy = $buyBtn.checked;

    let result = exchange(selectedCurrency, buy, $inputMoney.value);
    if (result) {
        $resultOutput.textContent = result;
    }
});

function exchange(currencyCode, buyOperation, amount) {
    let currency = RATES[currencyCode];
    if (!currency) {
        error('Currency is not supported.');
        return;
    }
    let currencyRate = currency['rate'],
        result;
    if (buyOperation) {
        result = amount / currencyRate;
    } else {
        result = amount * currencyRate;
    }
    return result.toFixed(RATE_PRECISION);
}

function getNBURates() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", NBU_URL, false); // false for synchronous request
    xmlHttp.send(null);
    let currencies = JSON.parse(xmlHttp.responseText);
    currencies.sort(function(s1, s2){
        return s1.txt.localeCompare(s2.txt);
    });
    return currencies;
}

function initNBURates() {
    let currencies = getNBURates();
    for (let currencyIndex in currencies) {
        let currency = currencies[currencyIndex];
        let currencyCode = currency['cc'];
        RATES[currencyCode] = currency;

        createCurrencyOption(currency)
    }
}

function createCurrencyOption(currency) {
    let option = document.createElement('option');
    option.textContent = currency['txt'];
    option.value = currency['cc'];
    $selectCurrency.appendChild(option);
}

function error(errorMessage) {
    $resultOutput.textContent = errorMessage;
    $resultOutput.style.color = '#ad2926';
}

function renderCurrencies() {
    let selectedCurrency = $selectCurrency.value;
    if (selectedCurrency === 'none') {
        return;
    }
    if ($buyBtn.checked) {
        $exchangeCurrency.textContent = 'UAH';
        $resultCurrency.textContent = selectedCurrency;
    } else {
        $exchangeCurrency.textContent = selectedCurrency;
        $resultCurrency.textContent = 'UAH';
    }
}

document.getElementById('buy').addEventListener('click',  renderCurrencies);
document.getElementById('sell').addEventListener('click',  renderCurrencies);
$selectCurrency.addEventListener('click',  renderCurrencies);

initNBURates();