---
layout: base
title: Game
---
# Whack-a-Mole– OOP JavaScript Game

Click the moles or press number keys (1–9) to score.  
- Multiple mole types, power-ups, combo system  
- Score points, lose lives for misses or bombs  
- Increasing difficulty over time  
- Fully OOP Game  


<canvas id="gameCanvas" width="450" height="450"></canvas>
<script>
  // ======= Hole Class =======
  class Hole {
    constructor(x, y, size, index) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.index = index;
      this.entity = null; // Mole or PowerUp
    }
    draw(ctx) {
      ctx.fillStyle = "#654321"; // brown hole
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.size, this.size);
    }
  }

  // ======= Base Entity =======
  class Entity {
    constructor(hole, duration=1000) {
      this.hole = hole;
      this.hole.entity = this;
      this.duration = duration;
      this.startTime = Date.now();
      this.hit = false;
    }
    draw(ctx) {}
    update() {
      if(Date.now() - this.startTime > this.duration){
        this.hole.entity = null;
        return false;
      }
      return true;
    }
  }

  // ======= Mole Class =======
  class Mole extends Entity {
    constructor(hole, type="normal") {
      const durations = { normal:1000, golden:800, bomb:1000 };
      super(hole, durations[type]);
      this.type = type;
    }
    draw(ctx) {
      const { x, y, size } = this.hole;
      if(this.hit) return;
      ctx.beginPath();
      if(this.type==="normal") ctx.fillStyle="green";
      else if(this.type==="golden") ctx.fillStyle="gold";
      else if(this.type==="bomb") ctx.fillStyle="red";
      ctx.arc(x + size/2, y + size/2, size/3, 0, 2*Math.PI);
      ctx.fill();
    }
    onHit(game){
      if(this.type==="normal") game.addScore(10);
      else if(this.type==="golden") game.addScore(30);
      else if(this.type==="bomb") game.lives--;
      this.hit = true;
      this.hole.entity = null;
    }
  }

  // ======= PowerUp Class =======
  class PowerUp extends Entity {
    constructor(hole, type) {
      super(hole, 1200);
      this.type = type; // "double" or "life"
    }
    draw(ctx){
      const { x, y, size } = this.hole;
      ctx.beginPath();
      ctx.fillStyle = this.type==="double"?"pink":"cyan";
      ctx.arc(x + size/2, y + size/2, size/4, 0, 2*Math.PI);
      ctx.fill();
    }
    onHit(game){
      if(this.type==="double") game.activateMultiplier(5000);
      else if(this.type==="life") game.lives++;
      this.hole.entity = null;
    }
  }

  // ======= Game Class =======
  class Game {
    constructor(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.tabIndex=1;
      this.canvas.style.outline="none";
      this.canvas.focus();

      this.gridSize=3;
      this.holeSize=this.canvas.width/this.gridSize;
      this.holes=[];
      let idx=1;
      for(let r=0;r<this.gridSize;r++){
        for(let c=0;c<this.gridSize;c++){
          this.holes.push(new Hole(c*this.holeSize, r*this.holeSize, this.holeSize, idx++));
        }
      }

      this.moles=[];
      this.score=0;
      this.highScore=localStorage.getItem("whackAMoleHighScore")||0;
      this.lives=5;
      this.spawnInterval=1500;
      this.lastSpawn=Date.now();
      this.state="title";
      this.multiplier=1;
      this.multiplierEnd=0;

      this.keys={};
      window.addEventListener("keydown",e=>this.keys[e.key]=true);
      window.addEventListener("keyup",e=>this.keys[e.key]=false);
      this.canvas.addEventListener("click",e=>this.handleClick(e));

      requestAnimationFrame(()=>this.update());
    }

    start(){
      this.score=0; this.lives=5; this.moles=[]; this.lastSpawn=Date.now();
      this.state="playing"; this.multiplier=1; this.multiplierEnd=0;
      this.holes.forEach(h=>h.entity=null);
    }

    spawnEntity(){
      const emptyHoles=this.holes.filter(h=>!h.entity);
      if(emptyHoles.length===0) return;
      const hole=emptyHoles[Math.floor(Math.random()*emptyHoles.length)];

      const r=Math.random();
      if(r<0.7) this.moles.push(new Mole(hole,"normal"));
      else if(r<0.85) this.moles.push(new Mole(hole,"golden"));
      else if(r<0.95) this.moles.push(new Mole(hole,"bomb"));
      else {
        const type = Math.random()<0.5?"double":"life";
        this.moles.push(new PowerUp(hole,type));
      }
    }

    handleClick(e){
      const rect=this.canvas.getBoundingClientRect();
      const mx=e.clientX - rect.left;
      const my=e.clientY - rect.top;
      this.holes.forEach(h=>{
        if(h.entity){
          const {x,y,size}=h;
          const cx=x+size/2, cy=y+size/2;
          const r=size/3;
          if(Math.hypot(mx-cx,my-cy)<=r){
            h.entity.onHit(this);
          }
        }
      });
    }

    checkKeys(){
      for(const key in this.keys){
        if(this.keys[key] && !isNaN(key)){
          const num=parseInt(key);
          const hole=this.holes.find(h=>h.index===num);
          if(hole && hole.entity) hole.entity.onHit(this);
          this.keys[key]=false;
        }
      }
    }

    addScore(points){
      const finalPoints=Math.floor(points*this.multiplier);
      this.score+=finalPoints;
      if(this.score>this.highScore) this.highScore=this.score;
    }

    activateMultiplier(ms){
      this.multiplier=2;
      this.multiplierEnd=Date.now()+ms;
    }

    update(){
      this.ctx.fillStyle="lightblue";
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

      if(this.state==="title") this.drawTitle();
      else if(this.state==="playing") this.updateGame();
      else if(this.state==="gameover") this.drawGameOver();

      requestAnimationFrame(()=>this.update());
    }

    updateGame(){
      if(Date.now()-this.lastSpawn>this.spawnInterval) {
        this.spawnEntity();
        this.lastSpawn=Date.now();
      }

      for(let i=this.moles.length-1;i>=0;i--){
        if(!this.moles[i].update()) this.moles.splice(i,1);
      }

      if(this.multiplier>1 && Date.now()>this.multiplierEnd) this.multiplier=1;

      this.checkKeys();

      this.holes.forEach(h=>h.draw(this.ctx));
      this.moles.forEach(m=>m.draw(this.ctx));

      this.ctx.fillStyle="black";
      this.ctx.font="18px Arial";
      this.ctx.fillText("Score: "+this.score,10,20);
      this.ctx.fillText("High Score: "+this.highScore,10,45);
      this.ctx.fillText("Lives: "+this.lives,10,70);
      this.ctx.fillText("Multiplier: x"+this.multiplier,10,95);

      if(this.lives<=0){
        this.state="gameover";
        localStorage.setItem("whackAMoleHighScore",this.highScore);
      }

      // Increase difficulty
      if(this.score>0 && this.score%100===0) this.spawnInterval=Math.max(500,1500 - Math.floor(this.score/2));
    }

    drawTitle(){
      this.ctx.fillStyle="black";
      this.ctx.font="36px Arial";
      this.ctx.fillText("🐹 Whack-a-Mole+",60,200);
      this.ctx.font="20px Arial";
      this.ctx.fillText("Click or press 1-9 to hit moles",50,250);
      this.ctx.fillText("Golden=+30, Bomb=-1, Power-ups appear randomly",20,280);
      this.ctx.fillText("Press ENTER or Click to Start",70,320);
      if(this.keys["Enter"]) this.start();
    }

    drawGameOver(){
      this.ctx.fillStyle="red";
      this.ctx.font="36px Arial";
      this.ctx.fillText("GAME OVER",110,200);
      this.ctx.fillStyle="black";
      this.ctx.font="24px Arial";
      this.ctx.fillText("Final Score: "+this.score,130,250);
      this.ctx.fillText("Press ENTER or Click to Restart",50,300);
      if(this.keys["Enter"]) this.start();
    }
  }

  new Game("gameCanvas");
</script>





