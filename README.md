# Global RepSpheres

This project is a React application. The sections below outline prerequisites, setup steps, useful npm scripts and environment variables, and notes on deploying the app to Netlify.

## Prerequisites

- **Node.js**: version 18 or higher is recommended.
- **npm**: comes bundled with Node. Run `npm install` once after cloning the repo to install dependencies.

## Useful npm scripts

- `npm start` – launches the development server with hot reloading.
- `npm run build` – creates a production build in the `build` directory.

## Environment variables

The app expects two environment variables to reach the Supabase backend:

```bash
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-supabase-key>
```

You can place them in a local `.env` file or configure them in your deployment environment.

## Deploying to Netlify

A basic configuration is provided in `netlify.toml`. Netlify should use the build command `npm run build:netlify` and publish the `build` folder. Be sure to add the `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` variables in the Netlify UI under **Site settings → Environment variables**.


