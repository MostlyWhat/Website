# 🚀 MostlyWhat Systems

<img src="lighthouse-score.png" align="right"
     alt="Lighthouse Score" width="100" height="358">

**Introducting** the next-generation website for the [MostlyWhat Systems](https://mostlywhat.systems) company.

## Features

- ✅ Integration with **Tailwind CSS** ([@astrojs/tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/)) supporting **Dark mode**.
- ✅ **Production-ready** scores in [Lighthouse](https://web.dev/measure/) and [PageSpeed Insights](https://pagespeed.web.dev/) reports.
- ✅ **Fast and SEO friendly blog** with automatic **RSS feed** ([@astrojs/rss](https://docs.astro.build/en/guides/rss/)), [**MDX** support](https://docs.astro.build/en/guides/integrations-guide/mdx/), **Categories & Tags**, **Social Share** buttons, ...
- ✅ **Image optimization** ([@astrojs/images](https://docs.astro.build/en/guides/integrations-guide/image/)) and **Font optimization**.
- ✅ Generation of **project sitemap** based on your routes ([@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)).
- ✅ **Open Graph tags** for social media sharing.
- ✅ **Analytics** built-in Google Analytics, and Splitbee integration.

<br>

[![License](https://img.shields.io/github/license/mostlywhat/website?style=flat-square&color=eeeeee&labelColor=000000)](https://github.com/mostlywhat/website/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/onwidget)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/mostlywhat/website#contributing)
[![Known Vulnerabilities](https://snyk.io/test/github/mostlywhat/website/badge.svg?style=flat-square)](https://snyk.io/test/github/mostlywhat/website)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=flat-square&logo=prettier&logoColor=F7BA3E)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=flat-square&logo=eslint&logoColor=white)

<br>

<details open>
<summary>Table of Contents</summary>

- [Demo](#demo)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

<br>

## Live Preview of Releases

📌 [Live Release](https://www.mostlywhat.systems/)\
🧪 [Staging Release](https://beta.mostlywhat.systems/)

<br>

## Getting started

**MostlyWhat System's Website** is a website that uses [Astro 2.0](https://astro.build/blog/astro-2/) + [Tailwind CSS](https://tailwindcss.com/). The website focuses on simplicity, good practices and high performance.

Very little vanilla javascript is used only to provide basic functionality so that in the future developers can select other frameworks (React, Vue, Svelte, Solid JS...) to use and to continue to develop the project.

### Project structure

Inside the Project, you'll see the following folders and files:

```
/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── base.scss
│   ├── components/
│   │   ├── blog/
│   │   ├── common/
│   │   ├── widgets/
│   │   │   ├── Header.astro
│   │   │   └── ...
│   │   ├── Fonts.astro
│   │   └── Logo.astro
│   ├── content/
│   │   ├── post/
│   │   │   ├── post-slug-1.md
│   │   │   ├── post-slug-2.mdx
│   │   │   └── ...
│   │   └-- config.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ...
│   ├── pages/
│   │   ├── [...blog]/
│   │   │   ├── [category]/
│   │   │   ├── [tag]/
│   │   │   ├── [...page].astro
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├-- rss.xml.ts
│   │   └── ...
│   ├── utils/
│   ├── config.mjs
│   └── data.js
├── package.json
├── astro.config.mjs
└── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory if they do not require any transformation or in the `assets/` directory if they are imported directly.

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/mostlywhat/website/tree/main)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Update `config.mjs` and contents. Have fun!

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                             |
| :-------------------- | :------------------------------------------------- |
| `npm install`         | Installs dependencies                              |
| `npm run host`        | Starts the development server at current ip        |
| `npm run dev`         | Starts local dev server at `localhost:3000`        |
| `npm run build`       | Build your production site to `./dist/`            |
| `npm run preview`     | Preview your build locally, before deploying       |
| `npm run format`      | Format codes with Prettier                         |
| `npm run lint:eslint` | Run Eslint                                         |
| `npm run astro ...`   | Run CLI commands like `astro add`, `astro preview` |
| `npm run release`     | Run Github Actions to release on Github Release    |

<br>

### Configuration

Basic configuration file: `./src/config.mjs`

```javascript
const CONFIG = {
  name: 'MostlyWhat Website',

  origin: 'https://www.mostlywhat.systems',
  basePathname: '/', // Change this if you need to deploy to Github Pages, for example
  trailingSlash: false, // Generate permalinks with or without "/" at the end

  title: 'Example - This is the homepage title of Example', // Default seo title
  description: 'This is the homepage description of Example', // Default seo description
  defaultImage: 'image.jpg', // Default seo image

  defaultTheme: 'dark', // We only use dark mode but, Possible Values: "system" | "light" | "dark" | "light:only" | "dark:only"

  language: 'en', // Default language
  textDirection: 'ltr', // Default html text direction (Left-to-right) Values: "ltr" | "rtl"

  dateFormatter: new Intl.DateTimeFormat('en', {
    // Date format
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),

  googleAnalyticsId: false, // Or "G-XXXXXXXXXX",
  googleSiteVerificationId: false, // Or some value,

  blog: {
    disabled: false,
    postsPerPage: 4,

    post: {
      permalink: '/%slug%', // variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
      noindex: false,
      disabled: false,
    },

    list: {
      pathname: 'blog', // Blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // Category main path /category/some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // Tag main path /tag/some-tag
      noindex: true,
      disabled: false,
    },
  },
};
```

<br>

### Deployment

#### Deploy to Production (Automatic)

The project should be ready to deploy to production with a push to the `main` branch. The project uses Vercel to build and deploy to the cloud. The project also uses Github Actions to run tests and linting on every push.

#### Deploy to Production (Manual)

You can create an optimized production build with:

```shell
npm run build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

#### Deploy to Netlify

Clone this repository on own GitHub account and deploy to Netlify:

[![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mostlywhat/website)

#### Deploy to Vercel

Clone this repository on own GitHub account and deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmostlywhatt%2Fwebsite)

<br>

## Roadmap

- _Project_:
  - Optimize and Refractor Code for better performance and readability
- _Blog_:
  - Improve Blog Design
  - Implement Searching Feature
  -
- _Site-wide_:
  - Group Components according to their location and usage
- _Documentation_: Create detailed documentation with examples for each component and feature.

<br>

## Frequently Asked Questions

- None

<br>

## Contributing

If you have any idea, suggestions or find any bugs, feel free to open a discussion, an issue or create a pull request.
That would be very useful for me and I would be happy to listen and take action.

<br>

## Acknowledgements

Heavily modified from template initially created by [onWidget](https://onwidget.com) and maintained by [MostlyWhat](https://github.com/mostlywhat) and [contributors](https://github.com/mostlywhat/website/graphs/contributors).

<br>

## License

**This website** is licensed under the AGPL-3 license — see the [LICENSE](https://github.com/mostlywhat/website/blob/main/LICENSE.md) file for details.
