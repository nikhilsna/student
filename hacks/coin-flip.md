---
layout: base
title: Coin Flip
permalink: /coin-flip/
---

<button onclick="flipCoin()">Flip a Coin</button>
<p id="flip-results"></p>

<script>
    let heads = 0;
    let tails = 0;

    function flipCoin() {
        if (Math.floor(Math.random()*2) === 1) {
            heads++
        } else {
            tails++
        }

        document.getElementById("flip-results").innerHTML = `Heads: ${heads}; Tails: ${tails}`
    };

  
</script>