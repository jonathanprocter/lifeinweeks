# Life in Weeks

Visualizes a human lifespan one week at a time. The app is built with React and Tailwind CSS and can be deployed directly to GitHub Pages.

## Development

Install dependencies and generate the static files in `docs/`:

```bash
npm install
npm run build
```

To preview locally run:

```bash
npm start
```

This serves the `docs/` folder on <http://localhost:3000>.

After running the build you can also open `docs/index.html` directly in a
browser. The bundled `app.js` mounts the app automatically.

## GitHub Pages Deployment

Enable GitHub Pages from the repository settings and choose the `docs/` folder on the `main` branch as the source. After pushing your changes and running `npm run build`, GitHub Pages will serve the site at `https://<username>.github.io/<repository>`.

