var dragging = false;
var dragged = false;
var zooming = false;
var viewbox_z = "";
var offset = {x:0,y:0};
var target_id = -1;

function startDrag(evt) {
  dragging = true;

  // defines the offset
  var CTM = svg.getScreenCTM();
  offset.x = (evt.clientX - CTM.e) / CTM.a;
  offset.y = (evt.clientY - CTM.f) / CTM.d;
  offset.x -= parseFloat(evt.target.getAttributeNS(null, "cx"));
  offset.y -= parseFloat(evt.target.getAttributeNS(null, "cy"));

  target_id = evt.target.id;
}

function drag(evt) {
  if(dragging){
    dragged = true;

    // uses magic to solve the problems
    var CTM = svg.getScreenCTM();
    var coordx = (evt.clientX - CTM.e) / CTM.a;
    var coordy = (evt.clientY - CTM.f) / CTM.d;

    evt.target.setAttributeNS(null, "cx", coordx - offset.x);
    evt.target.setAttributeNS(null, "cy", coordy - offset.y);
    for(let i in nodes){
      if(nodes[i].id == evt.target.id){
        nodes[i].position = [coordx - offset.x, coordy-offset.y];
        break;
      }
    }
  }
}

function endDrag(evt) {
  dragging = false;
  target_id = -1;
}

svg.onclick = zoom_down;
document.onkeydown = key_down;
function key_down(evt){
  var zoom_label = document.getElementById("zoom");
  // case restore: "z"
  if(evt.keyCode == 90){
    zoom_label.innerHTML = "zoom (+)";
    zooming = "z";
  }
  // case restore: "x"
  if(evt.keyCode == 88){
    zoom_label.innerHTML = "zoom (-)";
    zooming = "x";
  }
  if(evt.keyCode == 90 && evt.ctrlKey){
    zoom_label.innerHTML = "";
    zooming = false;
    viewbox_z = "";
  }
}
function zoom_down(evt){
  if(dragged){dragged = false; return;}
  var CTM = svg.getScreenCTM();
  offset.x = (evt.clientX - CTM.e) / CTM.a;
  offset.y = (evt.clientY - CTM.f) / CTM.d;

  var view = viewbox_z == ""?
  viewbox.split(" ") :
  viewbox_z.split(" ");

  // case zoom: "x+click"
  if(zooming =="x"){
    view[0] = (4*view[0]-offset.x) / 3;
    view[1] = (4*view[1]-offset.y) / 3;
    view[2] = view[2] * 1.25;
    view[3] = view[3] * 1.25;
    //view[2] = view[2] * 1.25;
    //view[3] = view[3] * 1.25;
    //view[0] = offset.x - view[2]/2;
    //view[1] = offset.y - view[3]/2;
  }
  // case zoom: "z+click"
  if(zooming == "z"){
    view[0] = (3*view[0]+offset.x) / 4;
    view[1] = (3*view[1]+offset.y) / 4;
    view[2] = view[2] / 1.25;
    view[3] = view[3] / 1.25;
  }
  viewbox_z = "";
  for(let i in view) viewbox_z += view[i] + " ";
  svg.setAttribute("viewBox", viewbox_z);
}

function die_freq(){
  d = (document.getElementById("die_freq").value/100)**2;
  document.getElementById("d").innerHTML =
  "Probabilidade de morte após a infecção "+
  "ocorrer no circlo de 0% a 10%: " + Math.floor(d*100) + "%";
}

function tra_freq(){
  p = (document.getElementById("tra_freq").value/100)**2;
  document.getElementById("p").innerHTML =
  "Probabilidade de ocorrer contaminação na "+
  "visinhança. Valor de 0% a 10%: " + Math.floor(p*100) + "%";
}
function nodes_number(){
  while (svg.lastChild) svg.removeChild(svg.lastChild);
  //for(let i in nodes) nodes[i].neighbours = [];
  edges = [];
  nodes  = [];
  aux = [0];

  n = document.getElementById("nodes_number").value;
  can_update = false;
  graph_generate(Math.floor(n**2 / 10));
  can_update = true;
  init();
  draw_edges();
  draw_nodes();
  c = 0;

  document.getElementById("n").innerHTML =
  "Quantidade de nós no grafo (de 0 a 1000 nós): " + n + " nós";
}

function init(){
  for(let i in nodes){
    var node = nodes[i];
    node.sick = false;
    node.alive = true;
  }
  var i = Math.floor(Math.random() * nodes.length);
  nodes[i].sick = true;

  tra_freq();
  die_freq();
}
