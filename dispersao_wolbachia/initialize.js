// calculamos a posicao no array 'data'
// da máscara e retornamos caso g = 255
var is_obstacle = function(x, y){
	return false;
};

// inserimos N insetos não-infectados
// junto a N novos ovos não-infectados 
// quando inicializamos o sistema
var N = 0.6 * l;
for(var i = 0; i < N; i++){
	m = new Mosquito(false);
	// os insetos iniciais sao de idades
	// uniformemente distribuidas em que
	// são 50% machos e femeas
	//m.genre = 0.5 > Math.random();
	m.days = m.genre?
		10 * Math.random():
		40 * Math.random();
	
	// os ovos tem idades uniformemente
	// distribuidas aleatoriamente
	//var ovo = new Ovo(false, false, m.position);
	//ovo.days = 10 * Math.random();
}

// inserimos M novos insetos infectados
// ao clicarmos sobre o painel da cidade
let M = 1000;
panel.onclick = (function(event){
	for(var i = 0; i < M; i++){
		var m = new Mosquito(true);
		m.position[0] = event.clientX-(panel.offsetLeft-pageXOffset);
		m.position[1] = event.clientY-(panel.offsetTop-pageYOffset);
	}
});