function update_draw_countries(){
  for(var i=0; i < data_sim.length; i++){
    var country = document.getElementById(data_sim[i][COUNTRY]);

    // colorise the country given INFected
    var c = data_sim[i][SICK_POPULATION];
    c /= data_sim[i][POPULATION];
    r = (1 - c) * (c + 0.4) * (500);
    c = 196 * (1 - c);
    country.setAttributeNS(null, "fill", "rgb("+r+","+c+","+c+")");

    // alter title to population/infected
    
  }
}
