# Sushmita Behera, portfolio

Source for https://sushmitab93.github.io, my data analytics and machine learning portfolio. GitHub Pages builds it with Jekyll automatically, so nothing needs to be installed.

## Publish it

1. Create a public repo named exactly `Sushmitab93.github.io`.
2. Upload everything in this folder to the repo's main branch (on GitHub: **Add file > Upload files**, then drag in the folder's contents, not the folder itself). `_config.yml` should sit at the top level of the repo.
3. In the repo, go to **Settings > Pages** and check that the source is "Deploy from a branch", branch `main`, folder `/ (root)`.
4. After a minute or two, the site is live at https://sushmitab93.github.io. The **Actions** tab shows each build; a red X means a build failed, usually because of a typo in the settings block at the top of a file.

If you uploaded an earlier version of the site, delete these old files from the repo: `work.html` (replaced by `projects.html`) and `assets/img/pead_workflow.png` (no longer used).

## Still to do

- Add your resume as `assets/Sushmita_Behera_Resume.pdf`. Resume links and the Resume button appear automatically once the file is there.
- Optional: add a photo (square works best) to `assets/img/` and set `photo:` in `_config.yml`. It appears in the about section, which is text-only until then.

## Your details

Name, email, LinkedIn, GitHub, resume and photo are all set once in `_config.yml`, and every page uses them.

## Homepage sections, top to bottom

| Section | Where to edit |
|---|---|
| Name, role line and tagline | `index.html` |
| Email, LinkedIn and GitHub buttons | Links come from `_config.yml`. The Email button opens a small panel with a Copy email button. |
| Notebook cell (`sushmita.describe()`) | `index.html`: the rows in the `Out[1]` table |
| Featured projects | Projects with `featured: true` in `_projects/` |
| About text, photo and core tool logos | `index.html`; photo from `photo:` in `_config.yml`; logos marked `core: true` in `_data/tools.yml` |
| My journey (career and education) | `_data/journey.yml`, newest first; cards alternate left and right automatically |

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Projects (all projects) | `projects.html` |
| Experience (work experience and education) | `experience.html` |
| Skills (all tool logos, then the full list) | `skills.html`; logos from `_data/tools.yml` |
| Writing (appears in the menu once there's a post) | `writing.html` |
| Each project's case study | `_projects/*.md` |

## Add or edit a project

Copy any file in `_projects/`, rename it, and edit the details at the top:

| Field | What it's for |
|---|---|
| `order` | Position on the homepage, the Projects page and in previous/next links |
| `featured` | `true` shows it on the homepage and at the top of the Projects page with an image; `false` lists it under More projects |
| `image` | Image on the Projects page and the link-preview image when a case study is shared |
| `thumb` | Optional 16:9 image for the homepage card; falls back to `image` |
| `summary`, `problem`, `role`, `result`, `stack` | The project card and the summary box at the top of its page |
| `code`, `demo` | GitHub link, plus an optional demo link (`demo_label` changes its text) |

Write the case study below the second `---` in Markdown. Put any charts in `assets/img/` and add them like the existing case studies do.

## Add a blog post

Create a file in `_posts/` named like `2026-12-01-my-post-title.md`:

```
---
title: My post title
---
Your post in Markdown.
```

## Link previews

When the site link is shared on LinkedIn or in a message, it shows `assets/img/social-preview.png`. Case studies show their own `image`. The browser tab icon is `assets/img/favicon.svg`.

## Look and feel

- Colours for the light and dark themes are at the top of `assets/css/style.css`.
- Fonts are Manrope (headings) and Public Sans (body text), loaded in `_layouts/default.html`.
- The theme switch, the notebook typing effect and the email panel are in `assets/js/site.js`.
- Visitors get light or dark based on their system setting until they use the switch in the header.

Tool logos are from [Simple Icons](https://simpleicons.org) (CC0).
