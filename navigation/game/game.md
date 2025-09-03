---
layout: base
title: Game
---
# 🐹 Whack-a-Mole – OOP JavaScript Game

Click the moles or press number keys (1–9) to score.  
- 3x3 grid, random mole appearance  
- Score points for each hit, lose lives for misses  
- OOP structure for all entities  
- Works on any browser with mouse or keyboard  

<canvas id="gameCanvas" width="450" height="450"></canvas>
<script>
  // ======= Hole Class =======
  class Hole {
    constructor(x, y, size, index) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.index = index; // number 1-9
      this.hasMole = false;
    }
    draw(ctx) {
      ctx.fillStyle = "#654321"; // brown hole
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.size, this.size);
    }
  }

  // ======= Mole Class =======
  class Mole {
    constructor(hole, duration=1000) {
      this.hole = hole;
      this.hole.hasMole = true;
      this.duration = duration; // ms
      this.startTime = Date.now();
    }
    draw(ctx) {
      const { x, y, size } = this.hole;
      ctx.fillStyle = "green"; // visible mole
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/3, 0, 2*Math.PI);
      ctx.fill();
    }
    update() {
      if(Date.now() - this.startTime > this.duration) {
        this.hole.hasMole = false;
        return false; // mole disappears
      }
      return true;
    }
  }

  // ======= Game Class =======
  class Game {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");

      this.canvas.tabIndex = 1;
      this.canvas.style.outline = "none";
      this.canvas.focus();

      // Grid setup
      this.gridSize = 3;
      this.holeSize = this.canvas.width / this.gridSize;
      this.holes = [];
      let index = 1;
      for(let row=0; row<this.gridSize; row++){
        for(let col=0; col<this.gridSize; col++){
          this.holes.push(new Hole(col*this.holeSize, row*this.holeSize, this.holeSize, index));
          index++;
        }
      }

      // Game state
      this.moles = [];
      this.score = 0;
      this.highScore = localStorage.getItem("whackAMoleHighScore") || 0;
      this.lives = 5;
      this.spawnInterval = 1500; // ms
      this.lastSpawn = Date.now();
      this.state = "title";

      // Input
      this.keys = {};
      window.addEventListener("keydown", e => this.keys[e.key] = true);
      window.addEventListener("keyup", e => this.keys[e.key] = false);
      this.canvas.addEventListener("click", e => this.handleClick(e));

      requestAnimationFrame(() => this.update());
    }

    start() {
      this.score = 0;
      this.lives = 5;
      this.moles = [];
      this.lastSpawn = Date.now();
      this.state = "playing";
    }

    spawnMole() {
      const emptyHoles = this.holes.filter(h => !h.hasMole);
      if(emptyHoles.length === 0) return;
      const hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
      this.moles.push(new Mole(hole, 1000));
    }

    handleClick(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for(const mole of this.moles){
        const { x, y, size } = mole.hole;
        const cx = x + size/2;
        const cy = y + size/2;
        const r = size/3;
        if(Math.hypot(mx - cx, my - cy) <= r){
          mole.hole.hasMole = false;
          this.moles = this.moles.filter(m => m !== mole);
          this.score += 10;
        }
      }
    }

    checkKeys() {
      for(const key in this.keys){
        if(this.keys[key] && !isNaN(key)){
          const num = parseInt(key);
          const hole = this.holes.find(h => h.index === num);
          if(hole && hole.hasMole){
            const mole = this.moles.find(m => m.hole === hole);
            if(mole){
              hole.hasMole = false;
              this.moles = this.moles.filter(m => m !== mole);
              this.score += 10;
            }
          }
          this.keys[key] = false;
        }
      }
    }

    update() {
      // Clear
      this.ctx.fillStyle = "lightblue";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      if(this.state === "title") this.drawTitle();
      else if(this.state === "playing") this.updateGame();
      else if(this.state === "gameover") this.drawGameOver();

      requestAnimationFrame(() => this.update());
    }

    updateGame() {
      // Spawn new mole
      if(Date.now() - this.lastSpawn > this.spawnInterval){
        this.spawnMole();
        this.lastSpawn = Date.now();
      }

      // Update moles
      for(let i=this.moles.length-1; i>=0; i--){
        if(!this.moles[i].update()){
          this.moles.splice(i,1);
          this.lives--;
          if(this.lives <= 0){
            this.state = "gameover";
            if(this.score > this.highScore){
              this.highScore = this.score;
              localStorage.setItem("whackAMoleHighScore", this.highScore);
            }
          }
        }
      }

      // Check key presses
      this.checkKeys();

      // Draw holes and moles
      for(const hole of this.holes) hole.draw(this.ctx);
      for(const mole of this.moles) mole.draw(this.ctx);

      // Draw HUD
      this.ctx.fillStyle = "black";
      this.ctx.font = "20px Arial";
      this.ctx.fillText("Score: " + this.score, 10, 20);
      this.ctx.fillText("High Score: " + this.highScore, 10, 45);
      this.ctx.fillText("Lives: " + this.lives, 10, 70);
    }

    drawTitle() {
      this.ctx.fillStyle = "black";
      this.ctx.font = "36px Arial";
      this.ctx.fillText("🐹 Whack-a-Mole", 80, 200);
      this.ctx.font = "24px Arial";
      this.ctx.fillText("Click or press 1-9 to hit moles", 50, 250);
      this.ctx.fillText("Press ENTER or Click to Start", 70, 300);
      if(this.keys["Enter"]) this.start();
    }

    drawGameOver() {
      this.ctx.fillStyle = "red";
      this.ctx.font = "36px Arial";
      this.ctx.fillText("GAME OVER", 110, 200);
      this.ctx.fillStyle = "black";
      this.ctx.font = "24px Arial";
      this.ctx.fillText("Final Score: " + this.score, 130, 250);
      this.ctx.fillText("Press ENTER or Click to Restart", 50, 300);
      if(this.keys["Enter"]) this.start();
    }
  }

  new Game("gameCanvas");
</script>




