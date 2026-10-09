# GitHub Pages homepage

This folder is a static, homepage-only export. GitHub Pages can serve these files, but it cannot run the local Node.js/SQL Server admin or database viewer.

## Build the latest homepage export

From the project folder in PowerShell, run:

```powershell
.uild-github-pages.ps1
```

The script copies the latest homepage design and writes `site-data.json` using the school details and notices saved by the local Site settings page. It excludes the local contact-message inbox. Review `github-pages\site-data.json` and the image before publishing because GitHub Pages content is public.

## Publish

Create a public GitHub repository for the website, and upload only the contents of this folder. In the repository settings, open **Pages**, select **Deploy from a branch**, choose the `main` branch and `/ (root)`, then save. GitHub Pages will show the published `github.io` URL in that settings page. Every time school details change locally, run the build script again and upload the updated `github-pages` contents.

The contact form sends a `POST` request to `/api/contact`. It works when this page is served by the Node website backend. GitHub Pages alone is static and has no `/api/contact` service, so host the backend and point the page to that API before accepting public submissions. The backend stores messages in `data/contact_messages.json`.
