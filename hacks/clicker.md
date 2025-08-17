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

<button onclick="buyUpgrade('minion')">Buy Minion</button>
<button onclick="buyUpgrade('billy')">Buy Billy</button>
<button onclick="buyUpgrade('robot')">Buy Robot</button>

<p id="minion-cost">Cost of Minion: 10 coins</p>
<p id="total-minions">Total Minions: 0</p>

<p id="billy-cost">Cost of Billy: 100 coins</p>
<p id="total-billies">Total Billies: 0</p>

<p id="robot-cost">Cost of Robot: 500 coins</p>
<p id="total-robots">Total Robots: 0</p>

<script>
    let totalCoins = 0;

    // Upgrades go here
    let minion = 0; 
    let minionCost = 10;

    let billy = 0;
    let billyCost = 100;

    let robot = 0;
    let robotCost = 500;

    // Add to total coins
    function processClick() {
        totalCoins++;
    };

    function buyUpgrade(upgrade) {
        switch(upgrade) {
            case "minion":
                if (totalCoins >= minionCost) {
                    // Add a minion
                    minion++;

                    // Subtract coins from cost
                    totalCoins -= minionCost;

                    // Increase minion cost
                    minionCost = 10 + (minion * minion)

                    // Update HTML Displays
                    document.getElementById("total-minions").innerHTML = `Total Minions: ${minion}`;
                    document.getElementById("minion-cost").innerHTML = `Cost of Minion: ${minionCost} coins`;
                }  
                break;

            case "billy":
                if (totalCoins >= billyCost) {
                    // Add a billy
                    billy++;

                    // Subtract coins from cost
                    totalCoins -= billyCost;
                    
                    // Increase billy cost
                    billyCost = 100 + (billy * billy * billy)

                    // Update HTML Displays
                    document.getElementById("total-billies").innerHTML = `Total Billies: ${billy}`;
                    document.getElementById("billy-cost").innerHTML = `Cost of Billy: ${billyCost} coins`;
                }
                break;

            case "robot":
                if (totalCoins >= robotCost) {
                    // Add a robot
                    robot++

                    // Subtract coins from cost
                    totalCoins -= robotCost;

                    // Increase robot cost
                    robotCost = 500 + (robot * robot * robot * robot)

                    // Update HTML Displays
                    document.getElementById("total-robots").innerHTML = `Total Robots: ${robot}`;
                    document.getElementById("robot-cost").innerHTML = `Cost of Robot: ${robotCost} coins`;
                }
                break;
        }
    }

    function applyUpgrades() {
        totalCoins += minion;
        totalCoins += billy * 3;
        totalCoins += robot * 5;
    }

    function updateTotalCoins() {
        document.getElementById("total-coins").innerHTML = `Total Coins: ${totalCoins}`;
    }

    setInterval(applyUpgrades, 1000);
    setInterval(updateTotalCoins, 10);
</script>