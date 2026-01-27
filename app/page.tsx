import Link from 'next/link';
import { ArrowRight, Box, Image as ImageIcon, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Box className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold tracking-tight">3DGen AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
              <Link href="/dashboard" className="px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Turn Images into <span className="text-accent underline decoration-4 underline-offset-8">3D Reality</span>
            </h1>
            <p className="text-xl text-zinc-600 mb-10 leading-relaxed">
              Professional-grade 3D model generation from single or multi-view images.
              Powered by Tencent Hunyuan3D for production-ready results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard/upload" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform group">
                Start Generating
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-black border-2 border-zinc-200 rounded-xl font-semibold text-lg hover:border-black transition-colors">
                View Gallery
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                <ImageIcon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-View Support</h3>
              <p className="text-zinc-600">Provide one or many images to capture every detail of your object.</p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Generation</h3>
              <p className="text-zinc-600">Advanced AI processing delivers high-fidelity 3D models in minutes.</p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                <Box className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">AR Ready</h3>
              <p className="text-zinc-600">Export as GLB or USDZ for seamless web and AR integration.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          © 2026 3DGen AI. Built with Tencent Hunyuan3D.
        </div>
      </footer>
    </div>
  );
}
