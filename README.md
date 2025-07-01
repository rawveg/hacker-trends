<div align="center">

# 🔥 Hacker Trends

**Real-time analytics and sentiment analysis for Hacker News**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-orange.svg)](https://hacker-trends.vercel.app/)
[![Built with React](https://img.shields.io/badge/Built_with-React-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered_by-Supabase-3ECF8E.svg?logo=supabase)](https://supabase.com/)

*Transform Hacker News data into actionable insights with beautiful visualizations and real-time sentiment analysis*

[🎯 **Live Demo**](https://hacker-trends.vercel.app/) • [📖 **Quick Start**](#-quick-start) • [🚀 **Full Deployment Guide**](DEPLOYMENT.md) • [🐛 **Report Bug**](https://github.com/rawveg/hacker-trends/issues)

</div>

---

![](hacker-trends-dashboard.png)

---

## ✨ Features

### 📊 **Real-time Analytics Dashboard**
- **Live Data Visualization** - Interactive charts and graphs updated in real-time
- **Comprehensive Metrics** - Track stories, comments, domains, and user activity
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile

### 🎯 **Advanced Sentiment Analysis**
- **AI-Powered Insights** - Analyze comment sentiment across all stories
- **Trend Tracking** - Monitor sentiment changes over time
- **Domain-Based Analysis** - See how different sources perform

### 🔍 **Deep-Dive Exploration**
- **Interactive Story Explorer** - Click any data point to dive deeper
- **Keyword Analysis** - Explore trending topics and keywords
- **Comment Threading** - Full comment trees with sentiment scores
- **Activity Heatmaps** - Visualize submission patterns

### 🎨 **Beautiful User Experience**
- **Live Ticker** - Scrolling feed of current front-page stories
- **Dark/Light Themes** - Seamless theme switching
- **Customizable Settings** - Adjust ticker speed and preferences
- **Smooth Animations** - Polished interactions throughout

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Data & Analytics | Deployment |
|----------|---------|------------------|------------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | ![Recharts](https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge&logo=chart.js&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | ![Edge Functions](https://img.shields.io/badge/Edge_Functions-00D9FF?style=for-the-badge&logo=deno&logoColor=white) | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react&logoColor=white) | ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Hacker News API](https://img.shields.io/badge/HN_API-FF6600?style=for-the-badge&logo=y-combinator&logoColor=white) | ![Sentiment Analysis](https://img.shields.io/badge/Sentiment_AI-4285F4?style=for-the-badge&logo=google&logoColor=white) | |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | | | |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase CLI** (for backend setup)

### ⚡ Installation

#### 1️⃣ **Clone & Install**
```bash
git clone https://github.com/rawveg/hacker-trends.git
cd hacker-trends
npm install
```

#### 2️⃣ **Install Supabase CLI**
```bash
npm install -g supabase
```

#### 3️⃣ **Set Up Supabase Backend**

**Create a new Supabase project:**
1. Visit [supabase.com](https://supabase.com) and create a new project
2. Note your **Project Reference ID** from Settings → General

**Link and deploy:**
```bash
# Login to Supabase
supabase login

# Link your project (replace YOUR_PROJECT_REF with your actual project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all edge functions automatically
supabase functions deploy
```

This deploys three essential edge functions:
- `get-top-stories` - Fetches top 100 stories from Hacker News
- `get-comment-sentiments` - Analyzes sentiment of comments
- `get-story-with-comments` - Retrieves full story details with threaded comments

#### 4️⃣ **Configure Environment**

```bash
# Copy environment template
cp .env.example .env
```

Get your Supabase credentials:
```bash
# Get your project URL and anon key
supabase status
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

#### 5️⃣ **Start Development**
```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:8080](http://localhost:8080)

---

## 🌐 Production Deployment

For complete production deployment instructions, see our **[📖 Deployment Guide](DEPLOYMENT.md)**.

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy!

---

## 📱 Features Deep Dive

### 🎯 **Dashboard Widgets**

| Widget | Description | Interactions |
|--------|-------------|--------------|
| **Live Ticker** | Real-time scrolling feed of front-page stories | Hover to pause, click to visit |
| **Keyword Cloud** | Most mentioned words and topics | Click keywords for deep-dive analysis |
| **Sentiment Trend** | 24-hour sentiment analysis timeline | Click points for detailed breakdown |
| **Activity Heatmap** | Submission patterns by day/hour | Click cells to explore time periods |
| **Score vs Comments** | Story performance visualization | Click stories to read full content |
| **Domain Analysis** | Most discussed websites and sources | Click domains for filtered views |

### 🔍 **Deep-Dive Pages**

- **Story Explorer**: Full story content with threaded comments and sentiment scores
- **Keyword Analysis**: All stories mentioning specific terms or from specific domains
- **Sentiment Breakdown**: Comments categorized by positive, neutral, or negative sentiment
- **Activity Analysis**: Stories submitted during specific time periods

### ⚙️ **Customization Options**

- **Theme Selection**: Light, dark, or system preference
- **Ticker Speed**: Adjustable animation speed for the live ticker
- **Data Refresh**: Configurable update intervals

---

## 🔧 Development

### 🏗️ **Project Structure**

```
hacker-trends/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── supabase/
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── docs/                   # Documentation
```

### 🧪 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### 🔌 **Adding New Features**

1. **Frontend Components**: Add to `src/components/`
2. **New Pages**: Add to `src/pages/` and update routing in `src/App.tsx`
3. **Backend Functions**: Add to `supabase/functions/` and deploy with `supabase functions deploy`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Report Bugs**
- Use the [issue tracker](https://github.com/rawveg/hacker-trends/issues)
- Include detailed reproduction steps
- Provide browser and OS information

### ✨ **Suggest Features**
- Open a [feature request](https://github.com/rawveg/hacker-trends/issues)
- Describe the use case and expected behavior
- Include mockups or examples if possible

### 💻 **Submit Code**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 🧪 **Development Guidelines**

- Follow the existing code style
- Add TypeScript types for new features
- Test your changes on both desktop and mobile
- Update documentation for new features

---

## 🐛 Troubleshooting

### Common Issues

**Edge Functions Not Working**
```bash
# Check function deployment status
supabase functions list

# View function logs
supabase functions logs get-top-stories
```

**Environment Variables**
```bash
# Verify your environment setup
cat .env
supabase status
```

**CORS Errors**
- Ensure edge functions are properly deployed
- Check browser console for specific error messages

For more troubleshooting help, see our [Deployment Guide](DEPLOYMENT.md).

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0**.

**What this means:**
- ✅ You can use, modify, and distribute this software
- ✅ You can use it for commercial purposes
- ⚠️ You must disclose the source code of any modifications
- ⚠️ Network use is considered distribution (AGPL requirement)

See the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgments

- **Hacker News** - For providing the excellent API that powers this application
- **Supabase** - For the robust backend infrastructure and edge functions
- **Vercel** - For seamless deployment and hosting
- **The Open Source Community** - For the amazing tools and libraries that make this possible

---

<div align="center">

**⭐ Star this repository if you find it useful!**

Made with ❤️ by the Hacker Trends team

[🔝 Back to Top](#-hacker-trends)

</div>
</div>
