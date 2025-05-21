# Global RepSpheres

This project is a React application. The sections below outline prerequisites, setup steps, useful npm scripts and environment variables, and notes on deploying the app to Netlify.

## Prerequisites

- **Node.js**: version 18 or higher is recommended.
- **npm**: comes bundled with Node. Run `npm install` once after cloning the repo to install dependencies.

## Useful npm scripts

- `npm start` – launches the development server with hot reloading.
- `npm run build` – creates a production build in the `build` directory.

## Environment variables

The app expects environment variables to reach both the Supabase backend and your custom backend on Render:

```bash
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-supabase-key>
REACT_APP_BACKEND_URL=<your-backend-url>
```

You can place them in a local `.env` file or configure them in your deployment environment.

The `REACT_APP_BACKEND_URL` variable should point to your deployed backend on Render (e.g. `https://osbackend-zl1h.onrender.com`). The app uses this URL to create Stripe Checkout sessions when visitors click **Subscribe** in the call-to-action section.

## Deploying to Netlify

A basic configuration is provided in `netlify.toml`. Netlify should use the build command `npm run build:netlify` and publish the `build` folder. Be sure to add the `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` variables in the Netlify UI under **Site settings → Environment variables**.


