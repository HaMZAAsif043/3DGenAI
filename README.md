# 3DGenAI

An AI-powered 3D model management platform with real-time AR preview, built with **Next.js**, **Three.js**, and **TypeScript**. Supports GLB/USDZ format conversion, AR-ready model downloads, and per-account model storage.

## ✨ Features

- **GLB → USDZ Conversion** — Convert 3D models to Apple AR-compatible USDZ format directly in the browser
- **AR Model Preview** — View and interact with models in Augmented Reality on supported iOS devices
- **USDZ Download** — One-click download of AR-ready `.usdz` files for real-world deployment
- **Per-Account Model Storage** — Each user account has isolated model storage with persistent access
- **3D Viewport** — Interactive Three.js viewer with orbit controls, lighting, and real-time rendering
- **Next.js App Router** — Built on the modern Next.js 14 App Router architecture

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| 3D Rendering | Three.js |
| AR Format | USDZ (Apple AR Quick Look) |
| 3D Format | GLB / GLTF |
| Auth & Storage | Per-account model isolation |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/HaMZAAsif043/3DGenAI.git
cd 3DGenAI

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
3DGenAI/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
│   ├── viewer/           # Three.js 3D viewer
│   └── converter/        # GLB ↔ USDZ conversion logic
├── lib/                  # Utilities and helpers
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 📱 AR Workflow

1. Upload or generate a 3D model (GLB format)
2. Platform converts it to USDZ automatically
3. Download the `.usdz` file
4. Open on iOS — AR Quick Look launches instantly

## 🔮 Roadmap

- [ ] AI-based 3D model generation from text prompts
- [ ] Android AR support (via WebXR / glTF)
- [ ] Cloud storage integration
- [ ] Model sharing and collaboration

---

Built with ❤️ at [BlenSpark](https://blenspark.com)
