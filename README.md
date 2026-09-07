<div align="center">
  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3af/512.gif" width="60" alt="target" />
  <h1>CardCraft: Readme Badge Engine</h1>
  <p><b>A next-generation, zero-dependency SVG card generator for your GitHub profile and repositories.</b></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

<br/>

## 🌟 Overview

**CardCraft** is a highly interactive, beautifully designed React application that allows developers to instantly synthesize stunning SVG project cards for their GitHub `README.md` files.

Tired of using static, boring shields and badges? CardCraft lets you upload custom backgrounds, apply advanced image filters (like vignettes, saturation, and contrast), and output an optimized SVG file that flawlessly bypasses GitHub's strict image proxy limits.

## ✨ Features

- ⚡ **Realtime Live Rendering:** Watch your SVG build instantly on a custom "Stitch-style" interactive grid backdrop.
- 🎨 **Smart Theming:** Choose from built-in themes like Dark, Light, Dracula, Monokai, or fully Transparent.
- 📸 **Advanced Image Processing:** Apply advanced CSS-like SVG filters directly in the browser (Brightness, Contrast, Saturation, Hue, Sharpness, Vignette).
- 🗜️ **Auto-Compression Engine:** Upload massive 4K background images, and CardCraft's internal engine will automatically compress them using a canvas-downscaler. This outputs a lightweight SVG (usually under 100KB) that guarantees GitHub will render it immediately without timeouts.
- 📐 **Markdown Optimized:** Exports cleanly at a native `400x200` resolution, allowing you to seamlessly align multiple cards side-by-side using standard HTML `<img>` tags.

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
2. Under **Image Adjustments**, upload any background image.
3. Tweak the filters to ensure your text pops (the **Text Backdrop** overlay handles readability on bright images!).
4. Click **Download SVG**.
5. Place the SVG into your repository and link it in your README using:
   ```html
   <img src="./assets/your-card.svg" width="49%" />
   ```

## 💻 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (fully customized color token system)
- **Engine:** Raw SVG XML generation & Canvas API

---
<div align="center">
  <i>Built with absolute precision and aesthetics.</i>
</div>
