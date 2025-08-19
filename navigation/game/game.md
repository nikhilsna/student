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
    import {addTiles, drawTiles} from './tile.js';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const keys = {};
    function keysDetection() {
        if (keys['w']) player.yv -= player.speed;
        if (keys['s']) player.yv += player.speed;
        if (keys['a']) player.xv -= player.speed;
        if (keys['d']) player.xv += player.speed;
    };
    //
    function update() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        keysDetection();
        player.xv *= 0.95;
        player.yv *= 0.95;
        player.x += player.xv;
        player.y += player.yv;
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x+canvas.width/2,player.y+canvas.height/2,25,25);
        requestAnimationFrame(update);
    };
    update();
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
  </script>
</body>
</html>