# 🌊 React Mermaid AI

React Mermaid AI is a premium, AI-powered visual diagramming mini-SaaS. Built for software architects, developers, and product managers, it allows you to instantly generate, edit, and export high-definition Mermaid.js diagrams (Flowcharts, Sequence Diagrams, Gantt charts, etc.) using natural language prompts.

Powered by React, Vite, and the blazing-fast Groq API (`llama-3.3-70b-versatile`), this tool features a self-healing syntax correction loop to ensure your AI-generated diagrams are always 100% syntactically valid.

## ✨ Features

- **🧠 AI Generation**: Describe your system architecture or flow, and let AI build the diagram.
- **🛠️ Self-Healing Code**: Automatic syntax error detection and AI-driven correction loop.
- **💻 Pro Editor**: Integrated Monaco Editor with real-time rendering and syntax highlighting.
- **🎨 Premium UI/UX**: Glassmorphism design, dark/light modes with rich gradients and modern aesthetics.
- **📸 Ultra-HD Export**: Export your diagrams in crisp, high-resolution SVG, PNG, JPG, or WEBP (5x scale rendering).
- **🕹️ Interactive Canvas**: Zoom, pan, and explore large diagrams effortlessly.

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/react-mermaid-ai.git
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

This project is licensed under the MIT License.
