var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    printResult(
      options.method + ' ' + options.url + '\n' +
      x.status + ' ' + x.statusText + '\n\n' +
      (x.responseText || '')
    );
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.send(options.data);
}

let urls = [
    {
      name: "Tururu",
      links:[
              'https://www.strefakierowcy.pl/18043,filtron-op531.html?fbclid=IwAR1W9izJNoKeDPWo5KVfsn3maiMD9de_AKmAzFwCByn2SbA7dntNSLBpz3Y',
              'https://www.iparts.pl/czesc/filtr-oleju-filtron-op531,0-256-op531-146228.html?fbclid=IwAR1qwd5t8SPioJm_jI-c5YaDLaVbN6V5fMCP1ckedl9dRxenWNQnEVaVdAE',
              'https://www.abc-filter.pl/sklep/filtry-oleju/13596-filtron-op-531-filtr-oleju-filtron-op531.html?fbclid=IwAR3ykpAzgkAmct0zThu_qkwTUEDiJCOslNkdCnkEdTxj9_SXfTJwfK8Ji10'
            ]
    },
];

function loopThrough() {
urls.forEach(function(obj){
  let name = obj.name;
  let links = obj.links;
  let button = document.createElement("BUTTON");
  let buttonText = document.createTextNode(name);
  button.appendChild(buttonText);
  button.onclick = function() {
    test(links);
  }
  document.body.appendChild(button);
})
}

function test(links){
  let infoDiv = document.getElementById('info');
  infoDiv.innerHTML = "";
  links.forEach(function(item, index){
    doCORSRequest({
      method: 'GET',
      url: item
    }, function printResult(result) {
      if(index===0){
        getData(
          result,
          '<span class="price-container">',
          'Numer katalogowy:',
          '<',
          '<',
          34,
          'Strefa Kierowcy'
        );
      } else if(index===1){
        getData(
          result,
          '<span itemprop="price" content="',
          '<span itemprop="mpn">',
          '"',
          '<',
          0,
          'iParts'
          );
      } else if(index===2){
        getData(
          result,
          '<span itemprop="price" content="',
          '<span itemprop="sku">',
          '"',
          '<',
          0,
          'abc-Filter'
        )
      }
    });
  })
}

function getData(result, priceContainer, idContainer, priceEndStr, idEndStr, idLength, siteName){
  let infoDiv = document.getElementById('info');

  const priceLength = priceContainer.length;
  const idLengthTotal = idContainer.length + idLength;
  const priceStart = result.search(priceContainer) + priceLength;
  const idStart = result.search(idContainer) + idLengthTotal;
  const priceResult = result.slice(priceStart, priceStart + 10);
  const idResult = result.slice(idStart, idStart + 15);
  const priceEnd = priceResult.search(priceEndStr);
  const idEnd = idResult.search(idEndStr);
  const cena = priceResult.slice(0, priceEnd);
  const kod = idResult.slice(0, idEnd);

  infoDiv.innerHTML += `<strong>${siteName}</strong></br>Cena: ${cena} </br>Kod: ${kod} </br></br>`;
}


loopThrough();