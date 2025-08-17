---
layout: base
title: Clicker
permalink: /clicker/
---

## Clicker Game

<style>
    .clicker {
        width: 800px;
        height: 200px;
        color: white;
        font-size: 30px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }
    .coin-counter {
        color: white;
        font-size: 20px;
        text-align: center;
    }
    .upgrade-button {
        width: 100px;
        height: 50px;
        color: white;
        border-radius: 3px;
        position: relative;
        left: 31%;
    }
</style>

<!-- Clicker Button-->
<button onclick="processClick()" class="clicker">Click Here</button>

<p id="total-coins" class="coin-counter">Total Coins: 0</p>

<button onclick="buyUpgrade('minion')" class="upgrade-button">Buy Minion</button>
<button onclick="buyUpgrade('billy')" class="upgrade-button">Buy Billy</button>
<button onclick="buyUpgrade('robot')" class="upgrade-button">Buy Robot</button>

<table>
    <tr>
        <th>Upgrade</th>
        <th>Cost</th>
        <th>Total Amount</th>
    </tr>
    <tr>
        <td>Minion</td>
        <td id="minion-cost">10</td>
        <td id="total-minions">0</td>
    </tr>
    <tr>
        <td>Billy</td>
        <td id="billy-cost">100</td>
        <td id="total-billies">0</td>
    </tr>
    <tr>
        <td>Robot</td>
        <td id="robot-cost">500</td>
        <td id="total-robots">0</td>
    </tr>
</table>

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
                    document.getElementById("total-minions").innerHTML = `${minion}`;
                    document.getElementById("minion-cost").innerHTML = `${minionCost}`;
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
                    document.getElementById("total-billies").innerHTML = `${billy}`;
                    document.getElementById("billy-cost").innerHTML = `${billyCost}`;
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
                    document.getElementById("total-robots").innerHTML = `${robot}`;
                    document.getElementById("robot-cost").innerHTML = `${robotCost}`;
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