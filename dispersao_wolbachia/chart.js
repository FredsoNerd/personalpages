var labels = [];
for(var i = 0; i < 1000; i++){
	i % 50 == 0?
		labels.push(i-1000):
		labels.push('');
}

var ctx_m = document.getElementById("chart_mosquito").getContext('2d');
var ctx_o = document.getElementById("chart_ovo").getContext('2d');

var chart_m = new Chart(ctx_m, {
	type: 'line',
	data: {
		labels: labels,
		datasets: [
		{
			label: '# com wolbachia',
			backgroundColor: '#ff808080',
			data: [],
			pointRadius: 0,
		},
		{
			label: '# sem wolbachia',
			backgroundColor: '#aaaaaacc',
			data: [],
			pointRadius: 0,
		}]
	},
	options: {
		title: {
			display: true,
			text: 'População de Aedes Aegipty com e sem Wolbachia (dias)'
		}
	}
});

var chart_o = new Chart(ctx_o, {
	type: 'line',
	data: {
		labels: labels,
		datasets: [
		{
			label: '# com wolbachia',
			borderColor: '#ff555599',
			backgroundColor: 'pink',
			data: [],
			fill: false,
			pointRadius: 0,
		},
		{
			label: '# sem wolbachia',
			borderColor: '#55555599',
			backgroundColor: 'gray',
			data: [],
			fill: false,
			pointRadius: 0,
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Indivíduos prematuros com e sem Wolbachia (dias)'
		}
	}
});