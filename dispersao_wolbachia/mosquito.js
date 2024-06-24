// conjunto de parametros do modelo
let g = 0.2;		// razão de nasimento entre generos
let v = 10;			// autonomia de voo máximo padrão
let p = 0.001;		// probabilidade de recolocação
let r = 0.02;		// frequencia de reprodutiva media
let o = 10;			// quantidade de ovos média por postura
let m = 0.8;		// fração posta que chega a idade adulta
let l = 10000;		// capacidade de suporte da populacao

// informação sobre contagem de animais
var swolbachia_m = 0;
var nwolbachia_m = 0;
var swolbachia_o = 0;
var nwolbachia_o = 0;

var machos = [];
var femeas = [];
//var mosquitos = [];
var filhotes = [];


class Mosquito{
	constructor(wolbachia){
		this.wolbachia = wolbachia;
		
		// defino true: M e false: F como padrao
		// por um parametro de razao de generos
		this.genre = Math.random() > g;
		
		// dias que o animal viverá em condições
		// ambientais normais: densidade sin(pi*x)
		var u = Math.random();
		var aux = Math.acos(1 - 2*u)/Math.PI;
		this.days = this.genre?
			 8 + 4 * aux:
			42 + 14 * aux;
			
		// localização inicial dada preferencia
		// zonas urbanas, em painel 1000 x 600
		var x, y;
		do{
			x = width * Math.random();
			y = height * Math.random();
		}
		while(is_obstacle(x,y));
		this.position = [x, y];
		
		// incluimos o animal na lista blobal
		wolbachia ? swolbachia_m++ : nwolbachia_m++;
		this.genre ?
			machos.push(this):
			femeas.push(this);
		
		// no caso em que o mosquito é femea
		// existe possibilidade reprodutiva
		if(!this.genre){
			// a copula ocorre com o mach mais
			// proximo quando em idade adulta
			var m = this.find(this.position, machos, 0, machos.length - 1);
			this.mW = (m == undefined)? false : m.wolbachia;
		}
	}
	
	update(){
		// atualizamos dados e estado do animal
		// idade, morte, posicao, reproducao
		this.days -= 1;
		if(this.days < 0){
			this.genre?
				machos.splice(machos.indexOf(this), 1):
				femeas.splice(femeas.indexOf(this), 1);
				
				this.wolbachia? swolbachia_m--: nwolbachia_m--;
		}
		
		// supondo distancia de voo 100m - 5px
		var x, y;
		do{
			x = this.position[0] + 2 * v * Math.random() - v;
			y = this.position[1] + 2 * v * Math.random() - v;
		}
		while(is_obstacle(x,y));
		this.position = [x, y];
		
		// caso femea, modelamos postura de ovos
		if(!this.genre && r > Math.random()){
			for(var i = 0; i < o; i++){
				new Ovo(this.mW, this.wolbachia, this.position);
			}
		}
	}	
	
	find(position, machos, li, lf){
		// desejamos escolher macho qualquer
		// solução randomica para escolha
		return machos[Math.floor(machos.length * Math.random())];
		
		// desejamos encontrar o macho mais
		// proximo da posicao dada
		if((lf - li)  < 0) return undefined;
		if((lf - li) == 0) return machos[0];
		// buscamos recursivamente nas metades
		var lil = li;
		var lfl = li + Math.floor((lf - li)/2);
		var lir = 1 + lfl;
		var lfr = lf;
		
		var ml = this.find(position, machos, lil, lfl);
		var mr = this.find(position, machos, lir, lfr);
		
		// utilizamos a distancia Manhatan
		var difl = 0;
		difl += Math.abs(ml.position[0] - position[0]);
		difl += Math.abs(ml.position[1] - position[1]);
		var difr = 0;
		difr += Math.abs(mr.position[0] - position[0]);
		difr += Math.abs(mr.position[1] - position[1]);
		
		return (difl < difr)? ml : mr;
	}

}

class Ovo{
	constructor(mW, fW, position){
		// sobre o comportamento na transmissão
		// no caso abaixo não há prole viável:
		// M sem wolbachia, mas F com wolbachia
		
		if(mW && (!fW)) return;
		
		this.position = position;
		// o animal chega a idade adulta?
		if(Math.random() > m) return;
		
		// o periodo total de incubação (x > 5)
		// segue uma densidade com media 11 dias
		// uma va Y ~ CQ(6), tomando X = 5 + Y
		var u = Math.random();
		var x = 6;
		var y = 1;
		var u = 0;
		var m = 0;
		
		do{
			x = 7 + Math.tan(Math.random() * Math.PI);
		}while(x < 5 || x > 400);
		this.days = x;
		
		// animal depende da infecção dos seus
		// progenitores para possuir a bacteria
		this.wolbachia = mW || fW;
		
		// incluimos o animal na lista global
		filhotes.push(this);
		
		// contagem de grupos
		this.wolbachia?
			swolbachia_o++:
			nwolbachia_o++;
	}
	update(){
		// atualizamos quantidade dias restante
		this.days -= 1;
		
		// quando o inseto chega a idade adulta
		// removemos de filhotes e adicionamos
		// a lista de mosquitos adultos
		if(this.days < 0){
			filhotes.splice(filhotes.indexOf(this), 1);
			
			var m = new Mosquito(this.wolbachia);
			m.position = this.position;
						
			// contagem de grupos
			this.wolbachia?
				swolbachia_o--:
				nwolbachia_o--;
		}
	}
}