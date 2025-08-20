---
layout: base
title: Coin Flip Documentation
permalink: /coin-flip-documentation/
---

## Coin Flip Documentation
This documentation will outline how the coin flip code works and what improvements **YOU** can make.


### How the Code Works

#### Step 1: Define the Variables
```
let heads = 0;
let tails = 0;
```

By defining the variables **heads** and **tails**, we will be able to store how many times either one is flipped.


#### Step 2: Make a function that has a 50-50 chance of adding to the value of heads or tails
```
function flipCoin() {
    if (Math.floor(Math.random()*2) === 1) {
        heads++
    } else {
        tails++
    }
}
```
The key thing to point out is the use of the Math.random() function which is a built-in function provided by the creators of JavaScript which allows us coders to utilize randomness (such as with a coin flip).


#### Step 3: Make a button so the user can interact with the function
```
<button onclick="flipCoin()">Flip a Coin</button>
```
With buttons, you can make them run a function by adding onclick="functionHere()" to the first tag.

#### Step 4: Display the results

```
<p id="flip-results" style="text-align: center;">Heads: 0; Tails: 0</p>
```

The first step is making something in HTML, such as a paragraph where the results will be displayed. You can connect it later to JavaScript by giving it an ID.

Once you do this, we then add back to our flipCoin() function to update the HTML with the new results each time.

```
function flipCoin() {
        if (Math.floor(Math.random()*2) === 1) {
            heads++
        } else {
            tails++
        }

        document.getElementById("flip-results").innerHTML = `Heads: ${heads}; Tails: ${tails}`
    };
```


### What You Can Add
While the foundational code has been set up for you, there is a lot more you can add, and the list below is a handful of examples:
1. Save the results so the user can access them if they come back to the site later (hint: local storage)
2. Save milestones (what side got to 10, 100, 1000 first)
3. Add a button to reset progress (particularly helpful if you do the first example)
4. Add the ability to guess what the coin will be before flipping
5. Add a streak counter of correct guesses if example 4 is implemented

You can use these or other examples you think of to expand upon the code. 

