---
layout: page
title: Using Tools as a Team
hide: true
permalink: /teamtools
---

# Using Coding Tools in a Team

> Goals:
> Learn to use VS Code, GitHub, and Postman effectively
> Learn to use these tools to work with a team

### Tools Overview

VS Code

- A free code editor made by Microsoft
- Uses:
    - Writing/Editing code in various coding languages
    - Debugging code
    - Using extensions for various purposes
    - Live collaboration with Live Share

GitHub

- A platform for hosting and managing code using Git (a version control system)
- Uses:
    - Version control: Track and manage changes in code history
    - Collaboration: Multiple people are able to work on the same project without overwriting others work
    - Branching and Pull Requests: Add code safely and merge it into the main project

Postman

- An API development and testing tool
- Uses:
    - Sending requests (GET, POST, PUT, DELETE) to an API (your own or one off the internet)
    - Checking responses (JSON, XML, HTML, etc.)
    - Debugging backend services prior to merging with group code / connecting to frontend

### Using These Tools Together

VS Code --> Writing the code (frontend, backend, APIs)

GitHub --> Storing and sharing the code - where you get your team's code and where you give your team code

Postman --> Testing APIs and ensuring backend functionality before connecting it to frontend

![Alt text](images/Example_Workflow.png)

### GitHub Specifics

1. Setting up a repository
    - Create a New Repository on GitHub
        - Have teammates fork it or add them as collaborators
    - Clone it into VS Code (git clone <URL>)

2. Common Commands in VS Code terminal
    - git pull (pulls changes from GitHub into VS Code)
    - git stash (places your changes into a stash, temporarily removing them - usually used to pull code without conflicts)
    - git stash pop (removes changes from stash and adds them back into VS Code)

### Practice

1. VS Code
    - Create a file in VS Code
    - Install an extension
    - Use Live Share with a team member to edit code

2. GitHub
    - Create a repository on GitHub
    - Clone it into VS Code
    - Make a branch, edit a file, and push changes
    - Open a pull request (under contribute) and review another person's changes

3. Postman
    - Open Postman and send a request (GET) to a public API (find one on the internet)
    - Inspect the JSON response

> Hacks:
> Be able to work on files in VSCode,
> manage versions with GitHub and be able to push and pull,
> test APIs in Postman