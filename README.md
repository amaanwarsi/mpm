# MPM – Minimal Package Manager

[![npm version](https://img.shields.io/npm/v/mpm.svg)](https://www.npmjs.com/package/mpm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MPM (Minimal Package Manager)** is a CLI tool that fetches **only the assets you need** (`.min.js`, `.css`, etc.) from npm packages without installing the entire `node_modules` tree.

Stop pulling gigabytes of dependencies just to get a single minified file. MPM resolves packages from the npm registry, extracts their tarballs, intelligently ranks the files, and copies the best candidate(s) into an `asset_modules/` folder (or your custom output directory). Built on top of npm for speed, low risk, and a familiar workflow.

## Why MPM?

- **Saves disk space** – no `node_modules` bloat, only the final assets.
- **Fast** – downloads only the tarball, extracts temporarily, and copies what matters.
- **Low risk** – doesn't execute any package code, never runs `postinstall`.
- **Smart ranking** – automatically picks the most likely asset (minified, inside `/dist`, matching package name, reasonable size).
- **Fallback to GitHub** – if npm fails, MPM scans GitHub repositories for the same asset patterns.
- **Tracks everything** – updates your `package.json` under an `"assets"` section for reproducibility.

### ⚠️ Important Note: Bundled Assets Only

This tool is specifically designed to fetch **standalone, bundled assets** (like UMD, IIFE, or pre-compiled CSS) meant to be served directly to the browser. 
If you download an ES Module or CommonJS file that contains internal dependencies (e.g., `import { debounce } from 'lodash'` or `require('./utils')`), that file will break in your project because APM intentionally **does not** download the `node_modules` tree. APM prioritizes fetching the absolute latest compiled changes directly from the npm registry for immediate use.

## Installation

```bash
npm install -g mpm
```

Or use `npx mpm` without installing.

## Commands

| Command             | Description                                                             |
|---------------------|-------------------------------------------------------------------------|
| `mpm get <pkg>`     | Fetch assets for specific package.                                      |
| `mpm update <pkg>`  | Update specifc package asset defined in `package.json`                  |
| `mpm delete <pkg>`  | Remove asset entries and delete the corresponding files from disk.      |

## Flags

| Flag               | Effect                                                                 |
|--------------------|------------------------------------------------------------------------|
| `--js`             | Only download JavaScript assets (prefers minified).                    |
| `--css`            | Only download CSS assets.                                              |
| `--all`            | Process all packages listed in `package.json` → `assets` section.      |
| `--out <path>`     | Custom output folder (default: `asset_modules/`).                      |
| `--version <ver>`  | Specific package version (e.g., `mpm get lodash --version 4.17.21`).   |
| `--force`          | Skip cache, re‑download and re‑extract the tarball.                    |

## `package.json` integration

MPM writes an `"assets"` object into your `package.json`. Example:

```json
{
  "assets": {
    "preline": {
      "version": "2.0.1",
      "files": ["dist/preline.min.js"],
      "type": "js",
      "out": "assets/ui.js"
    },
    "bootstrap": {
      "version": "5.3.0",
      "files": ["dist/css/bootstrap.min.css"],
      "type": "css",
      "out": "asset_modules/bootstrap.css"
    }
  }
}
```

- `files` – the exact file(s) that were selected (can be overridden manually).
- `type` – `"js"` or `"css"`.
- `out` – where the file was copied (relative to project root).

Running `mpm update` will re‑fetch each package and replace the `out` file with the newly selected asset (useful when a package releases a new version).

## How it works (the ranking engine)

When a tarball is extracted, MPM scans for `.min.js`, `.js`, and `.css` files, focusing on directories like `/dist`, `/build`, `/cdn`, `/lib`. Each file receives a score:

| Positive signal                      | Score |
|--------------------------------------|-------|
| File is `.min.js`                    | +10   |
| File is `.css`                       | +8    |
| Inside `/dist`                       | +10   |
| Inside `/build`                      | +8    |
| Filename matches the package name    | +6    |
| File size between 20 KB and 500 KB   | +5    |

| Negative signal                      | Score |
|--------------------------------------|-------|
| Inside `/src`                        | -10   |
| Contains `test`, `spec`, `example`, `config` | -20   |
| File size < 5 KB                     | -5    |

The file with the **highest score** is selected. If you use `--js` or `--css`, only the best file of that type is chosen.

**Tie-Breaker Logic:** If two files receive the exact same score (e.g., `/dist/bundle.min.js` and `/dist/index.min.js`), the engine breaks the tie by prioritizing:
1. Files whose name exactly matches the package name.
2. Files named `index` or `main`.
3. The file with the shortest folder depth.

## Fallback: GitHub resolver

If the npm registry lookup fails (e.g., package is private, deprecated, or missing a tarball), MPM will:

1. Search GitHub for a repository matching the package name.
3. Fetch the repository’s file tree (default branch).
4. Apply the **same ranking engine** to locate the asset.
5. Download the raw file directly (no tarball extraction).

This ensures you still get the asset even when the npm metadata is incomplete.

## Examples

### Get a JavaScript asset (default)

```bash
mpm get lodash
```

Output:
```
✔ Resolved lodash@4.17.21
✔ Extracted tarball to temporary folder
✔ Best candidate: lodash.min.js (score 31)
✔ Copied to asset_modules/lodash.min.js
✔ Updated package.json
```

### Get only the CSS from Bootstrap

```bash
mpm get bootstrap --css --out static/css
```

### Fetch all assets listed in `package.json`

```bash
mpm get --all
```

### Update everything

```bash
mpm update
```

### Remove Preline assets

```bash
mpm delete preline
```

### Force re‑download a specific version

```bash
mpm get jquery --version 3.6.0 --force
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/yourusername/mpm).  
Make sure to run tests (`npm test`) and follow the existing code style.

## License

MIT © Amaan Warsi
```
