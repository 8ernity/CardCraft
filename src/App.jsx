import React, { useState, useRef } from 'react';
import CardPreview from './components/CardPreview';
import ControlPanel from './components/ControlPanel';

const PALETTES = [
  { name: 'Dark', key: 'dark', bg: '#0d1117', logo: '#58a6ff', title: '#58a6ff', desc: '#8b949e', footer: '#8b949e', lang: '#f1e05a' },
  { name: 'Light', key: 'light', bg: '#ffffff', logo: '#0969da', title: '#0969da', desc: '#57606a', footer: '#57606a', lang: '#f1e05a' },
  { name: 'Dracula', key: 'dracula', bg: '#282a36', logo: '#ff79c6', title: '#ff79c6', desc: '#6272a4', footer: '#6272a4', lang: '#f1fa8c' },
  { name: 'Monokai', key: 'monokai', bg: '#272822', logo: '#f92672', title: '#f92672', desc: '#75715e', footer: '#75715e', lang: '#e6db74' },
  { name: 'Transparent', key: 'transparent', bg: 'transparent', logo: '#0969da', title: '#0969da', desc: '#57606a', footer: '#57606a', lang: '#0969da' }
];

function App() {
  const [config, setConfig] = useState({
    repoName: 'username/repository',
    description: 'A brief description of your repository. This is a placeholder to show how it looks when rendered.',
    language: 'JavaScript',
    languageColor: PALETTES[0].lang,
    stars: 1234,
    bgColor: PALETTES[0].bg,
    logoColor: PALETTES[0].logo,
    titleColor: PALETTES[0].title,
    descColor: PALETTES[0].desc,
    starColor: PALETTES[0].footer,
    imageSrc: '',
    imgOpacity: 100,
    imgBrightness: 100,
    imgContrast: 100,
    imgSaturation: 100,
    imgHue: 0,
    imgSharpness: 0,
    imgVignette: 0,
    imgVignetteFocus: 50,
    imgVignetteX: 50,
    imgVignetteY: 50,
    imgOverlay: 90,
    imgScale: 100,
    icon: 'deployed_code'
  });

  const [previewZoom, setPreviewZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [toast, setToast] = useState({ show: false, text: '' });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const svgRef = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, text: msg });
    setTimeout(() => setToast({ show: false, text: '' }), 3200);
  };

  const updateZoom = (z) => setPreviewZoom(Math.min(Math.max(z, 0.4), 1.6));

  const handleDownloadSVG = () => {
    showToast('Synthesizing & downloading cardcraft-badge.svg...');
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.repoName.split('/').pop() || 'card'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyMarkdown = () => {
    const filename = `${config.repoName.split('/').pop() || 'card'}.svg`;
    const markdown = `[![Card](./${filename})](https://github.com/${config.repoName})`;
    navigator.clipboard.writeText(markdown);
    showToast('Markdown badge code copied to clipboard!');
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
        <div className="h-16 w-full px-container-padding flex items-center justify-between">
          <div className="flex items-center gap-gutter">
            <div className="flex items-center gap-base">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">badge</span>
              </div>
              <div className="flex items-center gap-base">
                <span className="font-headline-md text-headline-md-mobile text-on-surface font-bold tracking-tight">CardCraft</span>
                <span className="text-outline font-body-md">/</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Readme Generator</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-base px-base py-0.5 rounded-full bg-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Engine v2.4 Ready</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-base">
            <span className="px-base py-1 transition-all bg-surface-container-high text-primary font-medium rounded-lg">Studio</span>
            <span className="px-base py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-body-md text-body-md cursor-pointer">Templates</span>
          </nav>
          <div className="flex items-center gap-gutter">
            <a className="flex items-center gap-base px-base py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface-variant hover:text-on-surface" href="https://github.com" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-[18px]">code</span>
              <span className="hidden lg:inline font-label-sm text-label-sm">GitHub</span>
            </a>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-background h-screen overflow-hidden">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col xl:flex-row w-full h-full">
            
            {/* Left Side: Control Panel */}
            <ControlPanel 
              config={config} 
              setConfig={setConfig} 
              palettes={PALETTES}
              onDownload={handleDownloadSVG}
              onCopy={handleCopyMarkdown}
              toast={toast}
            />

            {/* Right Side: Live Preview Workspace */}
            <section className="flex-1 flex flex-col relative bg-black overflow-hidden">
              <div className="h-14 px-container-padding flex items-center justify-between bg-surface/60 backdrop-blur-md z-20">
                <div className="flex items-center gap-gutter">
                  <div className="flex items-center gap-base">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Canvas Live Render</span>
                  </div>
                  <span className="text-outline-variant font-label-sm text-label-sm">|</span>
                  <div className="flex items-center gap-base">
                    <span className="material-symbols-outlined text-[16px] text-primary">aspect_ratio</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">SVG Vector Standard • 800 × 400 px</span>
                  </div>
                </div>
                <div className="flex items-center gap-base">
                  <button 
                    onClick={() => setGridEnabled(!gridEnabled)}
                    className="flex items-center gap-base px-base py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all text-label-sm font-label-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
                    <span className="hidden sm:inline">Backdrop Grid</span>
                  </button>
                  <div className="px-base py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-base">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>Realtime Engine</span>
                  </div>
                </div>
              </div>

              <div 
                className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-auto"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
              >
                {gridEnabled && (
                  <>
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1.5px, transparent 0)', backgroundSize: '16px 16px', maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`, WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black, transparent)` }}></div>
                  </>
                )}
                
                <div className="transition-transform duration-200 ease-out origin-center shadow-2xl relative z-10" style={{ transform: `scale(${previewZoom})` }}>
                  <CardPreview config={config} svgRef={svgRef} />
                </div>
              </div>

              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1 rounded-xl bg-surface/90 backdrop-blur-xl shadow-2xl">
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high active:scale-95 transition-all" onClick={() => updateZoom(previewZoom - 0.15)}>
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button className="px-3 h-9 rounded-lg flex items-center gap-1 text-on-surface hover:text-primary hover:bg-surface-container-high font-label-sm text-label-sm font-medium transition-all" onClick={() => updateZoom(1.0)}>
                  <span>{Math.round(previewZoom * 100)}%</span>
                </button>
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high active:scale-95 transition-all" onClick={() => updateZoom(previewZoom + 0.15)}>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <span className="w-px h-5 bg-surface-container-highest mx-1"></span>
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" onClick={() => updateZoom(0.85)}>
                  <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                </button>
              </div>

              <div className="h-9 px-container-padding bg-surface-container-lowest flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm select-none border-t border-surface-container-highest">
                <div className="flex items-center gap-gutter">
                  <span>Viewport: <strong className="text-on-surface font-mono">1:1 High-DPI</strong></span>
                  <span className="text-outline-variant">•</span>
                  <span>Color Space: <strong className="text-on-surface">sRGB / P3 Gamut</strong></span>
                </div>
                <div className="flex items-center gap-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-on-surface">Auto-saved to session</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
