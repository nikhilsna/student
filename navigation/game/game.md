---
layout: base
title: Game
---
# 🚀 Space Defender Pro – Responsive Controls (JavaScript OOP)

Advanced OOP arcade game with smooth, responsive controls.  
- ⬅️ ➡️ move  
- SPACE to shoot  
- Power-ups, levels, high score  


<canvas id="gameCanvas" width="600" height="600"></canvas>
<script>
  // ======= Base Entity Class =======
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
  }

  // ======= Player =======
  class Player extends Entity {
    constructor(x, y) {
      super(x, y, 40, 20, "cyan");
      this.speed = 8;
      this.cooldown = 0;
      this.rapidFire = false;
      this.shield = false;
    }
    move(keys, canvasWidth) {
      if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
      if (keys["ArrowRight"] && this.x + this.width < canvasWidth) this.x += this.speed;
    }
    canShoot() {
      const delay = this.rapidFire ? 8 : 20;
      if (this.cooldown === 0) {
        this.cooldown = delay;
        return true;
      }
      return false;
    }
    updateCooldown() {
      if (this.cooldown > 0) this.cooldown--;
    }
  }

  // ======= Bullet =======
  class Bullet extends Entity {
    constructor(x, y, color, speed, isEnemy = false) {
      super(x, y, 5, 10, color);
      this.speed = speed;
      this.isEnemy = isEnemy;
    }
    update() { this.y += this.speed; }
  }

  // ======= Enemy Base Class =======
  class Enemy extends Entity {
    constructor(x, y, color = "red") {
      super(x, y, 30, 20, color);
      this.speed = 2;
    }
    update() { this.y += this.speed * 0.2; }
    shoot(probability = 0.003) {
      if (Math.random() < probability) return new Bullet(this.x + this.width/2, this.y + this.height, "yellow", 4, true);
      return null;
    }
  }

  // ======= Fast Enemy =======
  class FastEnemy extends Enemy {
    constructor(x, y) { super(x, y, "orange"); this.speed = 4; }
    update() { this.y += this.speed * 0.4; this.x += Math.sin(this.y/20)*3; }
  }

  // ======= Tank Enemy =======
  class TankEnemy extends Enemy {
    constructor(x, y) { super(x, y, "purple"); this.health = 3; }
    takeHit() { this.health--; return this.health <= 0; }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(this.health, this.x + 10, this.y + 15);
    }
  }

  // ======= PowerUp =======
  class PowerUp extends Entity {
    constructor(x, y, type) {
      const colors = { shield: "blue", rapid: "lime", health: "pink" };
      super(x, y, 15, 15, colors[type]);
      this.type = type;
      this.speed = 2;
    }
    update() { this.y += this.speed; }
  }

  // ======= Game =======
  class Game {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.tabIndex = 1;  // make canvas focusable
      this.canvas.focus();        // auto-focus

      this.keys = {};
      this.player = new Player(this.canvas.width/2-20, this.canvas.height-40);
      this.bullets = [];
      this.enemies = [];
      this.enemyBullets = [];
      this.powerUps = [];
      this.level = 1;
      this.score = 0;
      this.health = 3;
      this.highScore = localStorage.getItem("spaceDefenderHighScore") || 0;
      this.state = "title";

      window.addEventListener("keydown", e => this.keys[e.key] = true);
      window.addEventListener("keyup", e => this.keys[e.key] = false);

      requestAnimationFrame(() => this.update());
    }

    start() { this.state = "playing"; this.spawnWave(); }

    reset() {
      this.state = "title";
      this.bullets = [];
      this.enemies = [];
      this.enemyBullets = [];
      this.powerUps = [];
      this.level = 1;
      this.score = 0;
      this.health = 3;
      this.player = new Player(this.canvas.width/2-20, this.canvas.height-40);
    }

    spawnWave() {
      for (let i=0;i<6;i++) {
        for (let j=0;j<this.level;j++) {
          const rand = Math.random();
          if (rand<0.2) this.enemies.push(new FastEnemy(80+i*70,40+j*60));
          else if(rand<0.3) this.enemies.push(new TankEnemy(80+i*70,40+j*60));
          else this.enemies.push(new Enemy(80+i*70,40+j*60));
        }
      }
    }

    collision(a,b){
      return a.x<a.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y;
    }

    handleInput() {
      this.player.move(this.keys, this.canvas.width);
      if (this.keys[" "]) {
        if (this.player.canShoot()) {
          this.bullets.push(new Bullet(this.player.x+this.player.width/2-2, this.player.y, "lime", -6));
        }
      }
    }

    dropPowerUp(x,y){
      const types=["shield","rapid","health"];
      const type=types[Math.floor(Math.random()*types.length)];
      this.powerUps.push(new PowerUp(x,y,type));
    }

    activatePowerUp(type){
      if(type==="shield"){ this.player.shield=true; setTimeout(()=>this.player.shield=false,5000);}
      else if(type==="rapid"){ this.player.rapidFire=true; setTimeout(()=>this.player.rapidFire=false,5000);}
      else if(type==="health") this.health++;
    }

    update() {
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      if(this.state==="title") this.drawTitle();
      else if(this.state==="playing") {
        this.handleInput();
        this.updateGame();
      } else if(this.state==="gameover") this.drawGameOver();
      requestAnimationFrame(()=>this.update());
    }

    updateGame(){
      this.player.updateCooldown();

      // Bullets
      for(let i=this.bullets.length-1;i>=0;i--){
        const b=this.bullets[i]; b.update(); b.draw(this.ctx);
        if(b.y<0) this.bullets.splice(i,1);
      }

      // Enemies
      for(let i=this.enemies.length-1;i>=0;i--){
        const e=this.enemies[i]; e.update(); e.draw(this.ctx);
        const bullet = e.shoot? e.shoot(0.002+this.level*0.001):null;
        if(bullet) this.enemyBullets.push(bullet);
        for(let j=this.bullets.length-1;j>=0;j--){
          if(this.collision(this.bullets[j],e)){
            if(e instanceof TankEnemy){ if(e.takeHit()){ this.enemies.splice(i,1); if(Math.random()<0.1) this.dropPowerUp(e.x,e.y);} }
            else { this.enemies.splice(i,1); if(Math.random()<0.1) this.dropPowerUp(e.x,e.y);}
            this.bullets.splice(j,1); this.score+=50; break;
          }
        }
      }

      // Enemy bullets
      for(let i=this.enemyBullets.length-1;i>=0;i--){
        const b=this.enemyBullets[i]; b.update(); b.draw(this.ctx);
        if(this.collision(b,this.player)){ if(!this.player.shield) this.health--; this.enemyBullets.splice(i,1);}
        else if(b.y>this.canvas.height) this.enemyBullets.splice(i,1);
      }

      // PowerUps
      for(let i=this.powerUps.length-1;i>=0;i--){
        const p=this.powerUps[i]; p.update(); p.draw(this.ctx);
        if(this.collision(p,this.player)){ this.activatePowerUp(p.type); this.powerUps.splice(i,1);}
        else if(p.y>this.canvas.height) this.powerUps.splice(i,1);
      }

      // HUD
      this.ctx.fillStyle="white"; this.ctx.font="18px Arial";
      this.ctx.fillText("Score: "+this.score,10,20);
      this.ctx.fillText("Health: "+this.health,500,20);
      this.ctx.fillText("Level: "+this.level,270,20);
      this.ctx.fillText("High Score: "+this.highScore,10,50);

      if(this.enemies.length===0){ this.level++; this.spawnWave(); }

      if(this.health<=0){ 
        this.state="gameover"; 
        if(this.score>this.highScore){ this.highScore=this.score; localStorage.setItem("spaceDefenderHighScore",this.highScore);}
      }
    }

    drawTitle(){ 
      this.ctx.fillStyle="white"; this.ctx.font="36px Arial"; this.ctx.fillText("🚀 Space Defender Pro",130,250);
      this.ctx.font="24px Arial"; this.ctx.fillText("Press ENTER to Start",190,300);
      this.ctx.fillText("⬅️ ➡️ to Move, SPACE to Shoot",140,340);
    }

    drawGameOver(){
      this.ctx.fillStyle="red"; this.ctx.font="36px Arial"; this.ctx.fillText("GAME OVER",200,250);
      this.ctx.fillStyle="white"; this.ctx.font="24px Arial"; this.ctx.fillText("Final Score: "+this.score,220,300);
      this.ctx.fillText("Press ENTER to Restart",180,340);
    }
  }

  // ======= Start Game =======
  new Game("gameCanvas");
</script>

