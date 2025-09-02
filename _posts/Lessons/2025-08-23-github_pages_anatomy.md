---
layout: post
permalink: /gp
title: Github Pages Anatomy
categories: ['Lesson']
---

## Lesson 2: GitHub Pages Anatomy

---

<div style="border-left: 4px solid #38b2ac; padding-left: 1em; margin-bottom: 1em;">
  <strong style="color:#38b2ac;">Introduction</strong>
  <br>
  Understanding the anatomy of a GitHub Pages site is fundamental to effective web development within this ecosystem. This lesson dissects the core files and directories that constitute a typical GitHub Pages project, explaining their purpose and how they interact to build a functional website.
</div>

<div class="frq-box">
  <b>FRQ 1:</b> Why is it important to understand the structure of a GitHub Pages project before building a website?<br><br>
  <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
</div>

---

### Key Files and Directories

---

<div style="background:#f7fafc; border-radius:8px; padding:1em; box-shadow:0 2px 8px #38b2ac22;">
A GitHub Pages project is more than just a collection of HTML files. It&#39;s a structured environment where various file types work together. Here’s a breakdown of the essential components:
<ul>
<li><span style="color:#3182ce;"><strong>README.md</strong></span>: This is the instruction manual for your project. It should contain essential information, such as the project&#39;s purpose, setup instructions, and any other relevant details for collaborators or visitors. A well-crafted <code>README.md</code> is a hallmark of a professional GitHub project.</li>
<li><span style="color:#3182ce;"><strong>index.md or index.html</strong></span>: This is the homepage of your website. When a visitor navigates to the root of your GitHub Pages URL, this is the file that will be displayed. You can write it in Markdown (<code>.md</code>) for simplicity or directly in HTML for more complex layouts.</li>
<li><span style="color:#3182ce;"><strong>_config.yml</strong></span>: This is the central configuration file for your Jekyll-powered GitHub Pages site. It contains key-value pairs in YAML format that define site-wide settings, such as the site title, description, theme, and plugins. Careful configuration of this file is crucial for customizing your site&#39;s behavior and appearance.</li>
<li><span style="color:#3182ce;"><strong>_layouts</strong></span>: This directory contains the HTML templates that define the structure of your pages. Each page or post on your site can specify a layout in its frontmatter, and Jekyll will wrap the content of that page within the specified layout. This allows for consistent headers, footers, and overall page structure.</li>
<li><span style="color:#3182ce;"><strong>_includes</strong></span>: This directory holds reusable snippets of HTML that can be included in your layouts or pages. This is useful for components like navigation bars, footers, or sidebars that you want to appear on multiple pages.</li>
<li><span style="color:#3182ce;"><strong>_sass</strong></span>: This directory is where you can customize the styling of your site. It contains Sass (Syntactically Awesome Style Sheets) files, which are a more powerful way to write CSS. You can override the default styles of your theme or add your own custom styles here.</li>
<li><span style="color:#3182ce;"><strong>_posts</strong></span>: If you&#39;re creating a blog, this is where your blog posts will live. Each post is a Markdown or HTML file with a specific naming convention (<code>YYYY-MM-DD-title.md</code>) and contains frontmatter with metadata like the post title, date, and layout.</li>
<li><span style="color:#3182ce;"><strong>_notebooks</strong></span>: As discussed in the previous lesson, this directory is the standard location for Jupyter Notebook (<code>.ipynb</code>) files. These are typically converted to Markdown and then HTML during the build process.</li>
<li><span style="color:#3182ce;"><strong>_data</strong></span>: This directory is for storing structured data in formats like YAML, JSON, or CSV. This data can then be accessed and used throughout your site using Liquid templating.</li>
<li><span style="color:#3182ce;"><strong>images</strong></span>: This is the conventional directory for storing images used on your site. Keeping your images organized here makes them easy to reference in your Markdown or HTML files.</li>
<li><span style="color:#3182ce;"><strong>.gitignore</strong></span>: This file tells Git which files and directories to ignore when tracking changes. This is useful for excluding files that are generated during the build process or that contain sensitive information.</li>
</ul>
</div>

<div class="frq-box">
  <b>FRQ 2:</b> Which three files or directories do you think are the most important for beginners to focus on first, and why?<br><br>
  <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
</div>

---

### The Build Process

---

<div style="border-left: 4px solid #38b2ac; padding-left: 1em; margin-bottom: 1em;">
GitHub Pages uses Jekyll, a static site generator, to build your website. The process works as follows:
<ol>
<li><strong style="color:#38b2ac;">Jekyll reads your <code>_config.yml</code> file</strong> to understand your site&#39;s configuration.</li>
<li><strong style="color:#38b2ac;">It processes your Markdown, HTML, and Jupyter Notebook files</strong>, applying the layouts and includes you&#39;ve specified.</li>
<li><strong style="color:#38b2ac;">It generates a static HTML website</strong> in a <code>_site</code> directory (which is usually not committed to your repository).</li>
<li><strong style="color:#38b2ac;">GitHub Pages then serves these static HTML files</strong> to your visitors.</li>
</ol>
</div>

<div class="frq-box">
  <b>FRQ 3:</b> Describe the role of the <code>_site</code> directory in the build process. Why isn’t it usually committed to GitHub?<br><br>
  <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
</div>

---

### Conclusion

---

<div style="background:#e6fffa; border-radius:8px; padding:1em;">
By understanding the role of each file and directory in a GitHub Pages project, you gain the power to customize and control every aspect of your website. This foundational knowledge is essential for building robust and well-organized web projects.
</div>

<div class="frq-box">
  <b>FRQ 4:</b> Summarize how the anatomy of a GitHub Pages project helps developers maintain clean, scalable websites.<br><br>
  <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
</div>

<style>
.frq-box {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  background: #f9f9f9;
}
textarea {
  font-family: inherit;
  font-size: 1rem;
  padding: 6px;
  border-radius: 6px;
}
</style>

<script>
// Auto-save FRQ responses into localStorage
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".frq-box textarea").forEach((textarea, index) => {
    const key = "gp_frq_answer_" + index;

    // Load saved value if it exists
    const saved = localStorage.getItem(key);
    if (saved) {
      textarea.value = saved;
    }

    // Save on input
    textarea.addEventListener("input", () => {
      localStorage.setItem(key, textarea.value);
    });
  });
});
</script>