<p align="center">
  <img src="docs/images/portfolio-logo.svg" alt="Intertwined ER monogram" width="96" height="96">
</p>

<h1 align="center">Personal Portfolio</h1>

<p align="center">
  My personal portfolio website — a place for the projects I build and the things I’m curious about.<br>
  <a href="https://eikrose.de">eikrose.de</a>
</p>

![Desktop portfolio with personal introduction and Sometime project showcase](docs/images/portfolio-desktop.png)

## About

I’m Eik, a student interested in coding, design, technology, and what comes next. This website brings together my projects, interests, and work in one place.

## Features

- A horizontal desktop layout with a responsive mobile view.
- English, German, and French localization.
- Interactive project presentations, including Sometime’s layered phone showcase.
- Subtle animations, photo interactions, and a custom ship scroll indicator.
- A text-only blog at `/blog` and a Sometime project story at `/work/sometime`.
- Direct project navigation, a contact scene, and reduced-motion support.

## Tech

React · TypeScript · Vite · CSS · Phosphor Icons

Typography: self-hosted, subsetted WOFF2 versions of Manrope, Lora, and Great Vibes.

## Running locally

```sh
npm ci
npm run dev
```

Build for production:

```sh
npm run build
```

The build prerenders the portfolio, blog, project story, and localized custom 404 page. Run `npm run check:pages` after building. With a local preview running, `npm run check:pages -- http://127.0.0.1:4173` also checks GET/HEAD responses before JavaScript.

The blog starts with an empty state. No posts have been published. The remaining project previews are unchanged.

See the [Cloudflare Workers guide](docs/deployment.md) for GitHub deployment, build settings, and the `eikrose.de` domain setup.
