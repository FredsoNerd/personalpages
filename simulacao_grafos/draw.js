// we draw de initial objects to be dynamically updated

var namespaceURI = "http://www.w3.org/2000/svg";
var svg = document.getElementById("svg");

//var sick = '#ff7777';
var sick = '#C71A20cc';
var well = '#5599ffcc';
var died = '#777777cc';

var draw_edges = function(){
  for (var i = 0; i < edges.length; i++){
    var node_i = edges[i][0];
    var node_j = edges[i][1];

    var element = document.createElementNS(namespaceURI, "path");
    element.setAttributeNS(null, "id", node_i.id + "_" + node_j.id);
    element.setAttributeNS(null, "stroke-width", 1);
    element.setAttributeNS(null, "fill", "none");

    // adding tytles (tooltips) to elements
    var title = document.createElementNS(namespaceURI, "title");
    title.innerHTML = "edge #" + node_i.id + " to #" + node_j.id;

    element.appendChild(title);
    svg.appendChild(element);
  }
};

var draw_nodes = function(){
  // draw each edge from edges[]
  for (var i = 0; i < nodes.length; i++){
    var node = nodes[i];

    // creating and showing de SVG element
    var element = document.createElementNS(namespaceURI, "circle");
    element.setAttributeNS(null, "id", node.id);
    element.setAttributeNS(null, "class", "drag");
    //element.setAttributeNS(null, "r", 4 * Math.log(node.neighbours.length));
    element.setAttributeNS(null, "r", 2 * (node.neighbours.length)**(1/2));

    // makes element interactive
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('mousemove', drag);
    element.addEventListener('mouseup', endDrag);
    element.addEventListener('mouseleave', endDrag);

    // adding tytles (tooltips) to elements
    var title = document.createElementNS(namespaceURI, "title");
    title.innerHTML = "node #" + node.id;
    element.appendChild(title);
    svg.appendChild(element);
  }
};
