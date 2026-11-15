# Portfolio (React + Vite)

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
```

## Customize
- **Content:** edit `src/data.js` (name, intro, projects, skills, experience, links).
- **Project images:** put files in `public/` and set `image: "/my-shot.png"` on a project.
- **Photo:** replace `public/profile.png` with your own (a transparent-background PNG looks best).
- **Resume:** put `resume.pdf` in `public/` and set `resumeUrl: "/resume.pdf"` in `src/data.js`.
- **Colors / fonts:** edit the CSS variables at the top of `src/styles.css`.
- **Page title:** edit `index.html`.

## Build & deploy
```bash
npm run build      # outputs to dist/
npm run preview    # test the production build locally
```
Upload `dist/` to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
(GitHub Pages under a repo name: set `base: "/repo-name/"` in `vite.config.js`.)

## Structure
```
src/
  main.jsx            entry point
  App.jsx             assembles the sections
  data.js             all your content
  styles.css          styling + animations
  components/         Header, Hero, About, Projects (carousel), CaseStudy,
                      Contact, Footer, Reveal
  hooks/              useActiveSection (nav highlight)
```
