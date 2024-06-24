// classificador de cor verde na figura
var isGreen = function(r,g,b){
    y = 0.299 * r + 0.587 * g + 0.114 * b;
    u = 0.436 * (b - y) / (1 - 0.114);
    v = 0.615 * (r - y) / (1 - 0.299);
	
	return true;
};
// filtro de suavização
var median = function(imgData, len){
	data = imgData.data;
	width = imgData.width;
	height = imgData.height;
	
	len = parseInt(len/2);
	for(let i = 0; i < height; i++){
		for(let j = 0; j < width; j++){
			let pos = 4 * (i * width + j);
			
			let r = 0;
			let g = 0;
			let b = 0;
			let cont = 0;
			for(let c = -len; c <= len; c++){
				for(let d = -len; d <= len; d++){
					let i_ = i + c;
					let j_ = j + d;
					let pos_ = 4 * (i_ * width + j_);
					if(i_>=0 && i_<height && j_>=0 && j_<width){
						if(data[pos + 0] > r) r = data[pos + 0];
						if(data[pos + 1] > g) g = data[pos + 1];
						if(data[pos + 2] > b) b = data[pos + 2];
						
						cont++;
					}
				}
			}
			//r = parseInt(r/cont);
			//g = parseInt(g/cont);
			//b = parseInt(b/cont);
			//cont = 0;
			data[pos + 0] = r;
			data[pos + 1] = g;
			data[pos + 2] = b;
			
		}
	}
};

// funcao de processamento de imagens
var imManip = function(imgData){
	median(imgData, 4);
	
	return;
};