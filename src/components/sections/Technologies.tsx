import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Tech planet data - shell indices map to planetShells in Atmosphere.tsx
export const techPlanets = [
  { name: "React", color: "#61dafb", size: 28, initialAngle: 0, symbol: "⚛", description: "Component Architecture", shell: 0, glowIntensity: 1.2 },
  { name: "TypeScript", color: "#3178c6", size: 26, initialAngle: 120, symbol: "τ", description: "Type Safety", shell: 0, glowIntensity: 1.0 },
  { name: "Node.js", color: "#68a063", size: 28, initialAngle: 240, symbol: "⬢", description: "Runtime Environment", shell: 0, glowIntensity: 1.1 },
  { name: "Next.js", color: "#ffffff", size: 30, initialAngle: 45, symbol: "▲", description: "Full-Stack Framework", shell: 1, glowIntensity: 1.3 },
  { name: "Python", color: "#ffd43b", size: 32, initialAngle: 165, symbol: "🐍", description: "Data & ML", shell: 1, glowIntensity: 1.2 },
  { name: "PostgreSQL", color: "#336791", size: 26, initialAngle: 285, symbol: "🐘", description: "Relational Data", shell: 1, glowIntensity: 0.9 },
  { name: "Docker", color: "#2496ed", size: 24, initialAngle: 345, symbol: "🐳", description: "Containerization", shell: 1, glowIntensity: 1.0 },
  { name: "AWS", color: "#ff9900", size: 34, initialAngle: 90, symbol: "☁", description: "Cloud Infrastructure", shell: 2, glowIntensity: 1.4 },
  { name: "TensorFlow", color: "#ff6f00", size: 28, initialAngle: 210, symbol: "🔶", description: "Neural Networks", shell: 2, glowIntensity: 1.1 },
  { name: "Git", color: "#f05032", size: 24, initialAngle: 330, symbol: "◉", description: "Version Control", shell: 2, glowIntensity: 0.9 }
];

// Shell metadata for the legend - matches planetShells in Atmosphere.tsx
export const planetShells = [
  { radius: 0.15, speed: 0.6, color: "#60a5fa", label: "Core Stack", neonColor: "#00d4ff" },
  { radius: 0.22, speed: 0.4, color: "#a78bfa", label: "Infrastructure", neonColor: "#ff00ff" },
  { radius: 0.30, speed: 0.25, color: "#fbbf24", label: "Specialized", neonColor: "#ffaa00" }
];

// Global state for planet visibility
let globalPlanetsVisible = false;
const visibilityListeners = new Set<(visible: boolean) => void>();

export const setPlanetsVisibility = (visible: boolean) => {
  globalPlanetsVisible = visible;
  visibilityListeners.forEach(cb => cb(visible));
};

export const subscribeToVisibility = (callback: (visible: boolean) => void) => {
  visibilityListeners.add(callback);
  callback(globalPlanetsVisible);
  return () => visibilityListeners.delete(callback);
};

export const Technologies = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section fade animation
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Control planet visibility based on scroll
  const isInView = useTransform(scrollYProgress, (v) => v > 0.15 && v < 0.85);
  
  useEffect(() => {
    const unsubscribe = isInView.on("change", (visible) => {
      setPlanetsVisibility(visible);
    });
    return () => {
      unsubscribe();
      setPlanetsVisibility(false);
    };
  }, [isInView]);

  return (
    <section 
      ref={sectionRef}
      id="arsenal"
      className="relative min-h-screen py-32 overflow-hidden"
    >
      <motion.div 
        className="max-w-6xl mx-auto px-6 relative z-10 h-[80vh] flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: smoothOpacity, scale: smoothScale }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4 p-4 rounded-full 
              bg-black/40 backdrop-blur-xl border border-white/20
              shadow-[0_0_30px_rgba(100,200,255,0.3)]"
          >
            <span className="text-2xl animate-pulse">⚛</span>
          </motion.div>
          
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">Orbital</span> Technologies
          </h2>
          
          <p className="font-serif italic text-white/70 max-w-2xl mx-auto text-lg">
            "My skills orbit the craft like planets around the sun—each in its destined path."
          </p>
        </div>

        {/* Legend - neon styled */}
        <div className="mt-auto flex flex-wrap justify-center gap-6">
          {planetShells.map((shell, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-default"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: shell.neonColor,
                  boxShadow: `0 0 10px ${shell.neonColor}, 0 0 20px ${shell.neonColor}50`
                }}
              />
              <span className="font-mono text-xs uppercase tracking-wider" style={{ textShadow: `0 0 5px ${shell.neonColor}30` }}>
                {shell.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Instruction */}
        <p className="mt-6 font-mono text-xs text-white/40 animate-pulse">
          Hover over the orbiting planets to scan • Click to lock orbit
        </p>
      </motion.div>
    </section>
  );
};