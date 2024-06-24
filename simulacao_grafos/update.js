var update_draw_edges = function(){
  // draw each edge from edges[]
  for (var i = 0; i < edges.length; i++){
    var node_i = edges[i][0];
    var node_j = edges[i][1];

    var element = document.getElementById(node_i.id + "_" + node_j.id);

    element.setAttributeNS(null, "d", paths[i]);
    element.setAttributeNS(null, "stroke", (node_i.sick && node_j.sick)? sick : well);
    if(!node_i.alive || !node_j.alive) element.setAttributeNS(null, "stroke", died);
  }
};

var update_draw_nodes = function(){
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];

    // updateing de SVG element
    var element = document.getElementById(node.id);
    element.setAttributeNS(null, "fill", node.sick? sick : well);
    if(!node.alive) element.setAttributeNS(null, "fill", died);

    if(dragging && target_id == node.id) continue;
    element.setAttributeNS(null, "cx", node.position[0]);
    element.setAttributeNS(null, "cy", node.position[1]);
  }
};

var update_viewbox = function(){
  if(zooming) return;
  svg.setAttribute("viewBox", viewbox);
};

var update_nodes = function(){
  for(let i in nodes) nodes[i].update();
};

var opt = 0;
var viewbox = "";
var paths = "";
draw_edges();
draw_nodes();
var can_update = true;
var update = function(){
  if(!can_update) return;
  //while (svg.lastChild) svg.removeChild(svg.lastChild);
  switch (opt) {
    case "1": update_radial_force(); break;
    case "2": update_radial(); break;
    case "3": update_horizontal_arc(); break;
    case "4": update_circle_random(); break;
    case "5": update_random_force(); break;
    default: update_simple_random();
  }
  update_nodes();
  update_draw_edges();
  update_draw_nodes();
  update_viewbox();
};

function change_option(){
  opt = document.getElementById("options").value;
  c = 0;
}

setInterval(update, 100);
