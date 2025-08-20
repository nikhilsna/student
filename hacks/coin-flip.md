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

<!-- Button allows the user to run the function flipCoin() -->
<button onclick="flipCoin()">Flip a Coin</button>

<!-- Display coin flip results here -->
<p id="flip-results" style="text-align: center;">Heads: 0; Tails: 0</p>

<script>
    // Defines variables to store the coin flip results
    let heads = 0;
    let tails = 0;
    
    // Function to randomly add to the heads or tails variable
    function flipCoin() {
        if (Math.floor(Math.random()*2) === 1) {
            heads++
        } else {
            tails++
        }

        // Updates the paragraph with the id "flip-results" to reflect the current results 
        document.getElementById("flip-results").innerHTML = `Heads: ${heads}; Tails: ${tails}`
    };
</script>