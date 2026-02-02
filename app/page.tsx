'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  Globe,
  ShieldCheck,
  Zap,
  ChevronRight,
  Boxes
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white overflow-hidden text-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-20">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 my-10 lg:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Next-Gen 3D Engine v2.0</span>
              </div> */}

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 text-zinc-950">
                SCULPTING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-500">3D REALITY</span> <br />
                INSTANTLY.
              </h1>

              <p className="text-lg text-zinc-500 max-w-xl leading-relaxed mb-12 font-medium">
                The leading AI-Native 3D generation platform for professional workflows.
                Transform single images or multi-view perspectives into
                production-ready vertex data for AR, Gaming, and Web.
              </p>

              <div className="flex flex-wrap gap-6">
                <Link
                  href="/dashboard/upload"
                  className="group relative px-10 py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-accent transition-all duration-500 overflow-hidden shadow-xl shadow-accent/10"
                >
                  <span className="relative z-10">Start Generating</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>

                <Link
                  href="/#showcase"
                  className="px-10 py-5 bg-white border border-zinc-200 text-zinc-900 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all text-center"
                >
                  View Showcase
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-8 border-t border-zinc-100 pt-10">
                <div>
                  <p className="text-3xl font-black text-zinc-900">45s</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Typical Speed</p>
                </div>
                <div className="w-px h-10 bg-zinc-100" />
                <div>
                  <p className="text-3xl font-black text-zinc-900">High</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Vertex Fidelity</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-accent/5 rounded-full blur-[100px] animate-pulse" />
                {/* Visual Asset Container */}
                <div className="relative z-10 w-full h-full bg-white rounded-[4rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-50 to-transparent" />
                  <img
                    src="/jacket.png"
                    alt="Gen3DAI Model Showcase"
                    className="w-full h-full object-contain p-20 transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-10 left-10 p-6 bg-white/80 backdrop-blur-md border border-zinc-100 rounded-3xl shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Processing Topology...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 bg-zinc-50/50 relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Cpu className="w-8 h-8" />}
              title="Neural Mesh Engine"
              description="Proprietary AI architecture translates 2D pixels into high-fidelity vertex topology with intelligent surface smoothing."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Multi-Angle Fusion"
              description="Ingest multiple camera perspectives to reconstruct complete, occlusion-free models ready for production environments."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Global AR Sharing"
              description="Seamless export to GLB and USDZ with instantaneous QR deployment. Materialize assets into life-size AR in seconds."
            />
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-40 relative bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900">
              BUILT FOR PROFESSIONAL <br /> PERFORMANCE.
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
              From individual creators to global enterprises.
              Gen3DAI scales to meet rigorous production demands with
              guaranteed reliability and speed.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 pt-10">
              <div className="p-10 bg-white border border-zinc-100 rounded-[3rem] text-left hover:border-accent/20 hover:shadow-2xl hover:shadow-zinc-100 transition-all group">
                <ShieldCheck className="w-12 h-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tight">Secure Infrastructure</h4>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">End-to-end proprietary encryption for sensitive prototype data. Your intellectual property remains protected.</p>
                <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
                  Review Protocols <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="p-10 bg-white border border-zinc-100 rounded-[3rem] text-left hover:border-accent/20 hover:shadow-2xl hover:shadow-zinc-100 transition-all group">
                <Boxes className="w-12 h-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tight">Batch Pipelines</h4>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">Process entire product catalogs with our high-throughput batch API. Integrated metadata tagging for asset management.</p>
                <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
                  API Guide <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 bg-zinc-50/30 border-t border-zinc-100">
        <div className="max-w-[1000px] mx-auto px-4">
          <h3 className="text-4xl font-black tracking-tight text-zinc-900 mb-20 text-center uppercase tracking-widest">Technical Specs</h3>
          <div className="space-y-6">
            <AccordionItem
              question="Supported Export Formats"
              answer="We natively support GLB (Web/Android), USDZ (iOS/AR Quick Look), and OBJ/MTL archives for traditional 3D software suites."
            />
            <AccordionItem
              question="Multi-View Image Requirements"
              answer="For optimal results, we recommend high-contrast images from front, back, side, and top angles. Uniform lighting yields the highest texture fidelity."
            />
            <AccordionItem
              question="Typical Processing Times"
              answer="Standard generations take approximately 45-60 seconds. High-poly enterprise assets may take up to 3 minutes for full optimization."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-12 rounded-[3.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500"
    >
      <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mb-10 text-accent">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-zinc-950 tracking-tight mb-4 uppercase">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm font-medium">{description}</p>
    </motion.div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="p-10 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-zinc-200 transition-all group">
      <div className="flex justify-between items-center cursor-pointer">
        <h4 className="text-lg font-black text-zinc-950 uppercase tracking-tight">{question}</h4>
        <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
          <Zap className="w-4 h-4" />
        </div>
      </div>
      <p className="text-zinc-500 mt-6 text-sm font-medium leading-relaxed max-w-2xl">{answer}</p>
    </div>
  );
}
