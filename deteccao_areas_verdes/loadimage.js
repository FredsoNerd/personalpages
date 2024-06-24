var img_old = document.getElementById("img_old");
var img_new = document.getElementById("img_new");

var aux = [
 '.png',
 '_blur.png',
 '_equalize.png',
 '_decorr.png',
 '_u50.png',
 '_u45.png',
 '_u40.png',
 '_u35.png',
 '_u30.png',
 '_u25.png',
 '_u20.png',
 '_u15.png',
 '_u10.png',
 '_u5.png',
 '_mask.png'];
var i = -1;
var file = "";

var loadImage = function(file){
	var imgDataOut;
	img_old.src = "modificado/" + file + ".png";
	img_new.src = "modificado/" + file + "_blur.png";
	
	this.file = file;
	i = -1;
	move_fwd();
};

var move_fwd = function(){
	i++;
	
	if(i > aux.length - 1){i = 0};
	img_new.src = "modificado/" + file + aux[i];
};
var move_bck = function(){
	i--;
	
	if(i < 0){i = aux.length - 1};
	img_new.src = "modificado/" + file + aux[i];
};