---
layout: base
title: Game
---
# 🏃 Rogue Runner – OOP JavaScript Game

Medium-complexity vertical runner with obstacles, coins, and power-ups.  
- Arrow keys / WASD to move  
- Avoid obstacles, collect coins  
- OOP structure for all entities  
- Responsive movement  


<canvas id="gameCanvas" width="500" height="600"></canvas>
<script>
  // ======= Base Entity =======
  class Entity {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    collide(other) {
      return this.x < other.x + other.width &&
             this.x + this.width > other.x &&
             this.y < other.y + other.height &&
             this.y + this.height > other.y;
    }
  }

  // ======= Player =======
  class Player extends Entity {
    constructor(x, y) {
      super(x, y, 40, 40, "cyan");
      this.speed = 6;
    }
    move(keys, canvasWidth, canvasHeight) {
      if(keys["ArrowLeft"] || keys["a"]) this.x -= this.speed;
      if(keys["ArrowRight"] || keys["d"]) this.x += this.speed;
      if(keys["ArrowUp"] || keys["w"]) this.y -= this.speed;
      if(keys["ArrowDown"] || keys["s"]) this.y += this.speed;

      // Stay inside canvas
      if(this.x < 0) this.x = 0;
      if(this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
      if(this.y < 0) this.y = 0;
      if(this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }
  }

  // ======= Obstacle =======
  class Obstacle extends Entity {
    constructor(x, y, width, height, speed) {
      super(x, y, width, height, "red");
      this.speed = speed;
    }
    update() { this.y += this.speed; }
  }

  // ======= Coin =======
  class Coin extends Entity {
    constructor(x, y) {
      super(x, y, 20, 20, "gold");
      this.speed = 4;
      this.pulse = 0;
    }
    update() { this.y += this.speed; this.pulse += 0.1; }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2*(1+0.2*Math.sin(this.pulse)), 0, 2*Math.PI);
      ctx.fill();
    }
  }

  // ======= PowerUp =======
  class PowerUp extends Entity {
    constructor(x, y, type) {
      const colors = { shield: "blue", slow: "lime" };
      super(x, y, 25, 25, colors[type]);
      this.type = type;
      this.speed = 4;
      this.pulse = 0;
    }
    update() { this.y += this.speed; this.pulse += 0.1; }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2*(1+0.3*Math.sin(this.pulse)), 0, 2*Math.PI);
      ctx.fill();
    }
  }

  // ======= Game =======
  class Game {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.tabIndex = 1; this.canvas.focus();

      this.keys = {};
      window.addEventListener("keydown", e => this.keys[e.key] = true);
      window.addEventListener("keyup", e => this.keys[e.key] = false);

      this.player = new Player(this.canvas.width/2 - 20, this.canvas.height - 60);
      this.obstacles = [];
      this.coins = [];
      this.powerUps = [];
      this.score = 0;
      this.highScore = localStorage.getItem("rogueRunnerHighScore") || 0;
      this.gameSpeed = 4;
      this.spawnTimer = 0;
      this.state = "title";

      requestAnimationFrame(() => this.update());
    }

    start() { this.state = "playing"; this.score = 0; this.obstacles = []; this.coins = []; this.powerUps = []; this.spawnTimer = 0; this.gameSpeed = 4; }

    spawnEntities() {
      // Obstacles
      if(Math.random() < 0.03){
        const w = 40 + Math.random()*40;
        this.obstacles.push(new Obstacle(Math.random()*(this.canvas.width - w), -30, w, 20, this.gameSpeed));
      }
      // Coins
      if(Math.random() < 0.02){
        this.coins.push(new Coin(Math.random()*(this.canvas.width - 20), -20));
      }
      // PowerUps
      if(Math.random() < 0.005){
        const types = ["shield","slow"];
        this.powerUps.push(new PowerUp(Math.random()*(this.canvas.width-25), -25, types[Math.floor(Math.random()*types.length)]));
      }
    }

    update() {
      // Clear
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

      if(this.state === "title") this.drawTitle();
      else if(this.state === "playing") this.updateGame();
      else if(this.state === "gameover") this.drawGameOver();

      requestAnimationFrame(() => this.update());
    }

    updateGame(){
      this.player.move(this.keys, this.canvas.width, this.canvas.height);

      // Spawn
      this.spawnTimer++;
      if(this.spawnTimer % 2 === 0) this.spawnEntities(); // spawn entities every 2 frames

      // Obstacles
      for(let i=this.obstacles.length-1;i>=0;i--){
        const ob = this.obstacles[i];
        ob.update(); ob.draw(this.ctx);
        if(this.player.collide(ob)){ this.state="gameover"; if(this.score>this.highScore){ this.highScore=this.score; localStorage.setItem("rogueRunnerHighScore",this.highScore);} }
        else if(ob.y>this.canvas.height) this.obstacles.splice(i,1);
      }

      // Coins
      for(let i=this.coins.length-1;i>=0;i--){
        const coin = this.coins[i];
        coin.update(); coin.draw(this.ctx);
        if(this.player.collide(coin)){ this.score += 10; this.coins.splice(i,1);}
        else if(coin.y>this.canvas.height) this.coins.splice(i,1);
      }

      // PowerUps
      for(let i=this.powerUps.length-1;i>=0;i--){
        const p = this.powerUps[i]; p.update(); p.draw(this.ctx);
        if(this.player.collide(p)){ 
          if(p.type==="shield"){ this.player.color="blue"; setTimeout(()=>this.player.color="cyan",5000);}
          else if(p.type==="slow"){ this.gameSpeed=2; setTimeout(()=>this.gameSpeed=4,5000);}
          this.powerUps.splice(i,1);
        } else if(p.y>this.canvas.height) this.powerUps.splice(i,1);
      }

      // HUD
      this.ctx.fillStyle="white"; this.ctx.font="18px Arial";
      this.ctx.fillText("Score: "+this.score,10,20);
      this.ctx.fillText("High Score: "+this.highScore,10,50);

      this.score += 0.1; // score increases over time
    }

    drawTitle(){
      this.ctx.fillStyle="white"; this.ctx.font="36px Arial";
      this.ctx.fillText("🏃 Rogue Runner",100,250);
      this.ctx.font="24px Arial";
      this.ctx.fillText("Press ENTER to Start",150,300);
      this.ctx.fillText("Arrow keys / WASD to Move",120,340);
      if(this.keys["Enter"]){ this.start(); }
    }

    drawGameOver(){
      this.ctx.fillStyle="red"; this.ctx.font="36px Arial";
      this.ctx.fillText("GAME OVER",150,250);
      this.ctx.fillStyle="white"; this.ctx.font="24px Arial";
      this.ctx.fillText("Final Score: "+Math.floor(this.score),160,300);
      this.ctx.fillText("Press ENTER to Restart",130,340);
      if(this.keys["Enter"]){ this.start(); }
    }
  }

  new Game("gameCanvas");
</script>

