async function dollarFetch() {
    const response = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
    const data = await response.json();
    let dollarData =  data[0].casa.venta;
    return Promise.resolve(dollarData);
  }



// https://www.dolarsi.com/api/api.php?type=valoresprincipales
// data[0].casa.venta