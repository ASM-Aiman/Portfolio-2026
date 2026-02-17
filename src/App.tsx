import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Sun } from 'lucide-react';
import { Atmosphere } from './components/sky/Atmosphere';
import { DustParticles } from './components/ui/DustParticles';
import { FooterTime } from './components/ui/FooterTime';
import { Hero } from './components/sections/Hero';
import { Technologies } from './components/sections/Technologies';
import { Projects } from './components/sections/Projects';
import { Certificates } from './components/sections/Certificates';
import { Stories } from './components/sections/Stories';
import { Experience } from './components/sections/Experience';
import { Journey } from './components/sections/Journey ';
import { Achievements } from './components/sections/Achievements ';
import { Contact } from './components/sections/Contact ';
import { Footer } from './components/sections/Footer';
import { EducationSection } from './components/sections/EducationSection';
import { CoreValues } from './components/sections/CoreValues';
import { CurrentInterests } from './components/sections/CurrentInterests';
import { StatsBar } from './components/sections/StatsBar';

const OrbWidget = ({
  isExpanded, setIsExpanded, hasInteracted, setHasInteracted, physics,
}: {
  isExpanded: boolean; setIsExpanded: (v: boolean) => void;
  hasInteracted: boolean; setHasInteracted: (v: boolean) => void;
  physics: any;
}) => {
  const StateIcon = physics?.currentState?.icon || Sun;
  const color =
    physics?.altitude > 60 ? 'from-blue-400 to-cyan-300' :
    physics?.altitude > 30 ? 'from-amber-400 to-yellow-300' :
    physics?.altitude > 5  ? 'from-orange-500 to-red-400' :
    physics?.altitude > -5 ? 'from-purple-500 to-pink-400' :
                             'from-indigo-500 to-violet-400';

  return (
    <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[200] pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div key="orb" initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0 }} className="relative">
            <div className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">
              <motion.span initial={{ opacity:0, x:-10 }} animate={{ opacity:hasInteracted?0:1, x:0 }}
                className="text-xs text-white/50 font-mono bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                Discover the sky
              </motion.span>
            </div>
            <motion.button
              onClick={(e)=>{e.stopPropagation();setHasInteracted(true);setIsExpanded(true);}}
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
              className="relative w-14 h-14 rounded-full focus:outline-none cursor-pointer"
              style={{ background:'rgba(255,255,255,0.01)', border:'none' }}
            >
              <motion.div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background:`radial-gradient(circle, ${physics?.glowColor||'rgb(255,255,255)'}60 0%, transparent 70%)` }}
                animate={{ scale:[1,1.3,1], opacity:[0.6,1,0.6] }} transition={{ duration:2, repeat:Infinity }} />
              <motion.div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none"
                animate={{ rotate:360 }} transition={{ duration:15, repeat:Infinity, ease:'linear' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50" />
              </motion.div>
              <div className="absolute inset-1 rounded-full overflow-hidden backdrop-blur-md border border-white/40 pointer-events-none"
                style={{ background:`linear-gradient(135deg, ${physics?.sunColor||'rgb(255,255,255)'}50 0%, ${physics?.glowColor||'rgb(200,200,255)'}70 100%)`, boxShadow:`0 0 20px ${physics?.glowColor||'rgb(200,200,255)'}, inset 0 0 10px rgba(255,255,255,0.3)` }}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background:`conic-gradient(from 0deg, transparent 0%, ${physics?.sunColor||'rgb(255,255,255)'}30 25%, transparent 50%, ${physics?.glowColor||'rgb(200,200,255)'}30 75%, transparent 100%)` }}
                  animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <StateIcon className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" strokeWidth={1.5} />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 pointer-events-none">
                <motion.div animate={{ rotate:360 }} transition={{ duration:4, repeat:Infinity, ease:'linear' }}>
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="panel"
            initial={{ opacity:0, scale:0.8, x:-30 }} animate={{ opacity:1, scale:1, x:0 }} exit={{ opacity:0, scale:0.8, x:-30 }}
            transition={{ type:'spring', stiffness:300, damping:25 }}
            className="relative w-80" onClick={(e)=>e.stopPropagation()}>
            <div className={`absolute -inset-4 bg-gradient-to-br ${color} opacity-30 blur-2xl rounded-3xl pointer-events-none`} />
            <div className="relative backdrop-blur-2xl bg-black/30 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background:`linear-gradient(90deg, transparent, ${physics?.sunColor||'rgb(255,255,255)'}30, transparent)`, backgroundSize:'200% 100%' }}
                animate={{ backgroundPosition:['200% 0%','-200% 0%'] }} transition={{ duration:3, repeat:Infinity }} />
              <div className="relative flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background:`linear-gradient(135deg, ${physics?.sunColor||'rgb(255,255,255)'}80, ${physics?.glowColor||'rgb(200,200,255)'})`, boxShadow:`0 0 15px ${physics?.glowColor||'rgb(200,200,255)'}` }}>
                    <StateIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/90">{physics?.currentState?.phase||'Noon'}</h3>
                    <p className="text-xs text-white/50 font-mono">{physics?.altitude?.toFixed(0)||90}° altitude</p>
                  </div>
                </div>
                <button onClick={(e)=>{e.stopPropagation();setIsExpanded(false);}}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-white/80 font-medium">{physics?.currentState?.short||'Blue skies ahead'}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase tracking-wider">
                    <span>Light Path</span><span>{physics?.pathLength?.toFixed(1)||1}× longer</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className={`h-full bg-gradient-to-r ${color}`} initial={{ width:0 }} animate={{ width:`${Math.min(100,(physics?.pathLength||1)*8)}%` }} transition={{ duration:0.8, delay:0.2 }} />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
                  <p className="text-xs text-white/60 leading-relaxed pl-4 italic">"{physics?.currentState?.full||'Light takes the shortest path.'}"</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Scattering</p>
                    <p className="text-sm font-bold text-white/80">{physics?.scatteringStrength?.toFixed(1)||0}</p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Blue Light</p>
                    <p className="text-sm font-bold text-blue-300">{physics?.blueSurvival?.toFixed(0)||100}%</p>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [physics, setPhysics] = useState<any>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => setPhysics(e.detail);
    window.addEventListener('atmosphere-physics-update' as any, handler);
    return () => window.removeEventListener('atmosphere-physics-update' as any, handler);
  }, []);

  return (
    <div className="relative min-h-screen">

      {/*
        ── CRITICAL: Atmosphere is rendered DIRECTLY with no wrapper div. ──
        Your old code had:  <div className="fixed inset-0 z-0"><Atmosphere /></div>
        That wrapper creates a stacking context which:
          1. Traps portal tooltips behind it (they can't escape z-index isolation)
          2. Creates composite layer conflicts causing sky flicker on fast scroll
        Atmosphere is `position:fixed` internally — it needs no wrapper at all.
      */}
      <Atmosphere onPhysicsUpdate={setPhysics} />

      <div className="fixed inset-0 z-[1] pointer-events-none">
        <DustParticles />
      </div>
      <div className="fixed inset-0 pointer-events-none z-[2] opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      <div className="fixed bottom-0 left-0 right-0 z-[50] pointer-events-none">
        <div className="pointer-events-auto inline-block"><FooterTime /></div>
      </div>

      <OrbWidget isExpanded={isExpanded} setIsExpanded={setIsExpanded}
        hasInteracted={hasInteracted} setHasInteracted={setHasInteracted} physics={physics} />

      <main className="relative z-10">
        <Hero />
        <Technologies />
        <StatsBar />
        <CoreValues />
        <CurrentInterests />
        <Experience />
        <EducationSection />
        <Projects />
        <Certificates />
        <Achievements />
        <Journey />
        <Stories />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

export default App;