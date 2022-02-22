document.getElementById("submit").addEventListener("click", function(event) {
  event.preventDefault();
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const currency = document.getElementById("currency").value;

  if (origin === "") {
    alert("Origin must be filled out");
    return false;
  }
  else if (destination === "") {
    alert("Destination must be filled out");
    return false;
  }
  else if (origin === destination) {
    alert("Origin must be different than destination")
    return false;
  }

  fetch("https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/cheap?origin=" + origin + "&page=None&currency=" + currency + "&destination=" + destination, {
    "method": "GET",
    "headers": {
      "x-access-token": "2ffd501228722984feea7ceb9cf73388",
      "x-rapidapi-host": "travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com",
      "x-rapidapi-key": "d6f870f92fmsh06e8bba4585eef3p12aa21jsn04f58e145da2"
    }
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);

    let results = "";
    results += "<h2>Flight Details from " + origin +  " to " + destination + "</h2>";
    let dest = json.data[destination];

    for (let i = 0; i < Object.keys(dest).length; i++) {
      let card = "<div class=\"card\"><div class=\"card-body\">";
    
      // Airline
      let code = dest[i].airline;
      let airline = getAirlineName(code).then(response => console.log(response));
      card += "<h3 class=\"airline-title\">Airline: " + airline + "</h3>"
      
      // Price
      card += "<p class=\"price\">Ticket Price: $" + dest[i].price + ".00</p>";

      // Flight Number
      card += "<p class=\"flight-number\">Flight Number: #" + dest[i].flight_number + "</p>";

      // Departure Date
      formattedDate = formatDate(dest[i].departure_at);
      card += "<p class=\"departure-date\">Departure Date: " + formattedDate + "</p>";

      // Return Date
      formattedRetDate = formatDate(dest[i].return_at);
      card += "<p class=\"return-date\">Return Date: " + formattedRetDate + "</p>";
      
      card += "</div></div>";
      results += card;
    }
    console.log(results);
    document.getElementById("flight-data").innerHTML = results;
  });
});
s

function getAirlineName(code) {
  return fetch("https://iata-and-icao-codes.p.rapidapi.com/airline?iata_code=" + code, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "iata-and-icao-codes.p.rapidapi.com",
          "x-rapidapi-key": "d6f870f92fmsh06e8bba4585eef3p12aa21jsn04f58e145da2"
        }
      }).then((response) => response.json())
      .then(json => {
        let airline = json[0].name;
        return airline;
      })
}

function formatDate (date) {
  // Returns a formatted date string
  dateObj = {
    "year":date.substring(0,4),
    "month":date.substring(5,7),
    "day":date.substring(8,10),
    "hour":date.substring(11,13),
    "minute":date.substring(14,16)
  }
  return dateObj.month + "/" + dateObj.day + "/" + dateObj.year + "  " + dateObj.hour + ":" + dateObj.minute;
}