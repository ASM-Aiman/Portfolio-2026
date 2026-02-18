import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const techPlanets = [
  // Shell 0 - Core Stack
  { name: "React",         color: "#61dafb", size: 28, initialAngle: 0,   symbol: "⚛",  description: "Component Architecture",  shell: 0 },
  { name: "TypeScript",    color: "#3178c6", size: 26, initialAngle: 120, symbol: "τ",  description: "Type Safety",              shell: 0 },
  { name: "Node.js",       color: "#68a063", size: 28, initialAngle: 240, symbol: "⬢",  description: "Runtime Environment",      shell: 0 },
  // Shell 1 - Infrastructure
  { name: "Next.js",       color: "#ffffff", size: 30, initialAngle: 45,  symbol: "▲",  description: "Full-Stack Framework",     shell: 1 },
  { name: "Python",        color: "#ffd43b", size: 32, initialAngle: 165, symbol: "🐍", description: "Data & ML",                shell: 1 },
  { name: "PostgreSQL",    color: "#336791", size: 26, initialAngle: 285, symbol: "🐘", description: "Relational Data",          shell: 1 },
  { name: "Docker",        color: "#2496ed", size: 24, initialAngle: 345, symbol: "🐳", description: "Containerization",         shell: 1 },
  { name: "Redis",         color: "#dc382d", size: 24, initialAngle: 210, symbol: "⚡", description: "In-Memory Cache",          shell: 1 },
  { name: "Nginx",         color: "#009639", size: 22, initialAngle: 300, symbol: "◈",  description: "Reverse Proxy",            shell: 1 },
  // Shell 2 - Specialized
  { name: "AWS",           color: "#ff9900", size: 34, initialAngle: 90,  symbol: "☁",  description: "Cloud Infrastructure",     shell: 2 },
  { name: "TensorFlow",    color: "#ff6f00", size: 28, initialAngle: 210, symbol: "🔶", description: "Neural Networks",          shell: 2 },
  { name: "Git",           color: "#f05032", size: 24, initialAngle: 330, symbol: "◉",  description: "Version Control",          shell: 2 },
  { name: "Jenkins",       color: "#d33833", size: 24, initialAngle: 30,  symbol: "⚙",  description: "CI/CD Pipelines",          shell: 2 },
  { name: "WSO2",          color: "#f47b20", size: 24, initialAngle: 150, symbol: "⬡",  description: "API Gateway & IAM",        shell: 2 },
  { name: "Pinecone",      color: "#00c4b4", size: 22, initialAngle: 270, symbol: "🌲", description: "Vector Database",          shell: 2 },
  { name: "RAG",           color: "#a855f7", size: 22, initialAngle: 195, symbol: "🧠", description: "Retrieval-Augmented Gen",  shell: 2 },
  { name: "Microservices", color: "#38bdf8", size: 22, initialAngle: 315, symbol: "⬕",  description: "Distributed Architecture", shell: 2 },
];

export const planetShells = [
  { radius: 0.14, speed: 0.6,  color: "#60a5fa", label: "Core Stack",     neonColor: "#00d4ff" },
  { radius: 0.22, speed: 0.4,  color: "#a78bfa", label: "Infrastructure", neonColor: "#ff00ff" },
  { radius: 0.31, speed: 0.22, color: "#fbbf24", label: "Specialized",    neonColor: "#ffaa00" },
];

export const allTechNames = techPlanets.map(p => p.name);

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale   = useSpring(scale,   { stiffness: 100, damping: 30 });

  const isInView = useTransform(scrollYProgress, (v) => v > 0.15 && v < 0.85);
  useEffect(() => {
    const unsub = isInView.on("change", (v) => setPlanetsVisibility(v));
    return () => { unsub(); setPlanetsVisibility(false); };
  }, [isInView]);

  return (
    <section ref={sectionRef} id="arsenal" className="relative min-h-screen py-32 overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto px-6 relative z-10 h-[80vh] flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: smoothOpacity, scale: smoothScale }}
      >
        <div className="text-center mb-12">
          {isMobile ? (
            /* ── Mobile: "Signal Stack" creative header ── */
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              {/* Pulsing signal rings */}
              <div className="flex justify-center mb-5">
                <div className="relative w-12 h-12">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ scale: [1, 2.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.2, delay: i * 0.7, repeat: Infinity }}
                      style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid #00d4ff' }}
                    />
                  ))}
                  <div style={{ position:'absolute', inset:'28%', borderRadius:'50%', background:'radial-gradient(circle, #00d4ff, #005577)', boxShadow:'0 0 16px #00d4ff' }} />
                </div>
              </div>
              <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:5, textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:8 }}>
                Signal Stack
              </p>
              <h2 style={{ fontSize:26, fontWeight:800, color:'#fff', letterSpacing:-0.5, lineHeight:1.15, textShadow:'0 0 24px rgba(0,212,255,0.4)', marginBottom:8 }}>
                Tools of the{' '}
                <span style={{ background:'linear-gradient(90deg,#00d4ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Craft</span>
              </h2>
              <p style={{ fontFamily:'monospace', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:1 }}>
                Broadcasting across the spectrum ↓
              </p>
            </motion.div>
          ) : (
            /* ── Desktop: "Orbital Technologies" header ── */
            <>
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                className="inline-flex items-center gap-3 mb-4 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(100,200,255,0.3)]">
                <span className="text-2xl animate-pulse">⚛</span>
              </motion.div>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Orbital</span>{" "}Technologies
              </h2>
              <p className="font-serif italic text-white/70 max-w-2xl mx-auto text-lg">
                "My skills orbit the craft like planets around the sun—each in its destined path."
              </p>
            </>
          )}
        </div>

        {!isMobile && (
          <>
            <div className="mt-auto flex flex-wrap justify-center gap-6">
              {planetShells.map((shell, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-default">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shell.neonColor, boxShadow: `0 0 10px ${shell.neonColor}, 0 0 20px ${shell.neonColor}50` }} />
                  <span className="font-mono text-xs uppercase tracking-wider">{shell.label}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-6 font-mono text-xs text-white/40 animate-pulse">
              Hover over the orbiting planets to scan • Click to lock orbit
            </p>
          </>
        )}
      </motion.div>
    </section>
  );
};