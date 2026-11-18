# Sushmita Behera, portfolio

Source for https://sushmitab93.github.io. GitHub Pages builds it with Jekyll automatically, so you don't need to install anything.

## Publish it

1. Create a public repo named exactly `Sushmitab93.github.io`.
2. Upload everything in this folder to the repo's main branch (on GitHub: **Add file > Upload files**, then drag the folder contents in).
3. In the repo, go to **Settings > Pages** and check that the source is "Deploy from a branch", branch `main`, folder `/ (root)`.
4. After a minute or two, the site is live at https://sushmitab93.github.io.

## Before you publish

- `_config.yml`: add your email and LinkedIn URL.
- Add your resume as `assets/Sushmita_Behera_Resume.pdf`.
- `_projects/post-earnings-forecast.md`: fill in the "My contribution" box.

## Add a project

Copy any file in `_projects/`, rename it, and edit the details at the top:

| Field | What it's for |
|---|---|
| `order` | Position on the homepage and in previous/next links |
| `featured` | `true` puts it in Selected work with an image; `false` puts it in More projects |
| `image` | Image for featured projects, stored in `assets/img/` |
| `summary`, `problem`, `role`, `result`, `stack` | The project card and the summary box on its page |
| `code`, `demo` | GitHub link, plus an optional demo link (`demo_label` changes its text) |

Write the case study below the second `---` in Markdown.

## Add a blog post

Create a file in `_posts/` named like `2026-12-01-my-post-title.md`:

```
---
title: My post title
---
Your post in Markdown.
```

A Writing section appears on the homepage automatically once the first post exists.
