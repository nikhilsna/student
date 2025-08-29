---
layout: base
title: SASS Lesson
permalink: /sass-lesson/
---

## SASS Lesson
SASS stands for Syntactically Awesome Style Sheets and for good reason as in many regards, it is an upgrade to CSS. Understanding how SASS works allows you to style your website more **effectively**, with a more **organized** framework, and makes the overall styles **simpler**.

While this lesson will cover the fundamentals, more niche features can be found in the <a href="https://sass-lang.com/" target="_blank">official documentation</a>. 

### How it Works
SASS is a preprocessor, meaning it will take your SASS file, process it, and convert it into a CSS file that can be used by the actual site. Working with SASS allows for a couple of nifty features.

#### Variables
```
$primary-color: #999;
$secondary-color: #111;

body {
    background-color: $secondary-color;
    color: $primary-color;
}
```

A very helpful way of keeping styles consistent is defining colors as certain variables such as the primary color and secondary color of a website. To define a variable, use the following format:

```
$variable: value;
```

#### Nesting
CSS doesn't allow for nesting, while SASS does. As you should know with HTML, it keeps things simpler to visualize than without it.

SASS Version:
```
body {
    h1 {
        font-style: oblique;
    }
}
```

CSS Version:
```
body h1 {
    font-style: oblique;
}
```

#### Mixins
SASS mixins are conceptually the functions of SASS. They allow you to define multiple styles and reference them when you want to call those specific styles.

To define a mixin, use the following syntax: `@mixin mixin-name {styles here}`


### How it's Organized

### How to Modify
