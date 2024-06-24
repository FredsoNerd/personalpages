// atualizamos o sistema frequentemente
var updateMosquito = function(mosquitos){
	var x, y, m;
	for(var i = 0; i < mosquitos.length; i++){
		m = mosquitos[i];
		m.update();
		x = m.position[0];
		y = m.position[1];
		
		// branco: comum vermelho: wolbachia
		ctx.fillStyle = m.wolbachia? "red":"black";
		ctx.fillRect(x,y,1,1);
	}
}
var update = function(){
	ctx.fillStyle = "#dfdfdf";
	ctx.fillRect(0, 0, width, height);
	
	updateMosquito(machos);
	updateMosquito(femeas);
	for(var i = 0; i < filhotes.length; i++){
		filhotes[i].update();
	}
	
	// atulizamos a taxa reprodutiva por
	// um modelo logistico com suporte l
	r = (1 - (swolbachia_m + nwolbachia_m + filhotes.length)/l);
	
	//console.log(machos.length, femeas.length, filhotes.length, r);
};

// repetimos o experimento ao longo
// do tempo e plotamos em chart
var days = 0;
setInterval(function(){
	update();
	
	// atualizamos os grafico de linhas
	chart_m.data.datasets[0].data.push(swolbachia_m);
	chart_m.data.datasets[1].data.push(nwolbachia_m);
	
	chart_o.data.datasets[0].data.push(swolbachia_o);
	chart_o.data.datasets[1].data.push(nwolbachia_o);
	
	if(days % 1000 == 0){
		chart_m.data.datasets[0].data = [];
		chart_m.data.datasets[1].data = [];
		
		chart_o.data.datasets[0].data = [];
		chart_o.data.datasets[1].data = [];
		
		for(var i = 0; i < 1000; i++){
			chart_m.data.labels[i] +=
			chart_m.data.labels[i] == ''?
				'': 1000;
		}
		chart_m.data.labels[0] = chart_m.data.labels[100] - 100;
	}
	
	chart_o.update();
	chart_m.update();
	days++;
}, 500);
