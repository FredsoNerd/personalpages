var svg = document.getElementById("svg");
var x = 0;
var y = 0;
var boneco = document.getElementById("boneco");
var clean = function(){
  boneco.setAttributeNS(null, "transform", "");
}
var rotate= function(teta){
  transform("rotate("+teta+","+x+","+y+")");
}
var transform = function(alter){
  trans = boneco.getAttributeNS(null, "transform");
  //alter = "translate(" + (-x) + " " + (-y) + ") " + alter;
  //alter = alter + " translate(" + x + " " + y + ")";
  boneco.setAttributeNS(null, "transform", alter + "  " +trans);
}

var alter_origin = function(evt){
  var  CTM = svg.getScreenCTM();
  x = (evt.clientX - CTM.e) / CTM.a;
  y = (evt.clientY - CTM.f) / CTM.d;

  var dot_r = document.getElementById("origin_r");
  dot_r.setAttributeNS(null, "cx", x);
  dot_r.setAttributeNS(null, "cy", y);
}
var mytimeout;
var begin = function(alter){
  if(alter[0]=='r')
    mytimeout = setInterval("transform('"+alter+","+x+","+y+")')",50);
  else {
    mytimeout = setInterval("transform('"+alter+"')",50);
  }
}
var end = function(){
  if(typeof(mytimeout !== 'undefined'))
    clearTimeout(mytimeout);
}
