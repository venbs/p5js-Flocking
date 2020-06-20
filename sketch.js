drop_0 = [];
drop_Num = 200; // 粒子的数量
repulsion_r = 15; // 粒子排斥半径，防止扎堆
cohesion_r = 200; // 粒子聚拢吸引半径
speed = 2          ; //粒子的飞行速度上限

function preload() {
  myFont = loadFont('AM293.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  for (i = 0; i <= drop_Num; i++) {
    drop_0[i] = new Drop(240);
  }
}

function draw() {
  //background(0);
  fill(0, 0.1);
  noStroke();
  rect(0, 0, width, height);
  for (i = 0; i <= drop_Num; i++) {
    drop_0[i].update();
    if (i == drop_Num / 4) {
      showText()
    }
  }

}
class Drop {
  constructor(color_s) {
    this.pos = createVector(random(width),random(height));
    this.vel = createVector(random(-1,1),random(-1,1));
    this.acc = createVector();
    this.weight = random(3,8);
    this.color = random(color_s - 80, color_s + 80);
    this.acc_limit = random(0.1,0.3);
    this.vel_limit = random(1,speed);
    this.repulsion = createVector();
    this.cohesion = createVector();
  }
  
  update(){

    this.checkedge();
    this.getmouse();
    this.move();
    this.display();

  }
  move() {
    this.keepRepulsion();
    this.keepCohesion();
    this.acc.limit(this.acc_limit);
    this.vel.limit(this.vel_limit);
    this.vel = this.vel.add(this.acc);
    this.pos = this.pos.add(this.vel);
    this.acc.mult(0);
  }
  display() {
    this.color += 0.2;
    if (this.color > 360) {
      this.color = -0;
    }  
    stroke(this.color, 60, 100, this.opacity);
    point(this.pos.x, this.pos.y);
    strokeWeight(this.weight);
  }
  checkedge(){
    if (this.pos.y < 0) {this.pos.y = height;}
    if (this.pos.y > height) {this.pos.y = 0;}
    if (this.pos.x < 0) {this.pos.x = width;}
    if (this.pos.x > width) {this.pos.x = 0;}
  }
  keepRepulsion(){
    for(let other of drop_0){
      let dist = p5.Vector.sub(other.pos,this.pos);
      let dist_l = dist.mag();
      if( dist_l < repulsion_r && other != this){
        let f = map(dist_l, 0,repulsion_r,1,0);
        dist.mult(-f);
        this.repulsion.add(dist);
      }
    }
    this.acc.add(this.repulsion);
  
  }
  keepCohesion(){
    let count = 0;
    for(let other of drop_0){
      let dist = p5.Vector.sub(other.pos,this.pos);
      let dist_v = dist.mag();
      if(dist_v < cohesion_r && other != this ){
        this.cohesion.add(dist);
        count++;
      }
      if(count > 0 ){
        this.cohesion.mult(1/count);
        this.acc.add(this.cohesion);
      
      }
    }
  
  
  
  }
  
  getmouse(){
    if(mouseIsPressed){
      this.dir = p5.Vector.sub(createVector(mouseX,mouseY),this.pos);
      this.acc.add(this.dir);
    }
  }

}

function showText() {
  let text_offsetX = mouseX - width / 2;
  let text_offsetY = mouseY - height / 2;
  let offset_rate = 0.02
  noStroke();
  fill("white");
  textAlign(CENTER);
  text('F L O C K', width / 2 + (text_offsetX * offset_rate), height / 2 + (text_offsetY * offset_rate) + 40);
  textSize(180);
  textFont(myFont);
  textStyle(BOLD);
}