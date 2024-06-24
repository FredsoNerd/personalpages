// https://www.twosixlabs.com/6-ways-visualize-graphs/

function define_standard_viewbox(){
  // define the best viewbox to use
  var xmin=10**10, ymin=10**10, xmax=-xmin, ymax=-ymin;
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];

    xmax = Math.max(xmax, node.position[0]);
    xmin = Math.min(xmin, node.position[0]);
    ymax = Math.max(ymax, node.position[1]);
    ymin = Math.min(ymin, node.position[1]);

  }
  xmin -=wid/10;
  xmax +=wid/10;
  ymin -=hei/10;
  ymax +=hei/10;

  // define viewbox
  viewbox  = xmin + " " + ymin + " ";
  viewbox += (xmax - xmin) + " ";
  viewbox += (ymax - ymin);
};

function define_line_edges(){
  paths = [];
  for(let i in edges){
    var node_i = edges[i][0];
    var node_j = edges[i][1];

    var path = "";
    path += "M " + node_i.position[0] + " " + node_i.position[1];
    path += " L "+ node_j.position[0] + " " + node_j.position[1];

    paths[i] = path;
  }
}

var c = 0;
function update_simple_random(){

  // do nothing by purpose
  if(c == 0){
    for(let i in nodes){
      var node = nodes[i];
      node.position[0] = wid * Math.random();
      node.position[1] = hei * Math.random();
    }
    c++;
  }

  define_standard_viewbox();
  define_line_edges();
};

function update_circle_random(){
  // randomly in a weel
  var d = 12;
  var r = d * n / Math.PI;

  if(c==0){
    for(let i in nodes){
      var node = nodes[i];
      var teta = Math.random() * 2 * Math.PI;
      node.position[0] = Math.random() * r * Math.cos(teta);
      node.position[1] = Math.random() * r * Math.sin(teta);
    }
    c++;
  }

  define_standard_viewbox();
  define_line_edges();
};

function update_radial_force(){
  for(var i = 0; i<10; i++){
    update_radial_force_();
  }
}

function update_radial_force_(){
  if(c < 25){update_radial(); }c++;
  // graph display function aims to realocate objects
  // as dynamic between repulsion and tension forces

  var dt = 0.01;                  // time delay
  var krp = 10**3;             // repulsion constant
  var kel = 10;             // elastic constant
  var L = 0;                  // elastic rest length

  var resulting = [];          // resulting vector
  for(var i = 0; i < n; i++){
    var node_i = nodes[i];
    var xi = node_i.position[0] / 100;
    var yi = node_i.position[1] / 100;

    // repulsion force by each node
    for(var j = 0; j < n; j++){
      if(i == j) continue;

      var node_j = nodes[j];
      var xj = node_j.position[0] / 100;
      var yj = node_j.position[1] / 100;

      var d = ((xi-xj)**2 + (yi-yj)**2)**(1/2);
      var rf = krp / d**2;
      var rfx = rf * (xi-xj) / d;  // resulting force x
      var rfy = rf * (yi-yj) / d;  // resulting force y

      resulting[i] = [rfx, rfy];
    }

    // tracion force by edges
    for(var j = 0; j < node_i.neighbours.length; j++){
      var node_j = node_i.neighbours[j];
      var xj = node_j.position[0] / 100;
      var yj = node_j.position[1] / 100;

      var d = ((xi-xj)**2 + (yi-yj)**2)**(1/2);

      var rf = kel * (L - d);
      var rfx = rf * (xi-xj) / d;  // resulting force x
      var rfy = rf * (yi-yj) / d;  // resulting force y

      resulting[i][0] += rfx;
      resulting[i][1] += rfy;
    }
  }
  for(var i = 0; i < n; i++){
    // realocanting vertex
    var node = nodes[i];
    node.position[0] += dt**2 * resulting[i][0];
    node.position[1] += dt**2 * resulting[i][1];
  }

  define_standard_viewbox();
  define_line_edges();
};

function update_random_force(){
  for(var i = 0; i<10; i++){
    update_random_force_();
  }
}

