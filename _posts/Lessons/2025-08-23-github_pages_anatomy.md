---
layout: post
permalink: /gp
title: Github Pages Anatomy
categories: ['Lesson']
---


## Lesson 2: GitHub Pages Anatomy

### Introduction

Understanding the anatomy of a GitHub Pages site is fundamental to effective web development within this ecosystem. This lesson dissects the core files and directories that constitute a typical GitHub Pages project, explaining their purpose and how they interact to build a functional website.

### Key Files and Directories

A GitHub Pages project is more than just a collection of HTML files. It\'s a structured environment where various file types work together. Here’s a breakdown of the essential components:

*   **`README.md`**: This is the instruction manual for your project. It should contain essential information, such as the project\'s purpose, setup instructions, and any other relevant details for collaborators or visitors. A well-crafted `README.md` is a hallmark of a professional GitHub project.

*   **`index.md` or `index.html`**: This is the homepage of your website. When a visitor navigates to the root of your GitHub Pages URL, this is the file that will be displayed. You can write it in Markdown (`.md`) for simplicity or directly in HTML for more complex layouts.

*   **`_config.yml`**: This is the central configuration file for your Jekyll-powered GitHub Pages site. It contains key-value pairs in YAML format that define site-wide settings, such as the site title, description, theme, and plugins. Careful configuration of this file is crucial for customizing your site\'s behavior and appearance.

*   **`_layouts`**: This directory contains the HTML templates that define the structure of your pages. Each page or post on your site can specify a layout in its frontmatter, and Jekyll will wrap the content of that page within the specified layout. This allows for consistent headers, footers, and overall page structure.

*   **`_includes`**: This directory holds reusable snippets of HTML that can be included in your layouts or pages. This is useful for components like navigation bars, footers, or sidebars that you want to appear on multiple pages.

*   **`_sass`**: This directory is where you can customize the styling of your site. It contains Sass (Syntactically Awesome Style Sheets) files, which are a more powerful way to write CSS. You can override the default styles of your theme or add your own custom styles here.

*   **`_posts`**: If you\'re creating a blog, this is where your blog posts will live. Each post is a Markdown or HTML file with a specific naming convention (`YYYY-MM-DD-title.md`) and contains frontmatter with metadata like the post title, date, and layout.

*   **`_notebooks`**: As discussed in the previous lesson, this directory is the standard location for Jupyter Notebook (`.ipynb`) files. These are typically converted to Markdown and then HTML during the build process.

*   **`_data`**: This directory is for storing structured data in formats like YAML, JSON, or CSV. This data can then be accessed and used throughout your site using Liquid templating.

*   **`images`**: This is the conventional directory for storing images used on your site. Keeping your images organized here makes them easy to reference in your Markdown or HTML files.

*   **`.gitignore`**: This file tells Git which files and directories to ignore when tracking changes. This is useful for excluding files that are generated during the build process or that contain sensitive information.

### The Build Process

GitHub Pages uses Jekyll, a static site generator, to build your website. The process works as follows:

1.  **Jekyll reads your `_config.yml` file** to understand your site\'s configuration.
2.  **It processes your Markdown, HTML, and Jupyter Notebook files**, applying the layouts and includes you\'ve specified.
3.  **It generates a static HTML website** in a `_site` directory (which is usually not committed to your repository).
4.  **GitHub Pages then serves these static HTML files** to your visitors.

### Conclusion

By understanding the role of each file and directory in a GitHub Pages project, you gain the power to customize and control every aspect of your website. This foundational knowledge is essential for building robust and well-organized web projects.

---