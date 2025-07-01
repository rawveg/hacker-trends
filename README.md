# Hacker Trends

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

A real-time dashboard for analyzing trends and sentiment on Hacker News, powered by React and Supabase.

**Live Demo:** [https://hacker-trends.vercel.app/](https://github.com/rawveg/hacker-trends)

![Hacker Trends Dashboard](https://raw.githubusercontent.com/rawveg/hacker-trends/main/pasted-image-2025-07-01T15-58-12-154Z.png)

## Features

- **Real-time Dashboard**: View live data from Hacker News with multiple interactive charts.
- **Live Ticker**: A scrolling ticker of the current front-page stories.
- **Interactive Visualizations**: Includes a Keyword Cloud, Submission Activity Heatmap, Sentiment Distribution Donut Chart, and more.
- **Deep-Dive Analysis**: Click on any data point—a keyword, a time slot, a sentiment category—to navigate to a detailed analysis page.
- **Story & Comment Explorer**: A full-featured view to read story comments and their sentiment scores.
- **Supabase Backend**: Utilizes Supabase Edge Functions for efficient data fetching and processing from the Hacker News API.
- **Theming**: Light and dark mode support.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Data Visualization**: Recharts
- **Backend & Data**: Supabase (Edge Functions)
- **Data Fetching**: React Query

## Getting Started

### 1. Supabase Setup

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Deploy Edge Functions**: For each function in the `supabase/functions` directory of this repository:
    -   Create a new Edge Function in your Supabase dashboard.
    -   Copy the code from the corresponding file in this repository into the new function.
    -   Deploy the function.
3.  **Get Credentials**: In your Supabase project, go to `Project Settings` > `API` and find your **Project URL** and `anon` **public** key.

### 2. Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rawveg/hacker-trends.git
    cd hacker-trends
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    -   Create a new file named `.env` in the root of the project.
    -   Copy the contents of `.env.example` into it.
    -   Replace the placeholder values with your actual Supabase URL and anon key from the previous step.
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY_HERE"
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:8080`.

## Deployment to Vercel

1.  **Push to GitHub**: Push your project to your GitHub repository.
2.  **Import Project**: Go to [Vercel](https://vercel.com), click `Add New...` > `Project`, and import your GitHub repository.
3.  **Configure Environment Variables**: In the Vercel project settings, navigate to the `Environment Variables` section. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values from your Supabase project.
4.  **Deploy**: Vercel will automatically build and deploy your application.

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See the [LICENSE](LICENSE) file for details.