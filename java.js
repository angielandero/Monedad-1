const apiUrl = 'https://api.exchangerate-api.com/v4/latest/'; // API URL for exchange rates
const formElement = document.querySelector('form');
const amountInputElement = document.querySelector('#amount');
const fromCurrencySelectElement = document.querySelector('#from');
const toCurrencySelectElement = document.querySelector('#to');
const resultElement = document.querySelector('#result');

// Add options to the select elements
fromCurrencySelectElement.innerHTML = `
  <option value="EUR">Euros (EUR)</option>
  <option value="GBP">British Pounds (GBP)</option>
  <option value="USD">US Dollars (USD)</option>
  <option value="HNL">Honduran Lempiras (HNL)</option>
`;

toCurrencySelectElement.innerHTML = `
  <option value="EUR">Euros (EUR)</option>
  <option value="GBP">British Pounds (GBP)</option>
  <option value="USD">US Dollars (USD)</option>
  <option value="HNL">Honduran Lempiras (HNL)</option>
`;

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const amountValue = amountInputElement.value;
  const fromCurrencyValue = fromCurrencySelectElement.value;
  const toCurrencyValue = toCurrencySelectElement.value;

  if (fromCurrencyValue === 'HNL') {
    // Convert HNL to other currencies
    fetch(`${apiUrl}USD`)
      .then((response) => response.json())
      .then((data) => {
        const usdRate = data.rates[fromCurrencyValue];
        const convertedAmount = amountValue / usdRate;
        fetch(`${apiUrl}USD`)
          .then((response) => response.json())
          .then((data) => {
            const exchangeRate = data.rates[toCurrencyValue];
            const finalConvertedAmount = convertedAmount * exchangeRate;
            resultElement.textContent = `Result: ${finalConvertedAmount.toFixed(2)} ${toCurrencyValue}`;
          })
          .catch((error) => {
            console.error(error);
            resultElement.textContent = 'Error: Unable to convert currency.';
          });
      })
      .catch((error) => {
        console.error(error);
        resultElement.textContent = 'Error: Unable to convert currency.';
      });
  } else {
    // Convert other currencies to HNL or other currencies
    fetch(`${apiUrl}${fromCurrencyValue}`)
      .then((response) => response.json())
      .then((data) => {
        const exchangeRate = data.rates[toCurrencyValue];
        const convertedAmount = amountValue * exchangeRate;
        resultElement.textContent = `Result: ${convertedAmount.toFixed(2)} ${toCurrencyValue}`;
      })
      .catch((error) => {
        console.error(error);
        resultElement.textContent = 'Error: Unable to convert currency.';
      });
  }
});