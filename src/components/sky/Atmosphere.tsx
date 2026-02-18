import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { techPlanets, planetShells, subscribeToVisibility, allTechNames } from '../sections/Technologies';

interface AtmosphereProps {
  onPhysicsUpdate?: (physics: any) => void;
}

const shellNeonColors = ['#00d4ff', '#ff00ff', '#ffaa00'];

// ─── Sky states ───────────────────────────────────────────────────────────────
const SKY_STATES = {
  noon:      { st:[15,25,70],   sb:[70,130,220], su:[255,255,240], gl:[220,230,255], hz:[120,170,255], so:0,    phase:'Noon',      short:'Blue skies ahead',          full:'Light travels the shortest path.' },
  afternoon: { st:[50,60,40],   sb:[200,160,120],su:[255,235,180], gl:[255,200,155], hz:[255,200,120], so:0,    phase:'Afternoon', short:'The sun descends',           full:'Longer wavelengths emerge.' },
  sunset:    { st:[30,40,60],   sb:[255,120,60], su:[255,180,100], gl:[255,140,80],  hz:[255,100,60],  so:0.15, phase:'Sunset',    short:'Golden hour',                full:'Blue scatters — reds remain.' },
  twilight:  { st:[15,15,40],   sb:[255,100,60], su:[255,140,100], gl:[255,100,80],  hz:[180,60,60],   so:0.35, phase:'Twilight',  short:'The horizon glows',          full:'Scattered light paints the sky.' },
  dusk:      { st:[8,8,25],     sb:[50,40,90],   su:[255,120,80],  gl:[80,50,80],    hz:[50,35,60],    so:0.65, phase:'Dusk',      short:'Stars emerge',               full:'Twilight fades to indigo.' },
  night:     { st:[5,5,20],     sb:[15,13,30],   su:[255,150,100], gl:[60,40,80],    hz:[40,30,50],    so:0.85, phase:'Night',     short:'Stars hold dominion',        full:'Only ancient light remains.' },
} as const;

type SkyKey = keyof typeof SKY_STATES;

const getPhaseLabel = (alt: number): SkyKey => {
  if (alt > 60) return 'noon';
  if (alt > 30) return 'afternoon';
  if (alt > 5)  return 'sunset';
  if (alt > -5) return 'twilight';
  if (alt > -15) return 'dusk';
  return 'night';
};

const progressToAltitude = (p: number): number => {
  const keys = [[0.00,90],[0.20,65],[0.40,30],[0.55,8],[0.65,-2],[0.78,-12],[1.00,-25]] as [number,number][];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0,a0] = keys[i]; const [p1,a1] = keys[i+1];
    if (p <= p1) return a0 + (a1-a0) * (p-p0)/(p1-p0);
  }
  return -25;
};

const computeSkyColors = (alt: number) => {
  const lerp = (a: number, b: number, t: number) => a + (b-a)*t;
  const lc = (c1: readonly number[], c2: readonly number[], t: number): number[] =>
    [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)];
  const S = SKY_STATES;
  const mix = (a: SkyKey, b: SkyKey, t: number) => ({
    st: lc(S[a].st,S[b].st,t), sb: lc(S[a].sb,S[b].sb,t),
    su: lc(S[a].su,S[b].su,t), gl: lc(S[a].gl,S[b].gl,t),
    hz: lc(S[a].hz,S[b].hz,t), so: lerp(S[a].so,S[b].so,t),
  });
  let cs;
  if      (alt > 60)  cs = mix('noon','afternoon',(90-alt)/30);
  else if (alt > 30)  cs = mix('afternoon','sunset',(60-alt)/30);
  else if (alt > 5)   cs = mix('sunset','twilight',(30-alt)/25);
  else if (alt > -5)  cs = mix('twilight','dusk',(5-alt)/10);
  else if (alt > -15) cs = mix('dusk','night',(-5-alt)/10);
  else                cs = mix('night','night',Math.min(1,(-15-alt)/10));
  const rgb = (a: number[]) => `rgb(${a.map(v=>Math.max(0,Math.min(255,Math.round(v)))).join(',')})`;
  return { cs, rgb };
};

