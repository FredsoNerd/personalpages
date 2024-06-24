// podemos discutir o R_0 da doenca: numero de reprodutividade
// curvas gráficas de crescimento em comparação ao modelo teórico!
// adicionar mortes além da quarentena

// gerenate graph by simple
// preferred attachment

var nodes = [];             // the nodes list
var edges = [];             // node_i's edges
var aux = [0];
var n = 0;

var is_conex = false;

function graph_generate(n_nodes){
  n = n_nodes;                 // nodes quantity

  // add each new node to graph
  // by preferred attachment
  nodes.push(new Node(false, 0));
  for(var i = 1; i < n; i++){
    // initializes the nodes
    var node = new Node(false, i);
    nodes.push(node);

    // chose first node to atache
    var len = aux.length;
    var ind_1 = Math.floor(Math.random() * len);
    var neighbour_1 = nodes[aux[ind_1]];
    populate(node, neighbour_1, i);

    if(!is_conex) continue;
    // chose second node to atache
    if(nodes.length > 2){
      var len = aux.length;
      var ind_2 = 0;
      do{
        ind_2 = Math.floor(Math.random() * len);
      }while(aux[ind_2] == aux[ind_1] || aux[ind_2] == i);
      var neighbour_2 = nodes[aux[ind_2]];
      populate(node, neighbour_2, i);
    }
  }
}

function populate(node, neighbour, i){
  // to node_i, add new edge
  node.neighbours.push(neighbour);
  neighbour.neighbours.push(node);
  edges.push([node, neighbour]);

  // add elements to preference list
  aux.push(i);
  aux.push(aux[i]);
}

graph_generate(250);
