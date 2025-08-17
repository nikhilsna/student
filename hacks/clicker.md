---
layout: base
title: Clicker
permalink: /computer-clicker/
---

## Clicker Game

<style>
    .clicker {
        width: 200px;
        height: 200px;
        color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }
</style>

<!-- Clicker Button-->
<button onclick="processClick()" class="clicker">Click Here</button>

<p id="total-coins">Total Coins: 0</p>

<!--Info on Minions -->
<button onclick="buyMinion()">Buy Minion</button>

<p id="minion-cost">Cost of Minion: 10 coins</p>
<p id="total-minions">Total Minions: 0</p>

<script>
    let totalCoins = 0;

    // Upgrades go here
    let minion = 0;
    let minionCost = 10;

    // Add to total coins
    function processClick() {
        totalCoins++;
    };

    function buyMinion() {
        if (totalCoins >= minionCost) {
            // Add a minion
            minion++;

            // Subtract Clicks from cost
            totalCoins -= minionCost;

            // Increase minion cost
            minionCost = 10 + (minion * minion)

            // Update HTML Displays
            document.getElementById("total-minions").innerHTML = `Total Minions: ${minion}`;
            document.getElementById("minion-cost").innerHTML = `Cost of Minion: ${minionCost} coins`;
            
        } else {
            alert("You don't have enough for this!");
        }
    }

    function applyUpgrades() {
        totalCoins += minion;
    }

    function updateTotalCoins() {
        document.getElementById("total-coins").innerHTML = `Total Coins: ${totalCoins}`;
    }

    setInterval(applyUpgrades, 1000);
    setInterval(updateTotalCoins, 10);
</script>