// ─── Chaotic entry: truly random scatter from any edge + interior explosion ──
// Each planet gets a seeded random origin far off screen in a random direction
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const getChaosOrigin = (index: number, vw: number, vh: number) => {
  // Random angle outward from center, pushed way off screen
  const angle = seededRandom(index * 3.7) * Math.PI * 2;
  const dist = Math.max(vw, vh) * (1.2 + seededRandom(index * 1.3) * 0.8);
  return {
    x: vw * 0.5 + Math.cos(angle) * dist,
    y: vh * 0.5 + Math.sin(angle) * dist,
    angle,
  };
};

// Exit: scatter to a different random direction
const getChaosExit = (index: number, vw: number, vh: number, currentX: number, currentY: number) => {
  const seed = index * 7.7 + 99;
  const angle = seededRandom(seed) * Math.PI * 2;
  const dist = Math.max(vw, vh) * (1.3 + seededRandom(seed + 1) * 0.5);
  return {
    x: currentX + Math.cos(angle) * dist,
    y: currentY + Math.sin(angle) * dist,
  };
};

// ─── PlanetTooltip portal ─────────────────────────────────────────────────────
const PlanetTooltip = ({ planet, anchorX, anchorY, isLocked, isHovered }: {
  planet: typeof techPlanets[0]; anchorX: number; anchorY: number;
  isLocked: boolean; isHovered: boolean;
}) => {
  const neonColor = shellNeonColors[planet.shell || 0];
  if (!anchorX || !anchorY || isNaN(anchorX) || isNaN(anchorY)) return null;
  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ position:'fixed', left:anchorX, top:anchorY+10, transform:'translateX(-50%)', zIndex:9999, pointerEvents:'none' }}
    >
      <div style={{
        background:'rgba(0,0,0,0.85)', border:`1px solid ${neonColor}`,
        borderRadius:8, padding:'7px 12px', minWidth:120,
        boxShadow:`0 0 18px ${neonColor}40, 0 4px 20px rgba(0,0,0,0.7)`,
        backdropFilter:'blur(14px)', position:'relative',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', width:5, height:5,
            borderTop:    i<2  ? `1px solid ${neonColor}` : 'none',
            borderBottom: i>=2 ? `1px solid ${neonColor}` : 'none',
            borderLeft:   i%2===0 ? `1px solid ${neonColor}` : 'none',
            borderRight:  i%2===1 ? `1px solid ${neonColor}` : 'none',
            top: i<2?3:'auto', bottom: i>=2?3:'auto',
            left: i%2===0?3:'auto', right: i%2===1?3:'auto',
          }} />
        ))}
        <div style={{ color:neonColor, fontFamily:'monospace', fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', textShadow:`0 0 8px ${neonColor}` }}>
          {planet.name}
        </div>
        <div style={{ color:'rgba(255,255,255,0.65)', fontFamily:'monospace', fontSize:9, marginTop:2 }}>
          {planet.description}
        </div>
        <div style={{ color:neonColor, fontFamily:'monospace', fontSize:8, marginTop:3, opacity:0.5, letterSpacing:1 }}>
          {isLocked ? 'ORBIT LOCKED' : 'SCANNING...'}
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

// ─── TechPlanet ───────────────────────────────────────────────────────────────
const TechPlanet = ({
  planet, planetIndex, sunX, sunY, viewportWidth, viewportHeight,
  altitude, isActive, globalHoveredPlanet, setGlobalHoveredPlanet, revealAll,
}: {
  planet: typeof techPlanets[0]; planetIndex: number;
  sunX: number; sunY: number; viewportWidth: number; viewportHeight: number;
  altitude: number; isActive: boolean;
  globalHoveredPlanet: string | null;
  setGlobalHoveredPlanet: (n: string | null) => void;
  revealAll: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [angle, setAngle] = useState((planet.initialAngle || 0) * Math.PI / 180);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPlanetVisible, setIsPlanetVisible] = useState(false);
  const [exitTarget, setExitTarget] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const planetRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trackRafRef = useRef<number>(0);
  const orbitRafRef = useRef<number>(0);
  const angleRef = useRef(angle);

  const shell = planetShells[planet.shell || 0];
  const pixelRadius = viewportWidth * shell.radius;
  const neonColor = shellNeonColors[planet.shell || 0];
  const isDimmed = !!(globalHoveredPlanet && globalHoveredPlanet !== planet.name && !isHovered);

  // Compute position from current angle
  const x = sunX + Math.cos(angle) * pixelRadius;
  const y = sunY + Math.sin(angle) * pixelRadius * 0.5;

  // Keep angleRef in sync for exit calc
  useEffect(() => { angleRef.current = angle; }, [angle]);

  // Entry: staggered mount with varied delays
  useEffect(() => {
    if (!isActive || hasMounted) return;
    // Varied stagger: not perfectly linear, adds chaos
    const baseDelay = planetIndex * 110;
    const jitter = seededRandom(planetIndex * 4.2) * 250;
    const timer = setTimeout(() => setHasMounted(true), baseDelay + jitter + 200);
    return () => clearTimeout(timer);
  }, [isActive, hasMounted, planetIndex]);

  // Reset hasMounted when section leaves view (triggers re-entry animation next time)
  useEffect(() => {
    if (isActive) return;
    // Trigger chaotic exit first
    const currentX = sunX + Math.cos(angleRef.current) * pixelRadius;
    const currentY = sunY + Math.sin(angleRef.current) * pixelRadius * 0.5;
    const exit = getChaosExit(planetIndex, viewportWidth, viewportHeight, currentX, currentY);
    setExitTarget(exit);
    setIsExiting(true);

    const t1 = setTimeout(() => {
      setIsPlanetVisible(false);
      setIsExiting(false);
    }, 700);
    const t2 = setTimeout(() => setHasMounted(false), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  useEffect(() => {
    const offScreen = y > viewportHeight + 150;
    const tooLow = altitude < -30;
    const should = !offScreen && !tooLow && isActive && hasMounted && !isExiting;
    if (should && !isPlanetVisible) setIsPlanetVisible(true);
    else if (!should && isPlanetVisible && !isExiting) {
      setTimeout(() => setIsPlanetVisible(false), 150);
    }
  }, [y, altitude, isActive, hasMounted, isExiting, viewportHeight]);

  // Orbit loop
  useEffect(() => {
    if (!isActive) return;
    let last = performance.now();
    const animate = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      const slow = isPaused || isLocked || (globalHoveredPlanet && globalHoveredPlanet !== planet.name);
      setAngle(prev => prev + (slow ? shell.speed * 0.04 : shell.speed) * delta);
      orbitRafRef.current = requestAnimationFrame(animate);
    };
    orbitRafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(orbitRafRef.current);
  }, [isActive, shell.speed, isPaused, isLocked, globalHoveredPlanet]);

  const inFront = Math.sin(angle) > 0;
  const depthScale = isLocked ? 2.2 : isHovered ? 1.8 : (inFront ? 1.15 : 0.78);
  const brightness = inFront ? 1.15 : 0.55;
  const zIndex = inFront ? 100 : 10;
  const planetSize = planet.size || 24;
  const entryOrigin = getChaosOrigin(planetIndex, viewportWidth, viewportHeight);

  // Label: always visible, fades with planet
  const labelOffset = planetSize * 0.5 + 10;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true); setIsPaused(true);
    setGlobalHoveredPlanet(planet.name);
  }, [planet.name, setGlobalHoveredPlanet]);

  const handleMouseLeave = useCallback(() => {
    if (!isLocked) { setIsHovered(false); setIsPaused(false); setGlobalHoveredPlanet(null); }
  }, [isLocked, setGlobalHoveredPlanet]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) { setIsLocked(false); setGlobalHoveredPlanet(null); }
    else { setIsLocked(true); setGlobalHoveredPlanet(planet.name); }
  }, [isLocked, planet.name, setGlobalHoveredPlanet]);

  const showDetailTooltip = (isHovered || isLocked) && isPlanetVisible;

  // For exit animation — fly to chaos exit point
  const animateTarget = isExiting
    ? { opacity: 0, x: exitTarget.x, y: exitTarget.y, scale: 0.1, filter: `brightness(5) blur(16px)` }
    : { opacity: isDimmed ? 0.15 : 1, x, y, scale: depthScale, filter: `brightness(${brightness}) blur(0px)` };

  return (
    <>
      <AnimatePresence>
        {(isPlanetVisible || isExiting) && (
          <motion.div
            key={`planet-${planet.name}`}
            ref={planetRef}
            initial={prefersReducedMotion ? { opacity: 0, x, y } : {
              opacity: 0,
              x: entryOrigin.x,
              y: entryOrigin.y,
              scale: 0.1,
              filter: `brightness(6) blur(18px)`,
            }}
            animate={animateTarget}
            exit={{ opacity: 0, scale: 0.05, filter: `brightness(6) blur(20px)`,
              transition: { duration: 0.4, ease: 'easeIn' } }}
            transition={isExiting ? {
              x: { duration: 0.65, ease: [0.4, 0, 1, 1] },
              y: { duration: 0.65, ease: [0.4, 0, 1, 1] },
              opacity: { duration: 0.5, ease: 'easeIn' },
              scale: { duration: 0.6, ease: 'easeIn' },
              filter: { duration: 0.5 },
            } : {
              x: { duration: 0.05, ease: 'linear' },
              y: { duration: 0.05, ease: 'linear' },
              opacity: { duration: 1.1, ease: 'easeOut' },
              scale: { duration: 0.8, ease: [0.34, 1.6, 0.64, 1] },
              filter: { duration: 1.2, ease: 'easeOut' },
            }}
            style={{
              position: 'fixed',
              width: planetSize, height: planetSize,
              marginLeft: -planetSize / 2, marginTop: -planetSize / 2,
              zIndex,
              cursor: 'pointer',
              pointerEvents: isActive && !isExiting ? 'auto' : 'none',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {/* Outer atmosphere glow */}
            <div style={{
              position: 'absolute',
              inset: `-${planetSize * 1.5}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${neonColor}25 0%, ${neonColor}08 50%, transparent 70%)`,
              filter: `blur(${planetSize * 0.4}px)`,
              transition: 'all 0.4s ease',
            }} />

            {/* Spinning neon ring */}
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: `1px solid ${neonColor}`,
              boxShadow: `0 0 ${isHovered||isLocked ? 14 : 5}px ${neonColor}, inset 0 0 ${isHovered||isLocked ? 10:3}px ${neonColor}40`,
              transition: 'box-shadow 0.3s ease',
              animation: 'atmo-spin 9s linear infinite',
            }} />

            {/* Dashed scan ring on hover */}
            {(isHovered || isLocked || revealAll) && (
              <motion.div initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ position:'absolute', inset:-9, borderRadius:'50%', border:`1px dashed ${neonColor}70`, animation:'atmo-spin-rev 4s linear infinite' }}
              />
            )}

            {/* Planet core sphere */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: `radial-gradient(circle at 33% 33%, ${planet.color}ff, ${planet.color}99 55%, ${planet.color}30)`,
              boxShadow: `0 0 ${planetSize*0.45}px ${planet.color}55, inset 0 0 ${planetSize*0.25}px rgba(255,255,255,0.25)`,
            }} />

            {/* Symbol */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: planetSize * 0.44, lineHeight: 1,
              filter: `drop-shadow(0 0 3px ${neonColor})`,
              userSelect: 'none',
            }}>
              {planet.symbol}
            </div>

            {/* Lock badge */}
            {isLocked && (
              <div style={{ position:'absolute', top:-16, right:-6, fontSize:9, opacity:0.9 }}>🔒</div>
            )}

            {/* ── Always-visible label beneath planet ── */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: isDimmed ? 0.1 : (isHovered || isLocked ? 1 : 0.75), y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 6,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'monospace',
                fontSize: Math.max(8, planetSize * 0.32),
                fontWeight: 700,
                letterSpacing: 1,
                color: isHovered || isLocked ? neonColor : 'rgba(255,255,255,0.85)',
                textShadow: isHovered || isLocked
                  ? `0 0 10px ${neonColor}, 0 0 20px ${neonColor}60`
                  : `0 1px 6px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.5)`,
                transition: 'color 0.2s ease, text-shadow 0.2s ease',
                backdropFilter: 'blur(2px)',
              }}>
                {planet.name}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed tooltip on hover/lock */}
      <AnimatePresence>
        {showDetailTooltip && (
          <PlanetTooltip
            planet={planet}
            anchorX={x}
            anchorY={y + planetSize / 2 + 28}
            isLocked={isLocked}
            isHovered={isHovered}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── OrbitalRing ──────────────────────────────────────────────────────────────
const OrbitalRing = ({ sunX, sunY, radius, color, isActive, viewportWidth, isHighlighted }: {
  sunX: number; sunY: number; radius: number; color: string;
  isActive: boolean; viewportWidth: number; isHighlighted?: boolean;
}) => {
  const px = viewportWidth * radius;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: isActive ? (isHighlighted ? 0.45 : 0.12) : 0, scale: isActive ? 1 : 0.4 }}
      transition={{ duration: 1.0, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        position: 'fixed', left: sunX, top: sunY,
        width: px*2, height: px,
        marginLeft: -px, marginTop: -px/2,
        borderRadius: '50%',
        border: `1px solid ${color}`,
        boxShadow: isHighlighted ? `0 0 14px ${color}50` : 'none',
        pointerEvents: 'none', zIndex: 5,
        transition: 'box-shadow 0.3s ease',
      }}
    />
  );
};

