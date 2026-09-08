<div align="center">
  <img src="./public/CardCraft.png" width="240" alt="CardCraft Logo" />
  <h1>CardCraft: Readme Badge Engine</h1>
  <p><b>A next-generation, zero-dependency SVG card generator for your GitHub profile and repositories.</b></p>
  
  <a href="https://github.com/yourusername/readme-card-generator">Explore the docs »</a>
  <br/>
  <br/>
  <a href="https://github.com/yourusername/readme-card-generator">View Demo</a>
  ·
  <a href="https://github.com/yourusername/readme-card-generator/issues">Report Bug</a>
  ·
  <a href="https://github.com/yourusername/readme-card-generator/issues">Request Feature</a>
  <br/>
  <br/>
  
  <img src="https://img.shields.io/badge/REACT-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/VITE-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TAILWIND-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SVG_NATIVE-ENGINE-FFB13B?style=for-the-badge&logo=svg&logoColor=white" alt="SVG" />

  <br/>
  <br/>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

<br/>

## 🌟 Overview

**CardCraft** is a highly interactive, beautifully designed React application that allows developers to instantly synthesize stunning SVG project cards for their GitHub `README.md` files.

Tired of using static, boring shields and badges? CardCraft lets you upload custom backgrounds, apply advanced image filters (like vignettes, saturation, and contrast), and output an optimized SVG file that flawlessly bypasses GitHub's strict image proxy limits.

## ✨ Features & Capabilities

- ⚡ **Realtime SVG Synthesizer:** Watch your SVG build instantly on a custom interactive canvas.
- 📐 **Fully Responsive Canvas:** Unlike standard image generators, CardCraft uses a mathematical `ResizeObserver` engine. You can drag the corner of your card to stretch and reshape its aspect ratio dynamically!
- 🖱️ **Interactive Image Panning:** Drag directly on the card to pan your background image perfectly into place, complete with mathematical bounding clamp locks to prevent blank edges.
- 🎬 **Animated GIF Support:** Upload `.gif` files, and the engine bypasses canvas compression to natively embed the raw animation directly into your generated SVG card.
- 🎨 **Smart Theming:** Choose from built-in themes like Dark, Light, Dracula, Monokai, or fully Transparent.
- 📸 **Advanced Image Processing:** Apply advanced CSS-like SVG filters directly in the browser (Brightness, Contrast, Saturation, Hue, Sharpness, Vignette).
- 🗜️ **Auto-Compression Engine:** Heavy backgrounds are automatically downscaled. This outputs a lightweight SVG (usually under 100KB) that guarantees GitHub will render it immediately.
- 👁️ **Workspace Environments:** Toggle between pure black and studio grey (`#2d2d30`) background testing environments to ensure your card pops on any GitHub theme.



## 📁 Project Structure

```text
readme-card-generator/
├── public/                 # Static assets
│   └── CardCraft.png       # Application logo
├── src/
│   ├── components/
│   │   ├── CardPreview.jsx # The core SVG rendering and layout engine
│   │   └── ControlPanel.jsx# Side panel for all configurations and sliders
│   ├── App.jsx             # Main application layout, state, and panning logic
│   ├── index.css           # Global styles and Tailwind imports
│   └── main.jsx            # React mounting point
├── tailwind.config.js      # Custom design system and color tokens
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 💻 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (fully customized color token system)
- **Engine:** Raw SVG XML generation & Canvas API

## 🚀 Installation

CardCraft is built for speed and simplicity. To run the studio locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/readme-card-generator.git
   cd readme-card-generator
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Ignite the engine:**
   ```bash
   npm run dev
   ```

## 🛠️ Usage

Once the app is running on `http://localhost:5173`:
1. Use the **Control Panel** on the left to configure your repository name, description, and primary coding language.
2. Under **Image Adjustments**, upload any background image (even GIFs!).
3. Drag the image inside the card to pan it, or drag the bottom right corner of the card to resize its aspect ratio.
4. Tweak the filters to ensure your text pops (the **Text Backdrop** overlay handles readability on bright images!).
5. Click **Download SVG**.
6. Place the SVG into your repository and link it in your README using:
   ```html
   <a href="https://github.com/yourusername/your-repo">
     <img src="./assets/your-card.svg" width="49%" />
   </a>
   ```

---
<div align="center">
  <i>Built with absolute precision and aesthetics.</i>
</div>
