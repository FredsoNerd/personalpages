var nodes = [];            // the nodes list
//var res="";

// create conected graph for each country
function populate_countries(n_nodes){
  for(let i in data_sim){
    // generate proportionally to total
    // population in Africa's countries
    var m = n_nodes * data_cou[i][POPULATION]/data_afr[POPULATION];
    generate_graph(m, 1.5, i);

    // clean data about last population
    nodes = [];
    aux = [];
    var d = 0;

    console.log("graph generated " + i);
  }
}

var aux = [];
function generate_graph(n, a, country){
  // generate graph by Configuration Model
  var node = new Node(false, country);
  nodes.push(node);
  data_sim[country][NODES] = [node];

  for(var i = 1; i < n; i++){
    node = new Node(false, country);
    nodes.push(node);
    data_sim[country][NODES].push(node);

    // neighbours quantity by distribution
    var u = Math.random();
    //var neighbours = -Math.log(1 - u) / a;
    var neighbours = (1-u)**(1/(1-a));
    for(var j = 0; j < neighbours; j++)
      aux.push(node);

    //res += " " + Math.ceil(neighbours);
  }
  // for each node, chose the neighbours
  while (aux.length > 1) {
    ind_1 = Math.floor(Math.random() * aux.length);
    var node_1 = aux[ind_1];
    aux.splice(aux.indexOf(node_1), 1);

    ind_2 = Math.floor(Math.random() * aux.length);
    var node_2 = aux[ind_2];
    aux.splice(aux.indexOf(node_2), 1);

    // put those together
    populate(node_1, node_2);
  }
}

function populate(node, neighbour){
  // to node_i, add new edge
  node.neighbours.push(neighbour);
  neighbour.neighbours.push(node);
  //edges.push([node, neighbour]);
}

populate_countries(100);

// make the graph as a conected
for(var i = 0; i < 0.05 * data_sim_afr[POPULATION]; i++){
  // chose a random node
  var node_1 = population[Math.floor(Math.random() * population.length)];

  // chose neighbour country
  var cou = data_cou[node_1.country][NEIGHBOURS].length * Math.random();
  cou = Math.floor(cou);
  cou = data_cou[node_1.country][NEIGHBOURS][cou];

  // chose seccond node to atache
  var ind = Math.floor(data_sim[cou][NODES].length * Math.random());
  var node_2 = data_sim[cou][NODES][ind];

  populate(node_1, node_2, 0);
}

console.log("Grafo gerado com sucesso!")
