'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HalideTopoHero: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 30;
      const y = (window.innerHeight / 2 - e.pageY) / 30;

      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 15;
        const moveX = x * (index + 1) * 0.2;
        const moveY = y * (index + 1) * 0.2;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    // Entrance animation
    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
    }, 300);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Inline styles for grain + 3D canvas */}
      <style>{`
        .halide-grain {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.08;
        }
        .halide-viewport {
          perspective: 2000px;
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1;
        }
        .halide-canvas-3d {
          position: relative;
          width: 700px;
          height: 440px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .halide-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(76, 227, 188, 0.08);
          border-radius: 16px;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }
        .halide-layer-1 {
          background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.2) brightness(0.4);
        }
        .halide-layer-2 {
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.1) brightness(0.6);
          opacity: 0.5;
          mix-blend-mode: screen;
        }
        .halide-layer-3 {
          background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.3) brightness(0.7);
          opacity: 0.35;
          mix-blend-mode: overlay;
        }
        .halide-contours {
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0, transparent 40px,
            rgba(76, 227, 188, 0.04) 41px,
            transparent 42px
          );
          transform: translateZ(120px);
          pointer-events: none;
          border-radius: 16px;
        }
        .halide-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #4CE3BC, transparent);
          animation: halide-flow 2s infinite ease-in-out;
          z-index: 30;
        }
        @keyframes halide-flow {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      {/* SVG Filter for Grain */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="halide-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div className="halide-grain" style={{ filter: 'url(#halide-grain)' }} />

      {/* 3D Parallax Canvas */}
      <div className="halide-viewport">
        <div className="halide-canvas-3d" ref={canvasRef}>
          <div className="halide-layer halide-layer-1" ref={(el) => { if (el) layersRef.current[0] = el; }} />
          <div className="halide-layer halide-layer-2" ref={(el) => { if (el) layersRef.current[1] = el; }} />
          <div className="halide-layer halide-layer-3" ref={(el) => { if (el) layersRef.current[2] = el; }} />
          <div className="halide-contours" />
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center pointer-events-none px-6 max-w-5xl mx-auto" style={{ mixBlendMode: 'difference' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4CE3BC]/20 bg-[#4CE3BC]/5 text-[10px] font-bold text-[#4CE3BC] mb-8 tracking-[0.2em] uppercase pointer-events-auto"
          style={{ mixBlendMode: 'normal' }}
        >
          <Sparkles size={10} /> The Creator Operating System
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] mb-8 text-white"
        >
          Own your system.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4CE3BC] to-[#25AAE1]">
            Scale your brand.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 font-medium leading-relaxed"
          style={{ mixBlendMode: 'normal' }}
        >
          A high-performance infrastructure designed for the modern creator business.
          Automate deal workflows, track real revenue, and centralize operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          style={{ mixBlendMode: 'normal' }}
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-[#4CE3BC] text-black font-bold rounded-xl hover:bg-white transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(76,227,188,0.25)]"
          >
            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#system"
            className="w-full sm:w-auto px-8 py-4 border border-zinc-700 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
          >
            The Platform <ChevronRight size={16} />
          </a>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <div className="halide-scroll-hint" />

      {/* Corner Metadata */}
      <div className="absolute top-24 right-8 z-20 text-right font-mono text-[10px] text-[#4CE3BC]/40 tracking-widest uppercase hidden md:block">
        <div>STATUS: OPERATIONAL</div>
        <div>PROTOCOL: v1.1.0</div>
      </div>
    </section>
  );
};

export default HalideTopoHero;
