// system properties:
var p = 0.3;              // chance of being infected by a neighbour
var d = 0.0001;           // chanc of dying by common ways
var n = 0.2;              // chance of contact with neighbour
var t = 4;                // days after node can become on quaretine
var q = 0.1;              // chance of being found to quarentine
var a = 0.5;              // fraction of population dies of ebola
var e = 1 - (1-a)**(1/10);// chance of dying on a simptomatic day
var b = 0.1;              // chance a node brakes a quarentine
var k = 30;               // days on quaretine
var day0 = 90;

// data about system evaluation
var population = [];
var dies = 0;

// contaminating/healthy states
const susc = SUSC;            // healthy
const incu = INCU;            // incubating
const infe = INFE;            // infectious
const quar = QUAR;            // isolated
const recu = RECU;            // recovered

class Node{
  constructor(sick, country){
    //this.id = id;
    this.sick = sick;    // includes incu/infe/quar
    this.state = susc;
    this.alive = true;
    this.neighbours = [];

    population.push(this);
    this.country = country;

    // data about global
    data_sim_afr[POPULATION]++;
    data_sim_afr[SUSC]++;

    // data about country
    data_sim[country][POPULATION]++;
    data_sim[country][SUSC]++;
  }

  update(){
    system_update();

    // chance the node dies by natural ways
    // given over datas of the country
    var die_p = d;
    if(Math.random() < die_p){
      this.die();
      return;
    }

    // update state of node
    switch (this.state) {
      // HEAlthy becomes INCubating under certain chance: probability p
      case susc: this.updated_susc(); return;
      // INCubating becomes a INFectious under variable incubation time
      case incu: this.updated_incu(); return;
      // Chance under a INCubating ou INFected node can be ISOlated
      case infe: this.updated_infe(); return;
      // Chance/time node becomes RECovered, possible break quarentine
      case quar: this.updated_quar(); return;
      // chance under wich a node can DIE infected or not infected
      case recu: this.updated_recu(); return;
    }
  }
  ///////////////////////////////////
  // NODE STATE UPDATING FUNCTIONS //
  ///////////////////////////////////

  parse_state(state, OLD, NEW){
    // node parses to new state
    this.state = state;

    // update global data data_sim_afr
    data_sim_afr[OLD]--;
    data_sim_afr[NEW]++;

    // update country data data_sim
    data_sim[this.country][OLD]--;
    data_sim[this.country][NEW]++;
  }

  infect(){
    // update data about this node
    this.sick = true;
    // parse state to incubating
    this.parse_state(incu, SUSC, INCU);

    // update global data data_sim_afr
    data_sim_afr[SICK_POPULATION]++;
    // update country data data_sim
    data_sim[this.country][SICK_POPULATION]++;

    // there is an incubation time as 1/(1+x**2),
    // 2<x<21 density: most heavy in center
    var x = 0;
    var u = 0;
    do{
      u = Math.random();
      x = 9 + Math.tan(u * 3 - 1.5);
    } while(x < 2 || x > 21);
    // incubation time before INFectious
    this.incu_days = x;
  }
  die(){
    // alter state of node to "healthy reborn"
    // parse state to incubating
    this.parse_state(susc, this.state, susc);

    // update global data data_sim_afr
    if(this.sick) data_sim_afr[SICK_POPULATION]--;
    // update country data data_sim
    if(this.sick) data_sim[this.country][SICK_POPULATION]--;

    // update data about this node
    this.sick = false;
  }

  updated_susc(){
    // about contact with neighbours
    for(let i in this.neighbours){
      // chance of not having contact that day
      if(Math.random() > n) continue;

      var neighbour = this.neighbours[i];
      if(neighbour.state != infe) continue;

      // node can beinfected with a chance "p"
      if(this.state == susc)
      if(Math.random() < p)
        this.infect();
    }
  }
  updated_incu(){
    // node becomes infectious after this.incu_days
    if(this.incu_days < 0){
      // node parses to infectious state
      this.parse_state(infe, INCU, INFE);

      // start counting days as infectious
      this.infe_days = 0;
    }

    // update time of incubation
    this.incu_days--;
  }
  updated_infe(){
    // nodes can die 6-16 days after simptoms
    if(this.infe_days > 5 && this.infe_days <= 16)
    if(Math.random < e){
      this.die();
      return;
    }

    // if survives 16+ days consider recovered
    if(this.infe_days > 16){
      this.parse_state(recu, INFE, RECU);
      return;
    }

    // after t days node can by put on quarentine
    // it occurs only after a day0 of quarentine
    if(days > day0)
    if(this.infe_days > t)
    if(Math.random() < q){
      this.parse_state(quar, INFE, QUAR);
      this.quar_days = 0;
    }

    // update days of infectious
    this.infe_days++;
  }
  updated_quar(){
    // node is recovered after k days
    if(this.quar_days > k){
      this.parse_state(recu, QUAR, RECU);
    }
    // there's a chance a node outs quarentine
    if(Math.random < b){
      this.parse_state(infe, QUAR, INFE);
    }

    // consider case node isn-t treated
    // nodes can die 6-16 days after simptoms
    if(this.infe_days > 5 && this.infe_days <= 16)
    if(Math.random < e){
      this.die();
      return;
    }


    // update time on quarentine and infection
    this.quar_days++;
    this.infe_days++;
  }
  updated_recu(){
    // update data about this node
    this.sick = false;
    // make node susceptible again!
    this.parse_state(susc, RECU, SUSC);

    // update global data data_sim_afr
    data_sim_afr[SICK_POPULATION]--;

    // update country data data_sim
    data_sim[this.country][SICK_POPULATION]--;
  }
}
