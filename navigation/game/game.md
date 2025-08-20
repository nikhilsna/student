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
    import {distance, updCollide} from './collide.js';
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
            if (t.life === 0) {
                t.life += 0.1;
                if (t.life >= 100) {
                    tiles.splice(i,1);
                    i--;
                    continue;
                }
            }
            if (checkOnscreen(t.x, t.y, width, height)) {
                tiles.splice(i,1);
                i--;
                continue;
            }
            if (t.type === 1) {
                if (updCollide(player,t,20)) {
                    player.health -= 15;
                    pointAt(t.x,t.y);
                    move(-1);
                }
                ctx.fillStyle = 'grey';
                ctx.fillRect((t.x-camera.x) + canvas.width/4-10, (t.y-camera.y) + canvas.height/4-10, 20, 20);
            } else if (t.type === 2) {
                if (updCollide(player,t,20)) {
                    console.log("collide")
                    player.health -= 15;
                    pointAt(t.x,t.y);
                    move(-1);
                }
                ctx.fillStyle = 'red';
                ctx.fillRect((t.x-camera.x) + canvas.width/4-10, (t.y-camera.y) + canvas.height/4-10, 20, 20);
            } else if (t.type === 3) {
                if (updCollide(player,t,20)) {
                    player.health += 15;
                    tiles.splice(i,1);
                    i--;
                }
                ctx.fillStyle = 'yellow';
                ctx.fillRect((t.x-camera.x) + (canvas.width/4)-5, (t.y-camera.y) + (canvas.height/4)-5, 10, 10);
            }
        }
    };
    //
    function wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    };
    //
    async function spawnTiles(waitTime) {
        while(true) {
            await wait(waitTime-(playTime/1000));
            console.log(Math.floor(playTime/1000))
            console.log(tiles)
            const temp = {
                x: Math.floor(Math.random()*(canvas.width-10))+camera.x,
                y: Math.floor(Math.random()*(canvas.height-10))+camera.y
            };
            addTile(temp.x,temp.y,Math.floor((Math.random()+1)*2));
        }
    };
    //
    var playTime = 0;
    function update() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //
        playTime += 0.1;
        drawTiles(canvas.width, canvas.height);
        //
        keysDetection();
        player.xv *= 0.95;
        player.yv *= 0.95;
        //
        player.x += player.xv;
        player.y += player.yv;
        //
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x+(canvas.width/2)-12.5,player.y+(canvas.height/2)-12.5,25,25);
        requestAnimationFrame(update);
    };
    //
    update();
    spawnTiles(3);
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