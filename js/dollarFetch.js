// Selectors object
const elements = {
  dollarNow: document.querySelector("#dollarNow"),
  dollarBlueNow: document.querySelector("#dollarBlueNow"),
  formDollar: document.querySelector("#formDollar"),
  inputPrice: document.querySelector("#inputPrice"),
  currency: document.querySelector("#currency"),
  arsValue: document.querySelector("#arsValue"),
  iva25Span: document.querySelector("#iva25Span"),
  iva45Span: document.querySelector("#iva45Span"),
  totalIva: document.querySelector("#totalIva"),
  total: document.querySelector("#total"),
  printButton: document.querySelector("#printButton"),
};

// Prices incialization
let prices = {
  dollarPrice: 0,
  dollarBluePrice: 0,
  euroPrice: 0,
  btcPrice: 0,
  ethPrice: 0,
  bnbPrice: 0,
};

// Generic function to fetch
async function fetchPrice(url, symbol = null) {
  const response = await fetch(url);
  const data = await response.json();
  return symbol ? parseFloat(data[symbol]) : parseFloat(data.price || data.venta);
}

// Fetch prices from APIs
async function fetchAllPrices() {
  prices.dollarPrice = await fetchPrice("https://dolarapi.com/v1/dolares/oficial", "venta");
  prices.dollarBluePrice = await fetchPrice("https://dolarapi.com/v1/dolares/blue", "venta");
  prices.euroPrice = await fetchPrice("https://api.binance.com/api/v1/ticker/price?symbol=EURUSDT");
  prices.btcPrice = await fetchPrice("https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT");
  prices.ethPrice = await fetchPrice("https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT");
  prices.bnbPrice = await fetchPrice("https://api.binance.com/api/v1/ticker/price?symbol=BNBUSDT");

  updateDollarUI();
}

// Print function
function updateDollarUI() {
  elements.dollarNow.textContent = prices.dollarPrice.toFixed(2);
  elements.dollarBlueNow.textContent = prices.dollarBluePrice.toFixed(2);
}

// Calculate price if fiat, and, if crypto, 0
function calculateAndUpdateUI(price, typeCurrency) {
  const iva25Value = typeCurrency === "fiat" ? price * 0.25 : 0;
  const iva45Value = typeCurrency === "fiat" ? price * 0.45 : 0;
  const totalIvaValue = iva25Value + iva45Value;

  elements.iva25Span.textContent = `ARS ${iva25Value.toLocaleString("es-AR")}`;
  elements.iva45Span.textContent = `ARS ${iva45Value.toLocaleString("es-AR")}`;
  elements.totalIva.textContent = `ARS ${totalIvaValue.toLocaleString("es-AR")}`;
  elements.total.textContent = `ARS ${(price + totalIvaValue).toLocaleString("es-AR")}`;
}

// Form submit handler, prevents reload, and calculates price
function handleSubmit(event) {
  event.preventDefault();
  const inputValue = parseFloat(elements.inputPrice.value);
  if (isNaN(inputValue)) return;

  let newPrice = 0;
  let typeCurrency = "fiat";

  switch (elements.currency.value) {
    case "USD":
      newPrice = inputValue * prices.dollarPrice;
      break;
    case "USD Blue":
      newPrice = inputValue * prices.dollarBluePrice;
      typeCurrency = "blue";
      break;
    case "EUR":
      newPrice = inputValue * prices.euroPrice * prices.dollarPrice;
      break;
    case "BTC":
      newPrice = inputValue * prices.btcPrice * prices.dollarBluePrice;
      typeCurrency = "crypto";
      break;
    case "ETH":
      newPrice = inputValue * prices.ethPrice * prices.dollarBluePrice;
      typeCurrency = "crypto";
      break;
    case "BNB":
      newPrice = inputValue * prices.bnbPrice * prices.dollarBluePrice;
      typeCurrency = "crypto";
      break;
    case "ARS":
    default:
      newPrice = inputValue;
  }

  elements.arsValue.textContent = `ARS ${newPrice.toLocaleString("es-AR")}`;
  calculateAndUpdateUI(newPrice, typeCurrency);
}

// Print function in spans
function handleInputClear() {
  if (elements.inputPrice.value === "") {
    elements.arsValue.textContent = "";
    elements.iva25Span.textContent = "";
    elements.iva45Span.textContent = "";
    elements.totalIva.textContent = "";
    elements.total.textContent = "ARS 0";
  }
}

// Initialize
fetchAllPrices();
setInterval(fetchAllPrices, 100000);

// Event Listeners
elements.formDollar.addEventListener("submit", handleSubmit);
elements.inputPrice.addEventListener("input", handleInputClear);
elements.printButton.addEventListener("click", print);
