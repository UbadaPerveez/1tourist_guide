# Tourist Guide — Sustainable Karnataka Tourism

An AI-based tourism recommendation app that surfaces under-recognized Karnataka destinations instead of just popular hotspots.

## Prerequisites

Install these on your laptop first:

1. **Node.js** (v18 or newer) — download from https://nodejs.org and install.
2. **Git** — download from https://git-scm.com and install.

## Setup Steps

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a file named `.env` in the project root (same level as `package.json`) and add these two lines:

   ```
   VITE_SUPABASE_URL=https://jzxcgffpwlhdvnahcklr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eGNnZmZwd2xoZHZuYWhja2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDU2NDAsImV4cCI6MjEwNzM4MTY0MH0.Zh_tT6Z2PUwlfirtltyWmBLUZKUjqFPZY-uX5Y_gKkc
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` in your browser.

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds the app for production into the `dist/` folder |
| `npm run preview` | Serves the production build locally to test it |
| `npm run typecheck` | Checks TypeScript types for errors |
| `npm run lint` | Runs ESLint on the codebase |

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS for styling
- Supabase for the destination database
- lucide-react for icons
