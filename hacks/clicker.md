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
        color: blue;
        border-radius: 5px;
        box-shadow: 5px 5px 5px red
    }
</style>


<button onclick="processClick()" class="clicker">
    Test
</button>

<p id="total-clicks">Total Clicks: 0</p>

<p>Get a minion worker:</p>

<button onclick="buyMinion()">
    Buy Minion
</button>

<p id="total-minions">Total Minions: 0</p>

<script>
    totalClicks = 0;

    // Upgrades go here
    minion = 0;

    // Add to total clicks
    function processClick() {
        totalClicks++
        // console.log(totalClicks)
    };

    function buyMinion() {
        minion++
        document.getElementById("total-minions").innerHTML = `Total Minions: ${minion}`
    }

    function applyUpgrades() {
        totalClicks += minion
        
    }

    function updateTotalClicks() {
        document.getElementById("total-clicks").innerHTML = `Total Clicks: ${totalClicks}`
    }

    setInterval(applyUpgrades, 1000)
    setInterval(updateTotalClicks, 10)
</script>