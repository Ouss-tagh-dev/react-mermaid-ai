# 🌊 React Mermaid AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Groq](https://img.shields.io/badge/AI-Groq-orange)](https://groq.com/)

React Mermaid AI is a premium, AI-powered visual diagramming mini-SaaS. Built for software architects, developers, and product managers, it allows you to instantly generate, edit, and export high-definition Mermaid.js diagrams (Flowcharts, Sequence Diagrams, Gantt charts, etc.) using natural language prompts.

Powered by React, Vite, and the blazing-fast Groq API (`llama-3.3-70b-versatile`), this tool features a self-healing syntax correction loop to ensure your AI-generated diagrams are always 100% syntactically valid.

## ✨ Features

- **🧠 AI Generation**: Describe your system architecture or flow, and let AI build the diagram.
- **🛠️ Self-Healing Code**: Automatic syntax error detection and AI-driven correction loop.
- **💻 Pro Editor**: Integrated Monaco Editor with real-time rendering and syntax highlighting.
- **🎨 Premium UI/UX**: Glassmorphism design, dark/light modes with rich gradients and modern aesthetics.
- **📸 Ultra-HD Export**: Export your diagrams in crisp, high-resolution SVG, PNG, JPG, or WEBP (5x scale rendering).
- **🕹️ Interactive Canvas**: Zoom, pan, and explore large diagrams effortlessly.

## 🌐 Live Demo

Try the app now: **[https://react-mermaid-ai.netlify.app/](https://react-mermaid-ai.netlify.app/)**

### How to Use Online

1. **Visit the app**: Go to [https://react-mermaid-ai.netlify.app/](https://react-mermaid-ai.netlify.app/)
2. **Add your Groq API key**:
   - Click the **⚙️ Settings** icon in the top-right corner
   - Enter your [Groq API key](https://console.groq.com/) in the "API Key" field
   - (Optional) Select your preferred AI model
   - Click **Save**
3. **Start creating diagrams**:
   - Describe your diagram in natural language (e.g., "Create a flowchart for a user login flow")
   - Click **Generate** and watch AI create your diagram instantly
   - Edit, refine, and export your diagrams in multiple formats (SVG, PNG, JPG, WEBP)

**Note**: Your API key is stored securely in your browser's localStorage and never sent to any server.

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ouss-tagh-dev/react-mermaid-ai.git
   cd react-mermaid-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of the project and add your Groq API key:

   ```env
   VITE_GROQ_API_KEY=your_api_key_here
   VITE_GROQ_MODEL=llama-3.3-70b-versatile
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🚀 Deployment on Netlify

React Mermaid AI is fully configured for deployment on Netlify. The project includes a `netlify.toml` configuration file.

### Quick Setup

1. **Connect your GitHub repository to Netlify**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub account and select your forked repository

2. **Configure Environment Variables (Optional)**
   - In the Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
   - Add your Groq API key as an environment variable:
     ```
     VITE_GROQ_API_KEY=your_api_key_here
     VITE_GROQ_MODEL=llama-3.3-70b-versatile
     ```
   - **Note**: These are optional. Users can configure their own API key directly in the application's Settings UI.

3. **Deploy**
   - Netlify will automatically trigger a build and deploy your site
   - Your app will be live at your custom Netlify URL

### User Configuration (No API Key Required)

Users can run the app **without an environment variable**. When they open the application, they can:

1. Click the **Settings** icon (⚙️) in the header
2. Enter their own Groq API key
3. Select their preferred AI model
4. Save the configuration (stored securely in browser's localStorage)

This allows users to bring their own API keys and use the tool without needing server-side secrets.

## 🤝 How to Collaborate

We welcome contributions! If you'd like to help improve React Mermaid AI, please follow these steps:

1. **Fork the Repository**
   Create your own fork of the project on GitHub.

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Commit your Changes**
   Write clear, conventional commit messages.

   ```bash
   git commit -m "feat: add amazing new feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/amazing-new-feature
   ```

5. **Open a Pull Request**
   Describe your changes in detail and submit the PR for review.

### Code Guidelines

- **Language**: Ensure all code, variable names, and comments are written in professional **English**.
- **Design System**: Maintain the premium aesthetics. Use the established CSS variables for colors, shadows (`var(--shadow-lg)`), and glassmorphism effects (`backdrop-filter`).
- **Robustness**: Any new AI integration must account for error handling and fallbacks.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Diagram Engine**: Mermaid.js
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **AI Integration**: Groq API via Axios
- **Icons**: Lucide React
- **Interactions**: React Zoom Pan Pinch

## 📄 License & Copyright

Copyright (c) 2026 **Oussama Taghlaoui**. All rights reserved.
Portfolio: [https://oussama.taghlaoui.com/](https://oussama.taghlaoui.com/)

This project is licensed under the [MIT License](LICENSE).
