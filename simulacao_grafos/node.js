var wid = 1000;
var hei = 500;

// system properties
var p = 0.01;             // chance of being infected by a neighbour
var d = 0.001;             // chance of dying of obole, simple case

class Node{
  constructor(sick, id){
    this.id = id;
    this.sick = sick;
    this.alive = true;

    let y = Math.random() * hei;
    let x = Math.random() * wid;
    this.position = [x, y];
    this.neighbours = [];
    this.bari = this.position;
  }

  update(){
    // node can die by infection
    if(this.sick) if(Math.random() < d) this.alive = false;

    // atualize the node's state
    for(let i in this.neighbours){
      var neighbour = this.neighbours[i];
      var sick = neighbour.sick && neighbour.alive;
      // node becames sick under probability
      if(sick) if(Math.random() < p) this.sick = true;
    }
  }
}
