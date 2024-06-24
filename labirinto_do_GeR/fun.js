// http://www.mazegenerator.net/
var namespaceURI = "http://www.w3.org/2000/svg";

var svg = document.getElementById("svg");
var cursor = document.getElementById("cursor");

var state = {"x":49,"y":0.65};
var states = [];
  
var clear = function(){
  // cleans previous states
  state = {"x":49,"y":0.65};
  states = [];

  draw();
}

var draw = function(){
  var elements = svg.getElementsByClassName("red");
  while(elements.length > 20){
    elements[0].parentNode.removeChild(elements[0]);
  }

  var points = "";
  for (var i = 0; i < states.length; i++){
    var s = states[i];
    points = points + s.x * 2 + "," + s.y * 3.915 + " ";
  }
  points = points + state.x * 2 + "," + state.y * 4 + " ";

  // creating and showing de SVG element
  var element = document.createElementNS(namespaceURI, "polyline");
  element.setAttributeNS(null, "points", points);
  element.setAttributeNS(null, "fill", "none");
  element.setAttributeNS(null, "stroke", "#ffb6c122");
  element.setAttributeNS(null, "class", "red");
  svg.appendChild(element);

  // updating and showing de SVG element
  var element = document.getElementById("cursor");
  element.setAttributeNS(null, "cx", state.x + "%");
  element.setAttributeNS(null, "cy", state.y + "%");
  svg.appendChild(element);

  // checks messages
  check_message();
}

// Add event listener on keypress
document.addEventListener('keydown', (event) => {
  var code = event.code;
  var deltay = 0.997;
  var deltax = 2.0;

  // describe actions
  if(event.ctrlKey && code == "ArrowUp"){
    var new_state = {"x":state.x, "y":state.y-deltay};
    if(check_move(state, new_state)){
      states.push(state);
      state = new_state;
      draw();
    }
  }
  if(event.ctrlKey && code == "ArrowDown"){
    var new_state = {"x":state.x, "y":state.y+deltay};
    if(check_move(state, new_state)){
      states.push(state);
      state = new_state;
      draw();
    }
  }
  if(event.ctrlKey && code == "ArrowLeft"){
    var new_state = {"x":state.x-deltax, "y":state.y};
    if(check_move(state, new_state)){
      states.push(state);
      state = new_state;
      draw();
    }
  }
  if(event.ctrlKey && code == "ArrowRight"){
    var new_state = {"x":state.x+deltax, "y":state.y};
    if(check_move(state, new_state)){
      states.push(state);
      state = new_state;
      draw();
    }
  }
  if(event.ctrlKey && event.key == 'x') {
    location.reload();
    // clear();
  }
  if(event.ctrlKey && event.key == 'c') {
    var element = document.getElementById("maze");

    href = element.getAttribute("href");
    if(href == "img/maze-unsolved.svg"){
      element.setAttributeNS(null, "href", "img/maze-solved.svg");
    }
    if(href == "img/maze-solved.svg"){
      element.setAttributeNS(null, "href", "img/maze-unsolved.svg");
    }
  }
}, false);

var check_move = function(old_state, new_state){
  var wid = 804;
  var hei = 1572;

  for(var i=0; i < divs.length; i++){
    div = divs[i];

    x1 = 100*div.x1/wid;
    x2 = 100*div.x2/wid;
    y1 = 1+98*div.y1/hei;
    y2 = 1+98*div.y2/hei;

    // cruzando horizontalmente
    if((x1 == x2 && old_state.y == new_state.y) &&
       (old_state.x < x1 && new_state.x > x1 || old_state.x > x1 && new_state.x < x1) &&
       (old_state.y > y1 && old_state.y < y2 || old_state.y < y1 && old_state.y > y2)){
        
      return false;
    }

    // cruzando verticalmente
    if((y1 == y2 && old_state.x == new_state.x) &&
       (old_state.y < y1 && new_state.y > y1 || old_state.y > y1 && new_state.y < y1) &&
       (old_state.x > x1 && old_state.x < x2 || old_state.x < x1 && old_state.x > x2)){

      return false;
    }

    // deixando região de fronteira
    if(new_state.y <= 0 || new_state.y >= 100 || new_state.x <= 0 || new_state.x >= 100){
      return false;
    }
  }
  return true;
};

var trophy_00 = true;
var trophy_12 = true;
var trophy_24 = true;
var trophy_36 = true;
var trophy_47 = true;

var check_message = function(){
  if(state.x == 49 && state.y.toFixed(3) == 1.647 && trophy_00){
    trophy_00 = false;
    alert("Numa noite estralada.\nNuma sala bem fechada.\n\nA jornada começou com um SIM!");
  }
  if(state.x == 67 && state.y.toFixed(3) == 24.578 && trophy_12){
    trophy_12 = false;
    surge(document.getElementById("trophy_12"), 0);
  }
  if(state.x == 53 && state.y.toFixed(3) == 50.5 && trophy_24){
    trophy_24 = false;
    surge(document.getElementById("trophy_24"), 0);
    
  } 
  if(state.x == 7 && state.y.toFixed(3) == 74.428 && trophy_36){
    trophy_36 = false;
    surge(document.getElementById("trophy_36"), 0);
  }
  if(state.x == 51 && state.y.toFixed(3) == 97.359 && trophy_47){
    trophy_47 = false;
    surge(document.getElementById("trophy_47"), 0);
    surge(document.getElementById("end"), 0);
  }
}

var surge = function(element, i){
  if(i <= 100){
    setTimeout(function() {
      element.style.opacity = i/100;
      surge(element, i+1);
    }, 20);
  }
}