# Dimensional Permit HUD

A holographic contact widget and badge combo that renders a glassmorphism control card (`index.html`) plus an embeddable floating verifier (`linkicp.js`). The experience mixes language toggling, canvas starfields, clipboard actions, drag-and-drop docking, and smart referrer detection so the permit always reflects the host page.

## Highlights
- **Zero-build stack**: vanilla HTML/CSS/JS with no dependencies beyond Google Fonts and Font Awesome.
- **Dynamic targeting**: the main permit derives the visiting host from URL parameters, explicit targets, or `document.referrer` and keeps CTA links aligned.
- **Text-scramble UI**: labels, ICP codes, and CTA states animate without blocking interaction.
- **Embeddable badge**: `linkicp.js` can be dropped into any site to surface the permit in a single line of HTML.
- **Automated injections**: the GitHub Action replaces `{{MY_EMAIL}}` and `{{MY_GITHUB}}` placeholders per deployment secrets.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main holographic permit, starfield background, language logic, and CTA interactions. |
| `linkicp.js` | Floating badge that auto-detects its base URL, displays the visitor domain, and deep-links back to the permit. |
| `.github/workflows/deploy.yml` | GitHub Pages workflow that injects secrets/variables before publishing to `gh-pages`. |
| `LICENSE` | MIT license text. |

## Configuration

`index.html` contains two placeholders that are replaced during deployment:

- `{{MY_EMAIL}}` → becomes the address copied by the “SUMMON ME” button.
- `{{MY_GITHUB}}` → feeds the primary GitHub CTA.

If the placeholders remain (for example when serving locally), the UI falls back to `void@dimension.null` and `https://github.com`. No additional build step is required.

## Local preview

```bash
# inside a clone of this repo
python3 -m http.server 4173
# visit http://localhost:4173
```

You can also open `index.html` directly in a browser, but serving over HTTP ensures referrer logic behaves the same as in production.

## Deploying to GitHub Pages

1. **Fork or clone the repository** into your GitHub account.
2. **Add deployment secrets/variables** under `Settings → Secrets and variables → Actions`:
   - Secret `MY_EMAIL`
   - Secret `MY_GITHUB`
   (You may also create repository variables with the same names; the workflow prefers secrets.)
3. **Push to `main` or `master`**. The `Deploy to GitHub Pages` workflow runs automatically and can also be triggered manually via *Run workflow*.
4. The workflow replaces the placeholders, publishes the entire repository to the `gh-pages` branch, and keeps it clean on every run.
5. In `Settings → Pages`, point GitHub Pages to the `gh-pages` branch (root). Your permit lives at `https://<user>.github.io/<repo>/`.

## One-click Cloudflare Pages deployment

1. Log in to Cloudflare and create a new **Pages** project.
2. Connect your Git provider and select this repository.
3. Use the following build settings:
   - **Framework preset**: `None`
   - **Build command**: leave empty (or `echo "skip"`)
   - **Build output directory**: `./`
4. Under *Environment variables*, add `MY_EMAIL` and `MY_GITHUB` with the values you want exposed on the card.
5. Kick off the first deployment. Cloudflare serves the static files as-is, so future pushes redeploy automatically.
6. (Optional) Map a custom domain under *Custom domains* for a branded permit URL and badge base.

## Embedding the floating badge

Place the badge script on any page you control (preferably near the end of `<body>`):

```html
<script async src="https://your-permit-domain.tld/linkicp.js"></script>
```

The script determines its own base URL, injects Font Awesome if necessary, and creates a draggable badge. When the badge is clicked, it opens the permit page with a `host` query parameter so `index.html` can display the originating site. Loading multiple pages with the same script automatically keeps the styling and copy consistent.

## License

MIT License © 2025 Prince. See [`LICENSE`](./LICENSE) for details.
