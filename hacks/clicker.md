---
layout: base
title: Clicker
permalink: /clicker/
---

<h2 style="text-align: center;">Clicker Game</h2>

<style>
    button {
        background-color: #636363;
        color: black;
        border-radius: 5px;
        font-family: "Lucida Console";
    }

    button:hover {
        background-color: #4a4949ff;
        transition: 0.5s;
    }

    button:active {
        background-color: #3b3b3b;
        transition: 0.25s;
    }

    .clicker {
        width: 800px;
        height: 200px;
        font-size: 30px;
        box-shadow: 1px 1px 1px white;
    }
    .coin-counter {
        font-size: 20px;
        text-align: center;
    }
    .upgrade-button {
        width: 100px;
        height: 50px;
        position: relative;
        left: 31%;
    }
    .restart-button {
        width: 100px;
        height: 50px;
        position: relative;
        left: 45%;
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
        <td id="minion-cost"></td>
        <td id="total-minions"></td>
    </tr>
    <tr>
        <td>Billy</td>
        <td id="billy-cost"></td>
        <td id="total-billies"></td>
    </tr>
    <tr>
        <td>Robot</td>
        <td id="robot-cost"></td>
        <td id="total-robots"></td>
    </tr>
</table>

<button onclick="restartProgress()" class="restart-button">Restart</button>

<script>
    let totalCoins = localStorage.getItem("saved-coins") ? localStorage.getItem("saved-coins") : 0;
    totalCoins = parseFloat(totalCoins)
    document.getElementById("total-coins").innerHTML = totalCoins

    // Upgrades go here
    // Minion Total & Cost
    let minion = localStorage.getItem("savedMinions") ? localStorage.getItem("savedMinions") : 0;
    document.getElementById("total-minions").innerHTML = minion;
    
    let minionCost = localStorage.getItem("savedMinionCost") ? localStorage.getItem("savedMinionCost") : 10;
    document.getElementById("minion-cost").innerHTML = minionCost;

    // Billy Total & Cost
    let billy = localStorage.getItem("savedBillies") ? localStorage.getItem("savedBillies") : 0;
    document.getElementById("total-billies").innerHTML = billy;

    let billyCost = localStorage.getItem("savedBillyCost") ? localStorage.getItem("savedBillyCost") : 100;
    document.getElementById("billy-cost").innerHTML = billyCost;

    // Robot Total  & Cost
    let robot = localStorage.getItem("savedRobots") ? localStorage.getItem("savedRobots") : 0;
    document.getElementById("total-robots").innerHTML = robot;

    let robotCost = localStorage.getItem("savedRobotCost") ? localStorage.getItem("savedRobots") : 500;
    document.getElementById("robot-cost").innerHTML = robotCost;

    // Add to total coins
    function processClick() {
        totalCoins++;
        localStorage.setItem("saved-coins", totalCoins);
    };

    function buyUpgrade(upgrade) {
        switch(upgrade) {
            case "minion":
                if (totalCoins >= minionCost) {
                    // Add a minion
                    minion++;

                    // Save new minion total
                    localStorage.setItem("savedMinions", minion);

                    // Subtract coins from cost
                    totalCoins -= minionCost;

                    // Increase minion cost
                    minionCost = 10 + (minion * minion);

                    // Save new minion cost
                    localStorage.setItem("savedMinionCost", minionCost);

                    // Update HTML Displays
                    document.getElementById("total-minions").innerHTML = `${minion}`;
                    document.getElementById("minion-cost").innerHTML = `${minionCost}`;
                }  
                break;

            case "billy":
                if (totalCoins >= billyCost) {
                    // Add a billy
                    billy++;

                    // Save new billy total
                    localStorage.setItem("savedBillies", billy)
                    

                    // Subtract coins from cost
                    totalCoins -= billyCost;
                    
                    // Increase billy cost
                    billyCost = 100 + (billy * billy * billy);

                    // Save new billy cost
                    localStorage.setItem("savedBillyCost", billyCost);

                    // Update HTML Displays
                    document.getElementById("total-billies").innerHTML = `${billy}`;
                    document.getElementById("billy-cost").innerHTML = `${billyCost}`;
                }
                break;

            case "robot":
                if (totalCoins >= robotCost) {
                    // Add a robot
                    robot++

                    // Save new robot total
                    localStorage.setItem("savedRobots", robot);

                    // Subtract coins from cost
                    totalCoins -= robotCost;

                    // Increase robot cost
                    robotCost = 500 + (robot * robot * robot * robot);

                    // Save new robot cost
                    localStorage.setItem("savedRobotCost", robotCost);

                    // Update HTML Displays
                    document.getElementById("total-robots").innerHTML = `${robot}`;
                    document.getElementById("robot-cost").innerHTML = `${robotCost}`;
                }
                break;
        }
    }

    function applyUpgrades() {
        totalCoins += minion * 0.1;
        totalCoins += billy * 0.3;
        totalCoins += robot * 0.5;
        localStorage.setItem("saved-coins", totalCoins);
    }

    function updateTotalCoins() {
        document.getElementById("total-coins").innerHTML = `Total Coins: ${totalCoins.toFixed(1)}`;
    }

    function restartProgress() {
        localStorage.clear();
        location.reload();
    }

    setInterval(applyUpgrades, 100);
    setInterval(updateTotalCoins, 10);
</script>