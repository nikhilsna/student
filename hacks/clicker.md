---
layout: base
title: Computer Clicker
permalink: /computer-clicker/
---

## Computer Clicker
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

<p id="total-clicks">Total Clicks: 0</p>

<!--Info on Minions -->
<button onclick="buyMinion()">Buy Minion</button>

<p id="minion-cost">Cost of Minion: 10</p>
<p id="total-minions">Total Minions: 0</p>

<script>
    let totalClicks = 0;

    // Upgrades go here
    let minion = 0;
    let minionCost = 10

    // Add to total clicks
    function processClick() {
        totalClicks++
    };

    function buyMinion() {
        if (totalClicks >= minionCost) {
            // Add a minion
            minion++;

            // Subtract Clicks from cost
            totalClicks -= minionCost;

            // Increase minion cost
            minionCost += (minion * minion)

            // Update HTML Displays
            document.getElementById("total-minions").innerHTML = `Total Minions: ${minion}`;
            document.getElementById("minion-cost").innerHTML = `Cost of Minion: ${minionCost}`;
            
        } else {
            alert("You don't have enough for this!");
        }
    }

    function applyUpgrades() {
        totalClicks += minion;
    }

    function updateTotalClicks() {
        document.getElementById("total-clicks").innerHTML = `Total Clicks: ${totalClicks}`;
    }

    setInterval(applyUpgrades, 1000);
    setInterval(updateTotalClicks, 10);
</script>