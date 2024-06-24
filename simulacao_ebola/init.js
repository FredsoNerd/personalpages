// chose first node to be sick
var ind = Math.floor(Math.random() * population.length);
//population[ind].sick = true;
var node = population[ind];
node.infect();
alert("Infection begin in " + data_sim[node.country][COUNTRY])

// we draw de initial objects to be dynamically updated
var namespaceURI = "http://www.w3.org/2000/svg";
//var svg = document.getElementById("svg");
for(let i in data_sim){
  var country = document.getElementById(data_sim[i][COUNTRY]);

  // adding tytles (tooltips) to elements
  var title = document.createElementNS(namespaceURI, "title");
  title.innerHTML = data_sim[i][COUNTRY];

  country.appendChild(title);
}
