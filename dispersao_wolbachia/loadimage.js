var panel = document.getElementById("panel");
var ctx = panel.getContext("2d");

// dimensões do painel de plotagem
var width = 1000;
var height = 400;
panel.width = width;
panel.height = height;

/**
var img = new Image();
img.src = 'https://www.cabanamagazine.com.br/image/catalog/cores/Preto%20+%20Verde%20%C3%81gua.jpg';
img.src = 'https://i.ytimg.com/vi/wsc90Tz4OEg/maxresdefault.jpg';

var data;

// preenchemos o canvas com a imagem
// carregamos a imagem em array 'data'
img.onload = function(){
	ctx.drawImage(img, 0, 0);
	var data = ctx.getImageData(0,0,width,height).data;
};
**/