---
layout: base
title: SASS Lesson
permalink: /sass-lesson/
---

## SASS Lesson
SASS stands for Syntactically Awesome Stylesheet and can be considered an "upgrade" to CSS. In terms of Open Coding Society and its child repositories, SASS serves as a means of centralizing and organizing styles for the entire site. So let's take a look on how's it organized in OCS and how to modify it.

### How's it Organized
On your own repository, you'll be able to find a folder called `_sass`. In this file is where all your modifications can be made.

Folder and subfolders:
```
- _sass
 - midnight
 - minima
 - nighthawk
```

An important thing to know is how sass is adding onto the styles that are imported by jekyll themes (OCS has it defaulted to a type of minima style), and so to modify these styles by minima, you must go to `_sass/minima/custom-styles.scss`

Let's take a deeper look into this file --->

**_sass/minima/custom-styles.scss:**

```
@import "nighthawk/main";
```

You may be asking yourself: **WHERE THE HECK ARE THE STYLES???**

And that is a valid question! And to find out, we need to recognize that the styles are being imported from `_sass/nighthawk/_main.scss` SO, LET's TAKE A LOOK!

```
@import "platformer-game";
@import "chatbot";
@import "hacks";
@import "navbar";
@import "bathroom";
@import "hallpass";
@import "search";
@import "calendar";
@import "blogs";
// aesthetihawk stuff
@import "materials/main.scss";
@import "elements/main.scss";


html,
body,
input,
textarea,
select {
    background-color: $background;
}
```

It is indeed more imports to other files, but let's choose `navbar.scss` to analyze.