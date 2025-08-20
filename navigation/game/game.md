---
layout: post
title: Bumper Cars
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bumper Cars Game</title>
  <style>
    canvas {
      border: 1px solid #333;
      background: #eee;
      display: block;
      margin: 20px auto;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <script type="module">
    import {player} from './move.js';
    import {camera} from './camera.js';
    import {tiles, addTile} from './tile.js';
    import {checkOnscreen} from './screen.js';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    //
    const keys = {};
    function keysDetection() {
        if (keys['w']) player.yv -= player.speed;
        if (keys['s']) player.yv += player.speed;
        if (keys['a']) player.xv -= player.speed;
        if (keys['d']) player.xv += player.speed;
    };
    //
    function drawTiles(width,height) {
        for (let i = 0; i < tiles.length; i++) {
            const t = tiles[i];
            if (t.life > 0) {
                t.life -= 1;
                if (t.life <= 0) {
                    tiles.splice(i, 1);
                    i--;
                    continue;
                }
            }
            if (!checkOnscreen(t.x, t.y, width, height)) continue;
            ctx.fillStyle = t.type === 1 ? 'grey' : 'red';
            ctx.fillRect(t.x + canvas.width/4, t.y + canvas.height/4, 20, 20);
        }
    };
    //
    function wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    };
    //
    async function spawnTiles(waitTime) {
        while(true) {
            await wait(waitTime - (playTime/1000));
            console.log(Math.floor(playTime/1000))
            console.log(tiles)
            const temp = {
                x: Math.floor(Math.random()*canvas.width)+camera.x,
                y: Math.floor(Math.random()*canvas.height)+camera.y
            };
            addTile(temp.x,temp.y,Math.floor(Math.random()*2));
        }
    };
    //
    var playTime = 0;
    function update() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        playTime += 1;
        drawTiles(canvas.width, canvas.height);
        keysDetection();
        player.xv *= 0.95;
        player.yv *= 0.95;
        player.x += player.xv;
        player.y += player.yv;
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x+canvas.width/2,player.y+canvas.height/2,25,25);
        requestAnimationFrame(update);
    };
    //
    update();
    spawnTiles(5);
    //
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
  </script>
</body>
</html>