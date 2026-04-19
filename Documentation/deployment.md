# Deploying Frontend to Vercel

This guide outlines exactly how to deploy the Vite frontend of StarGazerChat securely and functionally to Vercel.

## 1. Connecting Git
1. Log in to your Vercel Dashboard.
2. Select **Add New... > Project**.
3. Import the `StarGazerChat-FrontEnd` GitHub repository.

## 2. Configuration Options
Before hitting deploy, you MUST configure the build parameters correctly, because the Vite application lives inside a nested folder, not the repository root!

- **Framework Preset**: Vercel should auto-detect `Vite`.
- **Root Directory**: Click "Edit" and type `StarGazerChat`. (This tells Vercel where the `package.json` actually lives).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
Under the Environment Variables tab, inject any URLs that differ inside `config.js` or `.env` files that orchestrate where your backend lives (e.g. your Railway URL). Note that you may need to update the frontend code to consume `import.meta.env` dynamically if you hardcoded `config.js`.

## 3. Fixing SPA Routing (`vercel.json`)
Because Vite builds a Single Page Application (SPA) using `react-router-dom`, directly navigating to a route like `https://your-app.vercel.app/profile` will return a Vercel **404 Error**. Vercel servers don't inherently know how to route paths inside Vite without instructions.

To fix this, you must instruct Vercel to route any unknown paths back to the `index.html` file.
Create a file named `vercel.json` inside your `StarGazerChat` frontend root directory with the following contents:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "action": "/index.html"
    }
  ]
}
```

## 4. Common Gotchas (Case Sensitivity)
**Windows vs. Linux Discrepancies**
If you developed this application purely on Windows, your local machine might ignore capitalization in import extensions (e.g. `import AuthProvider from './Authcontext'`).
However, Vercel deploys natively upon strict Linux environments. If your file is named `AuthContext.jsx` but you import it using a lowercase `c`, the build **will crash** on Vercel despite working perfectly on localhost!
**Always ensure exact case-pairing for your import statements.**


