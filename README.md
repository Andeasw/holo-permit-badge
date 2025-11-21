# 🆔 Dimensional Permit (Holo-Badge)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-orange.svg)
![Style](https://img.shields.io/badge/style-Cyberpunk%20%2F%20Holographic-purple)

A visual identity system consisting of a **Glassmorphism Control Card** (`index.html`) and an **Embeddable Floating Widget** (`linkicp.js`).

Designed for developers to showcase their "digital identity" across multiple websites. The system features neon aesthetics, text scrambling effects, and a seamless handshake between the floating badge and the main permit card.

---

## ✨ Key Features

*   **⚡️ Zero-Build Architecture**: Pure Vanilla JS/CSS. No node_modules, no webpack. Just drop it and run.
*   **🔗 Context-Aware Linking**: The floating badge automatically detects the host domain and passes it to the permit card via URL parameters (e.g., `?host=google.com`), ensuring the "Landing Zone" always reflects the visitor's origin.
*   **🎨 Cyberpunk UI**:
    *   **Permit Card**: 3D tilt effect, canvas starfield background, and "decoding" text animations.
    *   **Badge**: Draggable, expandable on hover, and auto-hides when not needed.
*   **🤖 Automated Injection**: Includes a GitHub Action that automatically injects your Email and GitHub URL from repository secrets into the HTML during deployment.

## 📂 Project Structure

| File | Description |
| :--- | :--- |
| **`index.html`** | The core holographic permit. Handles the 3D visuals, parameter parsing, and user interactions. |
| **`linkicp.js`** | The client-side widget. Embed this on *other* websites. It auto-detects its own location and creates the floating badge. |
| **`.github/workflows`** | Contains the CI/CD logic to inject secrets and deploy to GitHub Pages. |

## ⚙️ Configuration

The project uses **placeholder injection** to keep your personal info out of the source code. The following strings in `index.html` are replaced at build time:

*   `{{MY_EMAIL}}` → Replaced with your contact email (triggers "Copy to Clipboard").
*   `{{MY_GITHUB}}` → Replaced with your GitHub profile URL.

> **Note:** If running locally without replacement, the system falls back to `void@dimension.null` and `https://github.com`.

## 🚀 Deployment Guide (GitHub Pages)

This project is optimized for GitHub Pages with a custom Workflow.

1.  **Fork** this repository.
2.  Go to **Settings** → **Secrets and variables** → **Actions**.
3.  Click **New repository variable** (recommended) or **New repository secret** and add:
    *   `MY_EMAIL`: Your actual email address.
    *   `MY_GITHUB`: Your profile link (e.g., `https://github.com/Andeasw`).
4.  Go to the **Actions** tab.
    *   Select **Deploy to GitHub Pages**.
    *   Click **Run workflow** (or simply push a commit to `main`).
5.  Once the workflow finishes (Green ✅):
    *   Go to **Settings** → **Pages**.
    *   Ensure **Source** is set to `Deploy from a branch`.
    *   Select **Branch**: `gh-pages` / `/ (root)`.

## 🔌 Embedding the Badge

To add the floating badge to your blog or personal site, simply add this **one line** of code before the closing `</body>` tag.

Replace the URL with the address of your deployed GitHub Pages:

```html
<!-- Replace with YOUR deployed repo URL -->
<script async src="https://<your-username>.github.io/<repo-name>/linkicp.js"></script>
```

### How it works:
1.  The script automatically calculates its own `baseUrl`.
2.  It detects the `hostname` of the page it is embedded on.
3.  It generates a link to your Permit Card: `https://.../index.html?host=current-site.com`.
4.  When clicked, your Permit Card reads the `?host=` parameter and displays "LANDING ZONE: CURRENT-SITE.COM".

## 🛠 Local Development

To preview the animations locally:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000
```

Open `http://localhost:8000`.
*To test the domain logic locally, try: `http://localhost:8000/?host=TEST-SYSTEM`*

## 📄 License

Released under the [MIT License](LICENSE).

---
*Magic does not come cheap.*
