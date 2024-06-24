function system_update(){
  // combat atronger after outbreak
  var fraq;

  frac  = data_sim_afr[INFE];
  frac /= data_sim_afr[POPULATION];

  q = (1-frac)**(20);    // chance of being found to quarentine
  //t = 8 * q;             // days after node can become on quaretine
  q = 1 - q;
}

function update_nodes(){
  for(let i in population) population[i].update();
};

function update_charts(){
  var percentual = 0;
  // update chart about compartiments fractions
  for(var i = 3; i < 8; i++){
    percentual  = data_sim_afr[i];
    percentual /= data_sim_afr[POPULATION];
    chart_1.data.datasets[i-3].data.push(100 * percentual);
  }
  chart_1.update();

  // update chart about infected fraction
  percentual  = data_sim_afr[SICK_POPULATION];
  percentual /= data_sim_afr[POPULATION];
	chart_2.data.datasets[0].data.push(100 * percentual);

	chart_2.update();
}

var days = 0;
function update(){
  update_nodes();
  update_draw_countries();
  update_charts();
  system_update();

  days++;
};

setInterval(update, 10);