// ─── Mobile Tech Marquee ──────────────────────────────────────────────────────
const MobileTechMarquee = ({ isVisible }: { isVisible: boolean }) => {
  const neonFor = (name: string) => shellNeonColors[techPlanets.find(p=>p.name===name)?.shell || 0];
  const colorFor = (name: string) => techPlanets.find(p=>p.name===name)?.color || '#61dafb';
  const symFor = (name: string) => techPlanets.find(p=>p.name===name)?.symbol || '◉';

  // Three rows, cycling differently
  const chunk = Math.ceil(allTechNames.length / 3);
  const rows = [
    allTechNames.slice(0, chunk),
    allTechNames.slice(chunk, chunk*2),
    allTechNames.slice(chunk*2),
  ];
  const speeds = [20, 27, 23];
  const dirs = [1, -1, 1]; // alternating scroll directions

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            zIndex: 20, pointerEvents: 'none',
            padding: '12px 0 calc(12px + env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
            backdropFilter: 'blur(2px)',
          }}
        >
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ overflow: 'hidden', marginBottom: 7 }}>
              <motion.div
                animate={{ x: dirs[rowIdx] === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ duration: speeds[rowIdx], ease: 'linear', repeat: Infinity }}
                style={{ display: 'flex', gap: 10, whiteSpace: 'nowrap', width: 'max-content' }}
              >
                {[...row, ...row].map((name, i) => {
                  const neon = neonFor(name);
                  const col = colorFor(name);
                  const sym = symFor(name);
                  return (
                    <div key={`${name}-${rowIdx}-${i}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 11px 4px 8px',
                      borderRadius: 16,
                      border: `1px solid ${neon}35`,
                      background: `linear-gradient(135deg, ${col}18, ${neon}08)`,
                      backdropFilter: 'blur(8px)',
                    }}>
                      <span style={{ fontSize: 12 }}>{sym}</span>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 10,
                        fontWeight: 700, letterSpacing: 0.8,
                        color: 'rgba(255,255,255,0.88)',
                        textShadow: `0 0 8px ${neon}80`,
                      }}>
                        {name}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── ATMOSPHERE ───────────────────────────────────────────────────────────────
export const Atmosphere = ({ onPhysicsUpdate }: AtmosphereProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skyDivRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globalHoveredPlanet, setGlobalHoveredPlanet] = useState<string | null>(null);
  const [revealAll] = useState(false);
  const [planetsVisible, setPlanetsVisibleState] = useState(false);
  const [planetsActive, setPlanetsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const targetAltRef = useRef(90);
  const currentAltRef = useRef(90);
  const [altitudeState, setAltitudeState] = useState(90);
  const rafIdRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll → altitude with smooth interpolation
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      targetAltRef.current = progressToAltitude(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const ALPHA = 0.06;
    const loop = () => {
      const diff = targetAltRef.current - currentAltRef.current;
      if (Math.abs(diff) > 0.03) {
        currentAltRef.current += diff * ALPHA;
        setAltitudeState(currentAltRef.current);
        if (skyDivRef.current) {
          const alt = Math.max(-25, Math.min(90, currentAltRef.current));
          const { cs, rgb } = computeSkyColors(alt);
          skyDivRef.current.style.background =
            `linear-gradient(to bottom, ${rgb(cs.st)} 0%, ${rgb(cs.sb)} 52%, ${rgb(cs.hz)} 100%)`;
        }
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafIdRef.current); };
  }, []);

  useEffect(() => {
    const upd = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    upd(); window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  useEffect(() => {
    const u = subscribeToVisibility(setPlanetsVisibleState);
    return () => { u?.(); };
  }, []);

  useEffect(() => {
    setPlanetsActive(altitudeState > -20 && dimensions.width > 0 && planetsVisible);
  }, [altitudeState, dimensions.width, planetsVisible]);

  const sunX = dimensions.width * 0.7;
  const sunY = dimensions.height > 0
    ? Math.max(50, Math.min(dimensions.height - 50,
        dimensions.height * 0.1 + ((90 - altitudeState) / 110) * dimensions.height * 0.8))
    : 0;

  const highlightedShell = globalHoveredPlanet
    ? techPlanets.find(p => p.name === globalHoveredPlanet)?.shell ?? null
    : null;

  const physics = useMemo(() => {
    const alt = Math.max(-25, Math.min(90, altitudeState));
    const safeAlt = Math.max(0.5, Math.abs(alt));
    const rad = (safeAlt * Math.PI) / 180;
    const pathLength = Math.min(1 / Math.sin(rad), 50);
    const scatteringStrength = Math.min((pathLength - 1) * 1.5, 12);
    const { cs, rgb } = computeSkyColors(alt);
    const phaseKey = getPhaseLabel(alt);
    const cur = SKY_STATES[phaseKey];
    return {
      altitude: alt, pathLength, scatteringStrength,
      skyTop: rgb(cs.st), skyBottom: rgb(cs.sb),
      sunColor: rgb(cs.su), glowColor: rgb(cs.gl), horizonColor: rgb(cs.hz),
      starsOpacity: Math.max(0, Math.min(1, cs.so)),
      isNight: alt < -5, sunX, sunY, timeOfDay: phaseKey,
      currentState: { phase: cur.phase, short: cur.short, full: cur.full },
      blueSurvival: Math.max(0, Math.min(100, 100 - scatteringStrength * 8)),
    };
  }, [altitudeState, sunX, sunY]);

  useEffect(() => {
    if (physics) {
      onPhysicsUpdate?.(physics);
      window.dispatchEvent(new CustomEvent('atmosphere-physics-update', { detail: physics }));
    }
  }, [physics, onPhysicsUpdate]);

  const [particles] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i, x: 20 + Math.random() * 60, y: 10 + Math.random() * 70,
      size: 1.5 + Math.random() * 2.5, speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }))
  );

  // Canvas: stars + sun glow + beam + particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    let animId: number, time = 0;

    const draw = () => {
      const { width, height } = canvas;
      const p = physics;
      if (!width || !height) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Stars
      if (p.starsOpacity > 0) {
        for (let i = 0; i < 60; i++) {
          const sx = ((i * 137.5) % width + width) % width;
          const sy = ((i * 71.3) % (height * 0.7) + height * 0.7) % (height * 0.7);
          const tw = Math.sin(time + i) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(sx, sy, 1 + tw * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.starsOpacity * 0.85 * tw})`; ctx.fill();
        }
      }

      // Sun beam crepuscular rays
      const ox = width * 0.5, oy = height * 0.95;
      const bw = Math.min(40 + p.scatteringStrength * 5, 160);
      const bg = ctx.createLinearGradient(sunX, sunY, ox, oy);
      bg.addColorStop(0, p.sunColor.replace(')', `,${p.isNight ? 0.15 : 0.35})`));
      bg.addColorStop(0.5, p.glowColor.replace(')', `,${Math.max(0, 0.25 - p.scatteringStrength * 0.01)})`));
      bg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(sunX - bw/2, sunY); ctx.lineTo(sunX + bw/2, sunY);
      ctx.lineTo(ox + bw, oy); ctx.lineTo(ox - bw, oy); ctx.closePath();
      ctx.fillStyle = bg; ctx.fill();

      // Atmospheric particles
      particles.forEach(pt => {
        const px2 = ((pt.x / 100) * width + width) % width;
        const py2 = ((pt.y / 100) * height + height) % height;
        const ph = (time * pt.speed + pt.phase) % (Math.PI * 2);
        ctx.beginPath(); ctx.arc(px2, py2, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,200,255,${0.07 + Math.sin(ph) * 0.07})`; ctx.fill();
      });

      // Sun disc + glow
      const sr = Math.min(30 + p.scatteringStrength * 2, 85);
      const pulse = Math.sin(time * 1.8) * 0.08 + 0.92;
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sr * 2.5);
      sg.addColorStop(0, p.sunColor);
      sg.addColorStop(0.25, p.sunColor.replace(')', ',0.7)'));
      sg.addColorStop(0.6, p.glowColor.replace(')', ',0.3)'));
      sg.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(sunX, sunY, sr * 2.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = sg; ctx.fill();
      // Hard disc
      ctx.beginPath(); ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
      ctx.fillStyle = p.sunColor; ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, [particles, physics, sunX, sunY]);

  const { cs: initCs, rgb: initRgb } = computeSkyColors(90);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {/* Sky gradient — updated directly via JS for smooth perf */}
      <div
        ref={skyDivRef}
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, ${initRgb(initCs.st)} 0%, ${initRgb(initCs.sb)} 52%, ${initRgb(initCs.hz)} 100%)`,
        }}
      />

      {/* Canvas: stars, beam, particles, sun */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Orbital rings — desktop only */}
      {!isMobile && planetShells.map((shell, i) => (
        <OrbitalRing key={i} sunX={sunX} sunY={sunY}
          radius={shell.radius} color={shellNeonColors[i]}
          isActive={planetsActive} viewportWidth={dimensions.width}
          isHighlighted={highlightedShell === i}
        />
      ))}

      {/* Orbiting planets with labels — desktop only */}
      {!isMobile && dimensions.width > 0 && techPlanets.map((planet, i) => (
        <TechPlanet key={planet.name} planet={planet} planetIndex={i}
          sunX={sunX} sunY={sunY}
          viewportWidth={dimensions.width} viewportHeight={dimensions.height}
          altitude={altitudeState} isActive={planetsActive}
          globalHoveredPlanet={globalHoveredPlanet}
          setGlobalHoveredPlanet={setGlobalHoveredPlanet}
          revealAll={revealAll}
        />
      ))}

      {/* Mobile marquee */}
      {isMobile && <MobileTechMarquee isVisible={planetsActive} />}

      {/* Debug HUD */}
      <div style={{
        position: 'fixed', bottom: 16, left: 16,
        fontFamily: 'monospace', fontSize: 10,
        color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', zIndex: 999,
      }}>
        {altitudeState.toFixed(1)}° {physics.pathLength.toFixed(1)}× {physics.timeOfDay}
      </div>

      <style>{`
        @keyframes atmo-spin     { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes atmo-spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
};