function update_random_force_(){
  if(c==0) update_simple_random();
  // graph display function aims to realocate objects
  // as dynamic between repulsion and tension forces

  var dt = 0.01;                  // time delay
  var krp = 1000;             // repulsion constant
  var kel = 10;             // elastic constant
  var L = 10;                  // elastic rest length

  var resulting = [];          // resulting vector
  for(var i = 0; i < n; i++){
    var node_i = nodes[i];
    var xi = node_i.position[0] / 100;
    var yi = node_i.position[1] / 100;

    // repulsion force by each node
    for(var j = 0; j < n; j++){
      if(i == j) continue;

      var node_j = nodes[j];
      var xj = node_j.position[0] / 100;
      var yj = node_j.position[1] / 100;

      var d = ((xi-xj)**2 + (yi-yj)**2)**(1/2);
      var rf = krp / d**2;
      var rfx = rf * (xi-xj) / d;  // resulting force x
      var rfy = rf * (yi-yj) / d;  // resulting force y

      resulting[i] = [rfx, rfy];
    }

    // tracion force by edges
    for(var j = 0; j < node_i.neighbours.length; j++){
      var node_j = node_i.neighbours[j];
      var xj = node_j.position[0] / 100;
      var yj = node_j.position[1] / 100;

      var d = ((xi-xj)**2 + (yi-yj)**2)**(1/2);

      var rf = -kel * (L - d);
      var rfx = rf * (xi-xj) / d;  // resulting force x
      var rfy = rf * (yi-yj) / d;  // resulting force y

      resulting[i][0] += rfx;
      resulting[i][1] += rfy;
    }
  }
  for(var i = 0; i < n; i++){
    // realocanting vertex
    var node = nodes[i];
    node.position[0] += dt**2 * resulting[i][0];
    node.position[1] += dt**2 * resulting[i][1];
  }

  define_standard_viewbox();
  define_line_edges();
};

function update_horizontal_arc(){
  // drawing over a line with 40ox of distance
  // between adjacent nodes, edges as arcs
  var d = 24;

  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    node.position = [i * d, 0];
  }

  // defines the viewbox and paths
  define_standard_viewbox();

  // baricenter ordering
  for(let i in nodes){
    var node = nodes[i];
    var bari = [];
    bari[0] = node.position[0];
    bari[1] = node.position[1];
    for(let j in node.neighbours){
      var neighbour = node.neighbours[j];
      bari[0] += neighbour.position[0];
      bari[1] += neighbour.position[1];
    }
    bari[0] /= (node.neighbours.length+1);
    bari[1] /= (node.neighbours.length+1);
    node.bari = bari;
  }
  nodes.sort(function(a,b){
    return (a.bari[0]-b.bari[0]);
  });

  // define edges of type arc
  paths = [];
  for(let i in edges){
    var node_i = edges[i][0];
    var node_j = edges[i][1];

    var path = "";
    path += "M " + node_i.position[0] + " " + node_i.position[1];
    path += " A 1 1 0 0 0 " + node_j.position[0] + " " + node_j.position[1];

    paths[i] = path;
  }
};

function update_radial(){
  // drawing over a circle of grants
  // distance d between nodes
  var d = 12;
  var r = d * n / Math.PI;

  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    var x = r * Math.cos(2 * i * Math.PI / n);
    var y = r * Math.sin(2 * i * Math.PI / n);

    node.position = [x, y];
  }

  // defines the viewbox and paths
  define_standard_viewbox();

  // baricenter ordering
  for(let i in nodes){
    var node = nodes[i];
    var bari = [];
    bari[0] = node.position[0];
    bari[1] = node.position[1];
    for(let j in node.neighbours){
      var neighbour = node.neighbours[j];
      bari[0] += neighbour.position[0];
      bari[1] += neighbour.position[1];
    }
    var teta = Math.atan(bari[1]/bari[0]);
    if(teta < 0 && bari[1] < 0) teta += 2 * Math.PI;
    if(teta < 0 && bari[1] > 0) teta += Math.PI;
    if(teta > 0 && bari[1] < 0) teta += Math.PI;

    node.bari = teta;
  }
  nodes.sort(function(a,b){
    return (a.bari - b.bari);
  });

  // define edges of type arc
  paths = [];
  for(let i in edges){
    var node_i = edges[i][0];
    var node_j = edges[i][1];

    // obtain radius of arc
    var xi = node_i.position[0];
    var yi = node_i.position[1];
    var xj = node_j.position[0];
    var yj = node_j.position[1];

    var d = ((xi-xj)**2 + (yi-yj)**2)**(1/2);
    var b = (r**2 - d**2/4)**(1/2);
    var l = r * d / (2 * b);
    if(l==Infinity || isNaN(l)) l = 10**10;

    // vector directon relaytive to origin
    // results of a vetorial product
    var a = xj - xi, b = yj - yi;
    var c = -xi, d = -yi;
    var dir = a*d-b*c;      // determinant

    // make arc st its tangent to radius
    var path = "";
    path += "M " + node_i.position[0] + " " + node_i.position[1];
    path += " A " + l + " " + l + " 30 0 " + (dir>0? 0:1);
    path += node_j.position[0] + " " + node_j.position[1];

    /**var path = "";
    path += "M " + node_i.position[0] + " " + node_i.position[1];
    path += " S 0 0, " + node_j.position[0] + " " + node_j.position[1];**/

    paths[i] = path;
  }
};
