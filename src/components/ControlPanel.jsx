import React, { useState } from 'react';

const ControlPanel = ({ config, setConfig, palettes, onDownload, onCopy, toast }) => {
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'imgScale') {
      const scale = value / 100;
      const maxOffset = 50 * Math.abs(scale - 1);
      setConfig(prev => ({ 
        ...prev, 
        imgScale: value,
        imgOffsetX: Math.max(-maxOffset, Math.min(maxOffset, prev.imgOffsetX)),
        imgOffsetY: Math.max(-maxOffset, Math.min(maxOffset, prev.imgOffsetY))
      }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaletteSelect = (palette) => {
    setConfig(prev => ({
      ...prev,
      bgColor: palette.bg,
      logoColor: palette.logo,
      titleColor: palette.title,
      descColor: palette.desc,
      starColor: palette.footer,
      languageColor: palette.lang
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/gif') {
        // Bypass canvas processing for GIFs to preserve animation
        const reader = new FileReader();
        reader.onload = (event) => {
          setConfig(prev => ({ ...prev, imageSrc: event.target.result }));
        };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to WebP or JPEG with quality 0.6 to keep it very small
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setConfig(prev => ({ ...prev, imageSrc: compressedDataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full xl:w-[480px] bg-surface-container-lowest flex flex-col shadow-2xl z-30 border-r border-surface-container-highest">
      <div className="p-base bg-surface-container-low flex items-center gap-base">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2.5 px-base rounded-lg flex items-center justify-center gap-base font-label-sm text-label-sm font-semibold transition-all ${activeTab === 'general' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>General</span>
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-2.5 px-base rounded-lg flex items-center justify-center gap-base font-label-sm text-label-sm font-semibold transition-all ${activeTab === 'image' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_filter</span>
          <span>Image Adjustments</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-gutter space-y-section-margin">
        {activeTab === 'general' ? (
          <div className="space-y-gutter flex flex-col">
            <div className="flex flex-col gap-base">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface flex items-center justify-between">
                <span>Style Presets</span>
              </label>
              <div className="relative">
                <select
                  onChange={(e) => {
                    const selected = palettes.find(p => p.key === e.target.value);
                    if (selected) handlePaletteSelect(selected);
                  }}
                  className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Select a preset...</option>
                  {palettes.map((p) => (
                    <option key={p.key} value={p.key}>{p.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="flex flex-col gap-base">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface flex items-center justify-between">
                  <span>Repository Name</span>
                </label>
                <input name="repoName" value={config.repoName} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all" type="text" />
              </div>
              <div className="flex flex-col gap-base">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface flex items-center justify-between">
                  <span>Primary Language</span>
                </label>
                <input name="language" value={config.language} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-base">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface">Description Snippet</label>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{config.description.length} chars</span>
              </div>
              <textarea name="description" value={config.description} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none" rows="3"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="flex flex-col gap-base">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface">Star Count</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-primary text-[18px]">star</span>
                  <input name="stars" value={config.stars} onChange={handleChange} className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all" type="number" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-base pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Color Tokens</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-base">
                {[
                  { label: 'Language', name: 'languageColor' },
                  { label: 'Logo Icon', name: 'logoColor' },
                  { label: 'Title Repo', name: 'titleColor' },
                  { label: 'Description', name: 'descColor' },
                  { label: 'Footer Info', name: 'starColor' },
                  { label: 'Background', name: 'bgColor' }
                ].map(item => (
                  <div key={item.name} className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{item.label}</span>
                    <div className="flex items-center gap-base">
                      <input name={item.name} value={config[item.name] === 'transparent' ? '#ffffff' : config[item.name]} onChange={handleChange} className="w-7 h-7 rounded bg-transparent cursor-pointer" type="color" />
                      <span className="font-label-sm text-label-sm font-mono text-on-surface">{config[item.name]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-gutter flex flex-col">
            <div className="flex flex-col gap-base">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface">Background Image URL</label>
              <input name="imageSrc" value={config.imageSrc} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-highest focus:outline-none focus:ring-1 focus:ring-primary transition-all" placeholder="https://..." type="text" />
            </div>

            <label className="p-6 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col items-center justify-center gap-base text-center cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-medium text-on-surface">Upload custom image</span>
              </div>
              <input accept="image/*" className="hidden" type="file" onChange={handleImageUpload} />
            </label>

            <div className="flex flex-col gap-base pt-2">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Raster Filter Stack</span>
              
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">Image Scale</span>
                  <div className="flex items-center gap-base">
                    <span className="font-label-sm text-label-sm text-primary font-mono font-bold">{config.imgScale}%</span>
                    <button onClick={() => setConfig(p => ({...p, imgScale: 100}))} className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all">
                      <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                    </button>
                  </div>
                </div>
                <input name="imgScale" min="50" max="300" value={config.imgScale} onChange={handleChange} className="w-full accent-primary bg-surface-container cursor-pointer" type="range" />
              </div>

              {[
                { label: 'Opacity', name: 'imgOpacity', min: 0, max: 100 },
                { label: 'Brightness', name: 'imgBrightness', min: 0, max: 200 },
                { label: 'Contrast', name: 'imgContrast', min: 0, max: 200 },
                { label: 'Saturation', name: 'imgSaturation', min: 0, max: 200 },
                { label: 'Hue Shift', name: 'imgHue', min: 0, max: 360, unit: '°' },
                { label: 'Sharpness', name: 'imgSharpness', min: 0, max: 100 }
              ].map(item => (
                <div key={item.name} className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">{item.label}</span>
                    <span className="font-label-sm text-label-sm text-primary font-mono font-bold">{config[item.name]}{item.unit || '%'}</span>
                  </div>
                  <input name={item.name} min={item.min} max={item.max} value={config[item.name]} onChange={handleChange} className="w-full accent-primary bg-surface-container cursor-pointer" type="range" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-base pt-2">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Vignette & Focus Mask</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-base">
                {[
                  { label: 'Vignette Opacity', name: 'imgVignette', min: 0, max: 100 },
                  { label: 'Text Backdrop', name: 'imgOverlay', min: 0, max: 100 },
                  { label: 'Focus Area', name: 'imgVignetteFocus', min: 0, max: 100 },
                  { label: 'Center X', name: 'imgVignetteX', min: 0, max: 100 },
                  { label: 'Center Y', name: 'imgVignetteY', min: 0, max: 100 }
                ].map(item => (
                  <div key={item.name} className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">{item.label}</span>
                      <span className="font-label-sm text-label-sm text-primary font-mono font-bold">{config[item.name]}%</span>
                    </div>
                    <input name={item.name} min={item.min} max={item.max} value={config[item.name]} onChange={handleChange} className="w-full accent-primary bg-surface-container cursor-pointer" type="range" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-gutter bg-surface-container-low flex flex-col gap-base shadow-2xl">
        {toast.show && (
          <div className="px-3 py-2 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center justify-between transition-all">
            <div className="flex items-center gap-base">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{toast.text}</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-base">
          <button onClick={onDownload} className="flex-1 py-3 px-gutter rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-headline-md text-headline-md-mobile font-bold flex items-center justify-center gap-base transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>download</span>
            <span>Download SVG</span>
          </button>
          <button onClick={onCopy} className="py-3 px-gutter rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-md text-body-md font-semibold flex items-center justify-center gap-base transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span className="hidden sm:inline">Copy Markdown</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ControlPanel;
