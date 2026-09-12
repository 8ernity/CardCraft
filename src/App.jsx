import React, { useState, useRef, useEffect } from 'react';
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
    imgOverlay: 0,
    imgScale: 100,
    imgOffsetX: 0,
    imgOffsetY: 0,
    textWrapWidth: 100,
    textShadow: 50,
    icon: 'deployed_code'
  });

  const [previewZoom, setPreviewZoom] = useState(1);
  const [isGreyBg, setIsGreyBg] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 800, height: 400 });
  const [toast, setToast] = useState({ show: false, text: '' });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialOffsetX: 0, initialOffsetY: 0 });
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const el = entry.target;
        // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" errors in React
        window.requestAnimationFrame(() => {
          setCardSize(prev => {
            if (prev.width !== el.clientWidth || prev.height !== el.clientHeight) {
              return { width: el.clientWidth, height: el.clientHeight };
            }
            return prev;
          });
        });
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

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
    const htmlSnippet = `<a href="https://github.com/${config.repoName}">\n  <img src="./[PATH_TO_SVG]/${filename}" width="49%" />\n</a>`;
    navigator.clipboard.writeText(htmlSnippet);
    showToast('HTML code copied to clipboard!');
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
        <div className="h-16 w-full px-container-padding flex items-center justify-between">
          <div className="flex items-center gap-gutter">
            <div className="flex items-center gap-base">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/CardCraft.png" alt="CardCraft Logo" className="w-full h-full object-cover" />
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

      <main 
        className="w-full pt-16 bg-background h-screen overflow-hidden"
        onMouseMove={(e) => {
          if (isPanning && config.imageSrc) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            const deltaXPercent = (dx * 200) / (cardSize.width * previewZoom);
            const deltaYPercent = (dy * 200) / (cardSize.height * previewZoom);
            
            const scale = config.imgScale / 100;
            const maxOffset = 50 * Math.abs(scale - 1);
            
            setConfig(prev => ({
              ...prev,
              imgOffsetX: Math.max(-maxOffset, Math.min(maxOffset, dragStart.initialOffsetX + deltaXPercent)),
              imgOffsetY: Math.max(-maxOffset, Math.min(maxOffset, dragStart.initialOffsetY + deltaYPercent))
            }));
          }
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
      >
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
            <section className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-300 ${isGreyBg ? 'bg-[#2d2d30]' : 'bg-black'}`}>
              <div className="h-14 px-container-padding flex items-center justify-between bg-surface/60 backdrop-blur-md z-20">
                <div className="flex items-center gap-gutter">
                  <div className="flex items-center gap-base">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Canvas Live Render</span>
                  </div>
                  <span className="text-outline-variant font-label-sm text-label-sm">|</span>
                  <div className="flex items-center gap-base">
                    <span className="material-symbols-outlined text-[16px] text-primary">aspect_ratio</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Export Size • {cardSize.width} × {cardSize.height} px</span>
                  </div>
                </div>
                <div className="flex items-center gap-base">
                  {(cardSize.width !== 800 || cardSize.height !== 400) && (
                    <button 
                      onClick={() => setCardSize({ width: 800, height: 400 })}
                      className="flex items-center gap-1 px-base py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all text-label-sm font-label-sm"
                    >
                      <span className="material-symbols-outlined text-[14px]">restore</span>
                      <span>Reset Size</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setIsGreyBg(!isGreyBg)}
                    className="flex items-center gap-base px-base py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all text-label-sm font-label-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">contrast</span>
                    <span className="hidden sm:inline">Workspace Bg</span>
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
                <>
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px', opacity: isGreyBg ? 0.4 : 1 }}></div>
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1.5px, transparent 0)', backgroundSize: '16px 16px', maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`, WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`, opacity: isGreyBg ? 0.4 : 1 }}></div>
                </>
                
                <div 
                  ref={wrapperRef}
                  className={`transition-transform duration-200 ease-out origin-center shadow-2xl relative z-10 group ${config.imageSrc ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''}`} 
                  style={{ 
                    transform: `scale(${previewZoom})`,
                    resize: 'both',
                    overflow: 'hidden',
                    width: cardSize.width,
                    height: cardSize.height,
                    minWidth: 200,
                    minHeight: 100,
                    maxWidth: 1600,
                    maxHeight: 1600
                  }}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const isResizeHandle = (e.clientX > rect.right - 20) && (e.clientY > rect.bottom - 20);
                    if (config.imageSrc && !isResizeHandle) {
                      e.preventDefault();
                      setIsPanning(true);
                      setDragStart({ x: e.clientX, y: e.clientY, initialOffsetX: config.imgOffsetX, initialOffsetY: config.imgOffsetY });
                    }
                  }}
                >
                  <CardPreview config={config} svgRef={svgRef} width={cardSize.width} height={cardSize.height} />
                  <div className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 backdrop-blur rounded-tl-lg pointer-events-none flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-[14px] text-on-primary">drag_indicator</span>
                  </div>
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
