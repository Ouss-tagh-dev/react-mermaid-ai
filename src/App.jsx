import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import Editor from '@monaco-editor/react';
import { 
  Code2, 
  LayoutDashboard, 
  Download, 
  Moon, 
  Sun,
  AlertCircle,
  Wand2,
  FileCode2,
  Network,
  ListTree,
  Calendar,
  ZoomIn,
  ZoomOut,
  Maximize,
  Send,
  Loader2
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { generateMermaidCode, fixMermaidCode } from './services/groqService';
import './App.css';

const DEFAULT_DIAGRAM = `%% Welcome to Architect Flow AI!
%% Create stunning diagrams with simple syntax or let AI generate them for you.
graph TD
    %% Node Definitions
    A[New Idea] --> B{Is it feasible?}
    B -- Yes --> C[Development Phase]
    B -- No --> D[Refine Idea]
    C --> E[Testing & Validation]
    E --> F((Production Deployment))
    
    %% Premium Styles
    style A fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff,rx:8,ry:8
    style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff,rx:8,ry:8
    style C fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff,rx:8,ry:8
    style D fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff,rx:8,ry:8
    style E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff,rx:8,ry:8
    style F fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
`;

function App() {
  const [code, setCode] = useState(DEFAULT_DIAGRAM);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true); // Default to Dark mode for Pro look
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    // Initial theme check
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
        primaryBorderColor: '#2563eb',
        lineColor: isDark ? '#94a3b8' : '#475569',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#10b981'
      }
    });
    
    renderDiagram(code);
  }, [isDark]);

  const renderDiagram = useCallback(async (mermaidCode) => {
    if (!mermaidCode.trim()) {
      setSvgContent('');
      setError(null);
      return;
    }

    try {
      const id = 'mermaid-diagram-' + Date.now();
      await mermaid.parse(mermaidCode);
      const { svg } = await mermaid.render(id, mermaidCode);
      setSvgContent(svg);
      setError(null);
    } catch (err) {
      console.error("Mermaid Render Error:", err);
      const message = err.message || err.str || "Mermaid syntax error";
      setError(message);
    }
  }, []);

  // Live preview with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram(code);
    }, 400);
    return () => clearTimeout(timer);
  }, [code, renderDiagram]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      let currentCode = await generateMermaidCode(prompt);
      
      // Auto-correction loop (max 3 retries)
      let retries = 3;
      while (retries > 0) {
        try {
          // Attempt to parse the code. If it throws, it means there's a syntax error.
          await mermaid.parse(currentCode);
          break; // Syntax is correct, exit loop
        } catch (parseError) {
          const errorMsg = parseError.message || parseError.str || "Mermaid syntax error";
          console.warn(`Syntax error detected. Retries left: ${retries}. Message:`, errorMsg);
          
          if (retries === 1) {
            throw new Error("Unable to generate a valid diagram after multiple attempts.");
          }
          
          currentCode = await fixMermaidCode(currentCode, errorMsg);
          retries--;
        }
      }

      setCode(currentCode);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Error during AI generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadUrl = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAs = (format) => {
    if (!svgContent || !previewRef.current) return;
    
    if (format === 'svg') {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      downloadUrl(url, 'diagram.svg');
      return;
    }

    const svgElement = previewRef.current.querySelector('svg');
    if (!svgElement) return;

    // Retrieve SVG dimensions
    const svgWidth = svgElement.viewBox?.baseVal?.width || svgElement.getBoundingClientRect().width || 800;
    const svgHeight = svgElement.viewBox?.baseVal?.height || svgElement.getBoundingClientRect().height || 600;
    
    // Clone and force dimensions for raster rendering
    const clonedSvg = svgElement.cloneNode(true);
    clonedSvg.setAttribute('width', svgWidth);
    clonedSvg.setAttribute('height', svgHeight);
    
    // Ensure XML namespace is present; otherwise, the image won't load in canvas
    if (!clonedSvg.getAttribute('xmlns')) {
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const scale = 5; // Ultra high-definition export (5x resolution)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configure image smoothing for maximum sharpness
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const img = new Image();
    
    img.onload = () => {
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
      
      // Reapply smoothing after canvas resize (required by some browsers)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Add background for JPEG
      if (format === 'jpeg' || format === 'jpg') {
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const imgUrl = canvas.toDataURL(mimeType, 1.0); // Highest quality 1.0
      downloadUrl(imgUrl, `diagram-hd.${format}`);
    };

    img.onerror = (e) => {
      console.error("SVG conversion error:", e);
      alert("Failed to convert the diagram. Please try SVG export.");
    };
    
    // Use base64 for better cross-browser reliability
    const base64Data = btoa(unescape(encodeURIComponent(svgData)));
    img.src = 'data:image/svg+xml;base64,' + base64Data;
  };

  const loadExample = (type) => {
    let example = '';
    switch(type) {
      case 'sequence':
        example = `sequenceDiagram
    autonumber
    actor Client as Web Client
    participant API as API Gateway
    participant Auth as Auth Service
    participant DB as Database

    Client->>API: Login Request (Credentials)
    activate API
    API->>Auth: Validate Credentials
    activate Auth
    Auth->>DB: Fetch User Hash
    activate DB
    DB-->>Auth: Return Hash
    deactivate DB
    Auth-->>API: Authentication Success
    deactivate Auth
    API-->>Client: Return JWT Token
    deactivate API`;
        break;
      case 'mindmap':
        example = `mindmap
  root((SaaS<br/>Architecture))
    Frontend Tier
      React.js
      Tailwind CSS
      Vite Bundler
    Backend Tier
      Node.js & Express
      GraphQL API
      Redis Cache
    Infrastructure
      AWS EC2
      Docker Containers
      PostgreSQL`;
        break;
      case 'class':
        example = `classDiagram
    class User {
        +String id
        +String email
        +String role
        +authenticate() boolean
        +updateProfile() void
    }
    class Subscription {
        +String planId
        +Date activeUntil
        +renew() void
        +cancel() void
    }
    class Organization {
        +String orgName
        +List~User~ members
        +addMember(User u)
    }
    
    Organization "1" *-- "many" User : Contains
    User "1" -- "1" Subscription : Has`;
        break;
      case 'gantt':
        example = `gantt
    title SaaS Platform Launch Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Planning
    Requirements Gathering  :done,    des1, 2026-05-01, 2026-05-05
    UI/UX Wireframing       :active,  des2, 2026-05-06, 3d
    Client Approval         :         des3, after des2, 2d
    section Phase 2: Development
    Frontend Implementation :         dev1, 2026-05-12, 5d
    Backend API & DB        :         dev2, 2026-05-12, 7d
    Security Auditing       :         dev3, after dev2, 3d`;
        break;
      default:
        example = DEFAULT_DIAGRAM;
    }
    setCode(example);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title-group">
          <div className="logo-container">
            <Wand2 size={24} color="#ffffff" />
          </div>
          <div className="header-text">
            <h1 className="main-title">React Mermaid AI</h1>
            <span className="sub-title">Advanced Visual Diagramming</span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="templates-group">
            <button className="secondary-button" onClick={() => loadExample('default')}>
              <Network size={16} /> Flowchart
            </button>
            <button className="secondary-button" onClick={() => loadExample('sequence')}>
              <FileCode2 size={16} /> Sequence
            </button>
            <button className="secondary-button" onClick={() => loadExample('mindmap')}>
              <ListTree size={16} /> Mindmap
            </button>
            <button className="secondary-button" onClick={() => loadExample('class')}>
              <Code2 size={16} /> Class Diagram
            </button>
            <button className="secondary-button" onClick={() => loadExample('gantt')}>
              <Calendar size={16} /> Gantt
            </button>
          </div>
          
          <div className="divider"></div>

          <button className="icon-button" onClick={() => setIsDark(!isDark)} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="button-group">
            <div className="button-group-label">
              <Download size={16} /> Export HD
            </div>
            <button className="group-btn" onClick={() => exportAs('svg')} disabled={!!error || !svgContent}>SVG</button>
            <button className="group-btn" onClick={() => exportAs('png')} disabled={!!error || !svgContent}>PNG</button>
            <button className="group-btn" onClick={() => exportAs('jpeg')} disabled={!!error || !svgContent}>JPG</button>
            <button className="group-btn" onClick={() => exportAs('webp')} disabled={!!error || !svgContent}>WEBP</button>
          </div>
        </div>
      </header>

      <div className="ai-prompt-bar">
        <Wand2 size={24} className="ai-icon" />
        <textarea 
          placeholder="Describe the architecture, flow, or system you want to generate using AI... (Press Enter to generate, Shift+Enter for new line)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          disabled={isGenerating}
          rows={2}
        />
        <button 
          className="primary-button ai-button" 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>

      <main className="main-content">
        <section className="editor-pane">
          <div className="pane-header">
            <div className="pane-title">
              <Code2 size={18} />
              <span>Source Code</span>
            </div>
            <div className="badge">Mermaid.js</div>
          </div>
          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              theme={isDark ? 'vs-dark' : 'light'}
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Inter', monospace",
                wordWrap: "on",
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 20 },
                renderLineHighlight: "all"
              }}
            />
          </div>
        </section>

        <section className="preview-pane">
          <div className="pane-header">
            <div className="pane-title">
              <LayoutDashboard size={18} />
              <span>Visual Render</span>
            </div>
            <div className="pane-title-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {error ? (
                <div className="status-badge error">Error</div>
              ) : (
                <div className="status-badge success">Live</div>
              )}
            </div>
          </div>
          <div className="preview-content">
            {error ? (
              <div className="error-container animate-fade-in">
                <AlertCircle className="error-icon" />
                <h3>Syntax Error</h3>
                <div className="error-message">{error}</div>
              </div>
            ) : (
              <TransformWrapper
                initialScale={1}
                minScale={0.1}
                maxScale={10}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div className="zoom-controls">
                      <button onClick={() => zoomIn()} title="Zoom In"><ZoomIn size={16} /></button>
                      <button onClick={() => zoomOut()} title="Zoom Out"><ZoomOut size={16} /></button>
                      <button onClick={() => resetTransform()} title="Reset View"><Maximize size={16} /></button>
                    </div>
                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div 
                        className="mermaid-diagram animate-fade-in"
                        ref={previewRef}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                      />
                    </TransformComponent>
                  </div>
                )}
              </TransformWrapper>
            )}
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>
          © 2026 Oussama Taghlaoui. All rights reserved. 
          <a href="https://oussama.taghlaoui.com/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>|</span>
          <a href="https://github.com/Ouss-tagh-dev/react-mermaid-ai" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
