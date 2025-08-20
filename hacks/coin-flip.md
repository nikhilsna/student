---
layout: base
title: Coin Flip
permalink: /coin-flip/
---

<style>
    button {
        background-color: rgba(56, 87, 89, 1);
        color: white;
        font-size: 20px;
        font-weight: 700;
        width: 100%;
        height: 150px;
    }
</style>

<button onclick="flipCoin()">Flip a Coin</button>
<p id="flip-results" style="text-align: center;">Heads: 0; Tails: 0</p>

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