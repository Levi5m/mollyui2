# Admin UI

A React + Vite front-end (FiveM NUI admin dashboard).

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `build/`.

## Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
automatically on every push to `main`.

1. Push this project to a new GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).
5. Your site will be live at `https://<username>.github.io/<repo-name>/`.

No manual build step is required — the workflow handles `npm install` and
`npm run build` for you and publishes the `build/` folder.

## Note on the GitHub Pages preview

This UI is built to run inside the FiveM game client (NUI/CEF) and talk to a
Lua backend via `fetchNui`. When viewed on GitHub Pages (i.e. in a normal
browser, outside the game), any screen that doesn't have `mockData` wired up
in its `fetchNui` call will show blank or default state, since there's no
FiveM resource behind it to respond. This is expected — it's a visual/code
preview, not a working admin panel outside the game.
