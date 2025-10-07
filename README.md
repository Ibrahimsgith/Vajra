<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1f93sGxN6OehVzaIBgDRwFPEBuVDNmOlw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment configuration

When deploying the React frontend to Vercel and the Express API to Render, the frontend needs to know where the backend lives.

You can provide the backend URL in one of two ways:

1. **Build-time environment variable** – set `VITE_API_BASE_URL` in your Vercel project settings (e.g. `https://your-service.onrender.com`). Vercel will rebuild the site with that value and the app will talk to the correct backend.
2. **Runtime configuration file** – update [`public/app-config.json`](public/app-config.json) and redeploy. This file is downloaded by the browser before the React app starts and is useful when you need to adjust the backend URL without another build.

If neither option is configured, production builds will show an error explaining that the backend URL is missing. Local development continues to default to `http://localhost:3001`.
