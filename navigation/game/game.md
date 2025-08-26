

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bumper Cars Game</title>
  <style>
    canvas {
      border: 1px solid #333;
      background: #b7b7b7ff;
      display: block;
      margin: 20px auto;
    }
  </style>
</head>
<body>
    <div style="position:relative; width:800px; height:600px; margin:0 auto;">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div id="mainMenu" style="position:absolute;top:0;left:0;width:800px;height:600px;background:#eee;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;">
            <h1 style="font-size:3em;margin-bottom:1em;">Bumper Cars</h1>
            <button id="startBtn" style="font-size:2em;padding:0.5em 2em;">Start Game</button>
        </div>
        <div id="deathScreen" style="position:absolute;top:0;left:0;width:800px;height:600px;background:rgba(0,0,0,0.8);color:white;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:20;">
        <h1 style="font-size:3em;margin-bottom:1em;">You Died</h1>
        <button id="restartBtn" style="font-size:2em;padding:0.5em 2em;">Restart</button>
        </div>
    </div>
  <script type="module">
    import { player, pointAt, move } from './move.js';
    import { camera, updateCamera, setCameraTarget } from './camera.js';
    import { tiles, addTile } from './tile.js';
    import { checkOnscreen } from './screen.js';
    import { distance, updCollide } from './collide.js';
    import { enemy, enemies, addEnemy, updEnemies, spawnEnemies } from './enemy.js';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const mainMenu = document.getElementById('mainMenu');
    const startBtn = document.getElementById('startBtn');
    const deathScreen = document.getElementById('deathScreen');
    const restartBtn = document.getElementById('restartBtn');
    let gameStarted = false;
    let gameOver = false;
    startBtn.addEventListener('click', () => {
      mainMenu.style.display = 'none';
      gameStarted = true;
      update();
      spawnTiles(3);
    });
    //
    restartBtn.addEventListener('click', () => {
      deathScreen.style.display = 'none';
      resetGame();
      update();
      spawnTiles(3);
    });
    // RESET FUNCTION
    function resetGame() {
      player.x = 0;
      player.y = 0;
      player.xv = 0;
      player.yv = 0;
      player.health = 100;
      player.coins = 0;
      gameOver = false;
      tiles.length = 0; // clear tiles
      playTime = 0;
    }
    //
    const keys = {};
    function keysDetection() {
        if (keys['w']) player.yv -= player.speed;
        if (keys['s']) player.yv += player.speed;
        if (keys['a']) player.xv -= player.speed;
        if (keys['d']) player.xv += player.speed;
    };
    function drawText() {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Health: ' + player.health, 20, 40);
        ctx.fillText('Coins: ' + player.coins, 20, 68);
    };
    function drawTiles(width,height) {
        for (let i = 0; i < tiles.length; i++) {
            const t = tiles[i];
            if (t.life === 0) {
                t.life += 0.1;
                if (t.life >= 100) {
                    tiles.splice(i,1);
                    i--;
                    continue;
                }
            }
            if (checkOnscreen(t.x, t.y, width, height)) {
                if (t.type === 1) {
                    if (updCollide(player,t,20)) {
                        pointAt(t.x,t.y);
                        move(distance(0,0,player.xv,player.yv));
                    }
                    ctx.fillStyle = 'black';
                    ctx.fillRect((t.x-camera.x) + (canvas.width/2)-10, (t.y-camera.y) + (canvas.height/2)-10, 20, 20);
                } else if (t.type === 2) {
                    if (updCollide(player,t,20)) {
                        console.log("collide")
                        player.health -= 1;
                        pointAt(t.x,t.y);
                        move(-5);
                    }
                    ctx.fillStyle = 'red';
                    ctx.fillRect((t.x-camera.x) + (canvas.width/2)-10, (t.y-camera.y) + (canvas.height/2)-10, 20, 20);
                } else if (t.type === 3) {
                    if (updCollide(player,t,20)) {
                        player.coins += 1;
                        tiles.splice(i,1);
                        i--;
                    }
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect((t.x-camera.x) + (canvas.width/2)-5, (t.y-camera.y) + (canvas.height/2)-5, 10, 10);
                }
            }
        }
    };
    function wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    };
    async function spawnTiles(waitTime) {
        while(true) {
            await wait(waitTime-(playTime/1000));
            console.log(Math.floor(playTime/1000))
            let rand = (Math.random()*2)-1;
            const temp = {
                x: Math.floor(rand*(canvas.width/2-20)+camera.x),
                y: Math.floor(rand*(canvas.height/2-20)+camera.y),
            };
            const t = Math.floor(Math.random() * 3) + 1;
            addTile(temp.x,temp.y,Math.floor(t));
            console.log(tiles)
        }
    };
    function border(width,height) {
        if (Math.abs(player.x) >= width) {
            player.xv *= -1;
            if (player.x > 0) {
                player.x = width;
            } else {
                player.x = -width;
            }
        }
        if (Math.abs(player.y) >= height) {
            player.yv *= -1;
            if (player.y > 0) {
                player.y = height;
            } else {
                player.y = -height;
            }
        }
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(6-camera.x, 6-camera.y, canvas.width-14, canvas.height-14);
    };
    var playTime = 0;
    function update() {
        if (gameOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //
        setCameraTarget(player);
        updateCamera();
        //
        playTime += 0.1;
        drawTiles(canvas.width, canvas.height);
        keysDetection();
        player.xv *= 0.9;
        player.yv *= 0.9;
        player.x += player.xv;
        player.y += player.yv;
        border(canvas.width/2 - 20, canvas.height/2 - 20);
        if (player.health <= 0) {
            player.health = 0;
            gameOver = true;
            deathScreen.style.display = 'flex';
            return;
        }
        ctx.fillStyle = 'blue';
        ctx.fillRect((player.x-camera.x)+(canvas.width/2)-12.5,(player.y-camera.y)+(canvas.height/2)-12.5,25,25);
        drawText();
        requestAnimationFrame(update);
    };
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
  </script>
</body>
</html>