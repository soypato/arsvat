const dollarNow = document.querySelector("#dollarNow"),
formDollar = document.querySelector("#formDollar"),
inputPrice = document.querySelector("#inputPrice"),
writingInput = document.querySelector("#writingInput"),
iva30Span = document.querySelector("#iva30Span"),
iva35Span = document.querySelector("#iva35Span"),
dollarValue = document.querySelector("#dollarValue"),
totalIva = document.querySelector("#totalIva"),
total = document.querySelector("#total"),
printButton = document.querySelector('#printButton');

let dollarPrice, arsToDollar, iva30Value, iva35Value, totalIvaValue, totalValue;

let variableDollar;

async function dollarFetch() {
    const response = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
    const data = await response.json();
    let dollarData =  data[0].casa.venta;
    let dollarBlueData = data[3].casa.venta;
    dollarNow.innerHTML = `🟢 Cotizaciones: ARS ${dollarData} (BCRA/Venta) - ARS ${dollarBlueData} (Blue/Venta)`
    return dollarData;
  }

dollarFetch()

inputPrice.addEventListener("input", async (e) => {
	writingInput.innerHTML = `USD ${inputPrice.value}` 
	
	dollarPrice = await dollarFetch();
	arsToDollar = inputPrice.value * Math.round(parseInt(dollarPrice));

	dollarValue.innerHTML = `= ARS ${arsToDollar}`;

	iva30Value = Number((arsToDollar * 0.3));
	iva35Value = Number((arsToDollar * 0.35));

	iva30Span.innerHTML = `+ ARS ${iva30Value.toFixed(2)}`;
	iva35Span.innerHTML = `+ ARS ${iva35Value.toFixed(2)}`;
	
	totalIvaValue = (iva30Value + iva35Value).toFixed(2); 
  totalIva.innerHTML = `= ARS ${totalIvaValue}`;

	totalValue = (arsToDollar + iva30Value + iva35Value);  
  total.innerHTML = `ARS ${totalValue.toFixed(2)}`;
})

printButton.addEventListener('click', () => {
  print()
})



// https://www.dolarsi.com/api/api.php?type=valoresprincipales
// data[0].casa.venta