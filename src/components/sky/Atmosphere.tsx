import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';
import { techPlanets, planetShells, subscribeToVisibility } from '../sections/Technologies';

interface ScatteringParticle {
  id: number; x: number; y: number;
  size: number; speed: number; phase: number;
}
interface AtmosphereProps { onPhysicsUpdate?: (physics: any) => void; }

const shellNeonColors = ['#00d4ff', '#ff00ff', '#ffaa00'];

// ─── Sky states ───────────────────────────────────────────────────────────────
const SKY_STATES = {
  noon:      { phase:'Noon',      short:'Blue skies ahead',           full:'Light travels the shortest path through the atmosphere.',       st:[15,25,70],  sb:[70,130,220],  su:[255,255,240], gl:[220,230,255], hz:[120,170,255], so:0    },
  afternoon: { phase:'Afternoon', short:'The sun begins its descent',  full:'Longer wavelengths emerge as the path through air grows.',      st:[50,60,40],  sb:[200,160,120], su:[255,235,180], gl:[255,200,155], hz:[255,200,120], so:0    },
  sunset:    { phase:'Sunset',    short:'Golden hour is upon us',      full:'Blue light scatters away — only warm reds and golds remain.',   st:[30,40,60],  sb:[255,120,60],  su:[255,180,100], gl:[255,140,80],  hz:[255,100,60],  so:0.15 },
  twilight:  { phase:'Twilight',  short:'The horizon still glows',     full:'The sun dips below — scattered light paints the arch of sky.',  st:[15,15,40],  sb:[255,100,60],  su:[255,140,100], gl:[255,100,80],  hz:[180,60,60],   so:0.35 },
  dusk:      { phase:'Dusk',      short:'Stars begin to emerge',       full:'Darkness gathers at the zenith as twilight fades to indigo.',   st:[8,8,25],    sb:[50,40,90],    su:[255,120,80],  gl:[80,50,80],    hz:[50,35,60],    so:0.65 },
  night:     { phase:'Night',     short:'The stars hold dominion',     full:'No sun, no scattering — only the ancient light of distant suns.',st:[5,5,20],   sb:[15,13,30],    su:[255,150,100], gl:[60,40,80],    hz:[40,30,50],    so:0.85 },
} as const;
type SkyKey = keyof typeof SKY_STATES;

const getPhaseLabel = (alt: number): SkyKey => {
  if (alt > 60)  return 'noon';
  if (alt > 30)  return 'afternoon';
  if (alt > 5)   return 'sunset';
  if (alt > -5)  return 'twilight';
  if (alt > -15) return 'dusk';
  return 'night';
};

const progressToAltitude = (p: number): number => {
  const keys = [
    [0.00,  90],
    [0.20,  65],
    [0.40,  30],
    [0.55,   8],
    [0.65,  -2],
    [0.78, -12],
    [1.00, -25],
  ] as [number, number][];

  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, a0] = keys[i];
    const [p1, a1] = keys[i + 1];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0);
      return a0 + (a1 - a0) * t;
    }
  }
  return -25;
};

// ─── PlanetLabel ─────────────────────────────────────────────────────────────
const PlanetLabel = ({ planet, x, y, isHovered, isLocked, neonColor, isVisible }: {
  planet: typeof techPlanets[0]; x: number; y: number;
  isHovered: boolean; isLocked: boolean; neonColor: string; isVisible: boolean;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: x, top: y + planet.size / 2 + 25, x: '-50%', zIndex: 50 }}
          initial={{ opacity: 0, y: 20, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: isHovered ? 1.1 : isLocked ? 1.15 : 1,
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0, 
            y: -20, 
            scale: 0.8, 
            filter: 'blur(10px)',
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 20,
            opacity: { duration: 0.4 },
            scale: { duration: 0.3 }
          }}
        >
          {/* Connecting beam */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ 
              bottom:'100%', 
              width: 2, 
              height: 20, 
              background: `linear-gradient(to bottom, ${neonColor}00, ${neonColor}80, ${neonColor})`, 
              boxShadow: `0 0 10px ${neonColor}` 
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.6, height: isHovered ? 25 : 20 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Label container */}
          <motion.div 
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${neonColor}`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 20px ${neonColor}40, inset 0 0 10px ${neonColor}20`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 100,
            }}
            animate={{
              borderColor: isHovered ? neonColor : `${neonColor}80`,
              boxShadow: isHovered
                ? `0 4px 30px rgba(0,0,0,0.6), 0 0 30px ${neonColor}60, inset 0 0 15px ${neonColor}30`
                : `0 4px 20px rgba(0,0,0,0.5), 0 0 20px ${neonColor}40, inset 0 0 10px ${neonColor}20`,
            }}
          >
            {/* Corner accents */}
            {[0,1,2,3].map(i => (
              <motion.div 
                key={i} 
                style={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  ...(i === 0 ? { top: -1, left: -1, borderTop: `2px solid ${neonColor}`, borderLeft: `2px solid ${neonColor}` } :
                     i === 1 ? { top: -1, right: -1, borderTop: `2px solid ${neonColor}`, borderRight: `2px solid ${neonColor}` } :
                     i === 2 ? { bottom: -1, left: -1, borderBottom: `2px solid ${neonColor}`, borderLeft: `2px solid ${neonColor}` } :
                     { bottom: -1, right: -1, borderBottom: `2px solid ${neonColor}`, borderRight: `2px solid ${neonColor}` })
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.6, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
            
            {/* Floating content */}
            <motion.div 
              animate={{ y: [0, -2, 0] }} 
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <h3 style={{ 
                fontFamily: 'monospace', 
                fontWeight: 800, 
                fontSize: 11, 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase', 
                color: '#fff', 
                textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}, 0 0 20px ${neonColor}`, 
                margin: 0, 
                textAlign: 'center', 
                whiteSpace: 'nowrap' 
              }}>
                {planet.name}
              </h3>
              <p style={{ 
                fontFamily: 'monospace', 
                fontSize: 8, 
                color: 'rgba(255,255,255,0.6)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                margin: 0, 
                textAlign: 'center' 
              }}>
                {planet.description}
              </p>
            </motion.div>
            
            {/* Status dot */}
            <motion.div 
              style={{ 
                position: 'absolute', 
                top: -3, 
                right: -3, 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: neonColor, 
                border: '2px solid rgba(0,0,0,0.8)' 
              }}
              animate={{ scale: isLocked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1, repeat: isLocked ? Infinity : 0 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── PlanetTooltip (portal) ───────────────────────────────────────────────────
const PlanetTooltip = ({ planet, anchorX, anchorY, isLocked, revealAll, isHovered }: {
  planet: typeof techPlanets[0]; anchorX: number; anchorY: number;
  isLocked: boolean; revealAll: boolean; isHovered: boolean;
}) => {
  const neonColor = shellNeonColors[planet.shell || 0];
  const status = isLocked ? 'ORBIT LOCKED' : revealAll && !isHovered ? 'REVEALED' : 'SCANNING...';
  if (!anchorX || !anchorY || isNaN(anchorX) || isNaN(anchorY)) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'fixed', left: anchorX, top: anchorY + 15, transform: 'translateX(-50%)', zIndex: 2147483647, pointerEvents: 'none' }}
    >
      <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 16, height: 16, background: 'rgba(0,0,0,0.95)', border: `2px solid ${neonColor}`, borderRight: 'none', borderBottom: 'none', zIndex: 1 }} />
      <div style={{ position: 'relative', padding: '14px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.95)', border: `2px solid ${neonColor}`, boxShadow: `0 0 30px ${neonColor}80, 0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px ${neonColor}25`, backdropFilter: 'blur(20px)', overflow: 'hidden', minWidth: 160 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', width: 12, height: 12,
            ...(i === 0 ? { top: 4, left: 4, borderTop: `3px solid ${neonColor}`, borderLeft: `3px solid ${neonColor}` } :
               i === 1 ? { top: 4, right: 4, borderTop: `3px solid ${neonColor}`, borderRight: `3px solid ${neonColor}` } :
               i === 2 ? { bottom: 4, left: 4, borderBottom: `3px solid ${neonColor}`, borderLeft: `3px solid ${neonColor}` } :
               { bottom: 4, right: 4, borderBottom: `3px solid ${neonColor}`, borderRight: `3px solid ${neonColor}` }) }} />
        ))}
        <motion.div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)`, opacity: 0.8 }} animate={{ top: ['0%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
        <h3 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, 0 0 40px ${neonColor}`, margin: '0 0 6px 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>{planet.name}</h3>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>{planet.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 2 }}>
          <motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: neonColor, boxShadow: `0 0 12px ${neonColor}` }} animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{status}</span>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

// ─── TechPlanet ───────────────────────────────────────────────────────────────
const TechPlanet = ({ planet, sunX, sunY, viewportWidth, altitude, isActive, globalHoveredPlanet, setGlobalHoveredPlanet, revealAll }: {
  planet: typeof techPlanets[0]; sunX: number; sunY: number; viewportWidth: number; altitude: number;
  isActive: boolean; globalHoveredPlanet: string | null; setGlobalHoveredPlanet: (n: string | null) => void; revealAll: boolean;
}) => {
  const [angle, setAngle] = useState((planet.initialAngle || 0) * (Math.PI / 180));
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const planetRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const shell = planetShells[planet.shell || 0];
  const pixelRadius = viewportWidth * shell.radius;
  const neonColor = shellNeonColors[planet.shell || 0];
  const isDimmed = !!(globalHoveredPlanet && globalHoveredPlanet !== planet.name && !isHovered);

  const x = sunX + Math.cos(angle) * pixelRadius;
  const y = sunY + Math.sin(angle) * pixelRadius * 0.5;
  
  // Smooth visibility check with hysteresis to prevent flickering
  const [isPlanetVisible, setIsPlanetVisible] = useState(false);
  
  useEffect(() => {
    const checkVisibility = () => {
      const offScreenBottom = y > (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100;
      const tooLowAltitude = altitude < -30;
      const shouldBeVisible = !offScreenBottom && !tooLowAltitude && isActive;
      
      // Add small delay before hiding to prevent flickering
      if (!shouldBeVisible && isPlanetVisible) {
        setTimeout(() => setIsPlanetVisible(false), 100);
      } else if (shouldBeVisible) {
        setIsPlanetVisible(true);
      }
    };
    
    checkVisibility();
  }, [y, altitude, isActive, isPlanetVisible]);

  useEffect(() => {
    const track = () => {
      if (planetRef.current) {
        const r = planetRef.current.getBoundingClientRect();
        setTooltipPos({ x: r.left + r.width / 2, y: r.bottom });
      }
      rafRef.current = requestAnimationFrame(track);
    };
    track();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    if (!isActive) return;
    let animId: number; let last = performance.now();
    const animate = (now: number) => {
      const delta = (now - last) / 1000; last = now;
      const slow = isPaused || isLocked || (globalHoveredPlanet && globalHoveredPlanet !== planet.name);
      setAngle(prev => prev + (slow ? shell.speed * 0.05 : shell.speed) * delta);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isActive, shell.speed, isPaused, isLocked, globalHoveredPlanet]);

  const inFront = Math.sin(angle) > 0;
  const scale = isLocked ? 2.2 : isHovered ? 1.8 : (inFront ? 1.2 : 0.8);
  const brightness = inFront ? 1.2 : 0.6;
  const zIndex = inFront ? 100 : 10;
  const glowScale = isLocked ? 4.5 : isHovered ? 3.5 : 2.5;
  const showTooltip = isHovered || isLocked || revealAll;

  const handleMouseEnter = useCallback(() => { setIsHovered(true); setIsPaused(true); setGlobalHoveredPlanet(planet.name); }, [planet.name, setGlobalHoveredPlanet]);
  const handleMouseLeave = useCallback(() => { if (!isLocked) { setIsHovered(false); setIsPaused(false); setGlobalHoveredPlanet(null); } }, [isLocked, setGlobalHoveredPlanet]);
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) { setIsLocked(false); setGlobalHoveredPlanet(null); }
    else { setIsLocked(true); setGlobalHoveredPlanet(planet.name); }
  }, [isLocked, planet.name, setGlobalHoveredPlanet]);

  return (
    <>
      {/* Label with smooth fade */}
      <PlanetLabel 
        planet={planet} 
        x={x} 
        y={y} 
        isHovered={isHovered} 
        isLocked={isLocked} 
        neonColor={neonColor} 
        isVisible={isPlanetVisible} 
      />

      {/* Planet with AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {isPlanetVisible && (
          <motion.div
            ref={planetRef}
            className="absolute"
            style={{ left: x - planet.size / 2, top: y - planet.size / 2, width: planet.size, height: planet.size, zIndex }}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              rotate: -180,
              filter: 'blur(20px) brightness(2)'
            }}
            animate={{ 
              opacity: isDimmed ? 0.3 : 1, 
              scale: scale,
              rotate: 0,
              filter: isDimmed ? 'grayscale(0.6) brightness(0.4)' : 'blur(0px) brightness(1)'
            }}
            exit={{ 
              opacity: 0, 
              scale: 0, 
              rotate: 180,
              filter: 'blur(20px) brightness(2)',
              transition: { 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1],
                rotate: { duration: 1, ease: 'easeInOut' }
              }
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 20,
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 },
              filter: { duration: 0.3 }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            whileHover={{ cursor: 'pointer' }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute inset-[-4px] rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isHovered || isLocked ? [0.7, 1, 0.7] : [0.4, 0.5, 0.4], 
                scale: [glowScale, glowScale * 1.2, glowScale] 
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{ 
                background: `radial-gradient(circle, ${planet.color} 0%, ${neonColor}50 40%, transparent 70%)`, 
                filter: `blur(${isHovered ? 16 : 12}px) brightness(${1.8 * (planet.glowIntensity || 1)})` 
              }}
            />

            {/* Electric ring */}
            <AnimatePresence>
              {(isHovered || isLocked || revealAll) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  className="absolute inset-[-10px] rounded-full border-2 border-dashed pointer-events-none"
                  style={{ borderColor: neonColor, boxShadow: `0 0 30px ${neonColor}, inset 0 0 30px ${neonColor}40` }}
                />
              )}
            </AnimatePresence>

            {/* Planet core */}
            <motion.div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${planet.color} 0%, ${planet.color}e0 50%, ${planet.color}90 100%)`,
                boxShadow: `0 0 ${isHovered ? 60 : 40}px ${planet.color}, 0 0 ${isHovered ? 120 : 80}px ${neonColor}80, inset 0 0 ${isHovered ? 30 : 20}px rgba(255,255,255,0.7), inset -8px -8px 16px rgba(0,0,0,0.4)`,
                filter: `brightness(${brightness})`,
                border: `3px solid ${planet.color}`,
              }}
            >
              {/* Inner pulse */}
              <motion.div
                className="absolute inset-[15%] rounded-full pointer-events-none"
                animate={{ 
                  boxShadow: [`inset 0 0 15px ${planet.color}90`, `inset 0 0 30px ${planet.color}`, `inset 0 0 15px ${planet.color}90`], 
                  scale: [1, 1.15, 1] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ background: `radial-gradient(circle, #ffffff 0%, ${planet.color}80 60%, transparent 100%)` }}
              />
              
              {/* Scan line */}
              <AnimatePresence>
                {(isHovered || isLocked || revealAll) && (
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      style={{ boxShadow: `0 0 20px ${neonColor}, 0 0 40px ${neonColor}`, opacity: 0.9 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-[14px] font-black pointer-events-none select-none"
                  style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                  animate={{ 
                    textShadow: isHovered 
                      ? [`0 0 10px ${planet.color}`, `0 0 30px ${planet.color}`, `0 0 10px ${planet.color}`]
                      : `0 0 8px ${planet.color}`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {planet.symbol}
                </motion.span>
              </div>
            </motion.div>

            {/* Lock indicator */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 180, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center pointer-events-none"
                  style={{ background: 'rgba(0,0,0,0.9)', border: `2px solid ${neonColor}`, boxShadow: `0 0 20px ${neonColor}` }}
                >
                  <span className="text-sm">🔒</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isPlanetVisible && (
          <PlanetTooltip planet={planet} anchorX={tooltipPos.x} anchorY={tooltipPos.y} isLocked={isLocked} revealAll={revealAll} isHovered={isHovered} />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── OrbitalRing ─────────────────────────────────────────────────────────────
const OrbitalRing = ({ sunX, sunY, radius, color, isActive, viewportWidth, isHighlighted }: {
  sunX: number; sunY: number; radius: number; color: string; isActive: boolean; viewportWidth: number; isHighlighted?: boolean;
}) => {
  const px = viewportWidth * radius;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: sunX - px, top: sunY - px * 0.5, width: px * 2, height: px, borderRadius: '50%',
        border: `2px ${isHighlighted ? 'solid' : 'dashed'} ${isHighlighted ? color : `${color}40`}`,
        boxShadow: isHighlighted ? `0 0 40px ${color}60, inset 0 0 30px ${color}30` : 'none',
        transform: 'rotateX(60deg)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isActive ? (isHighlighted ? 0.9 : 0.3) : 0, scale: isActive ? 1 : 0.8 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px dashed ${isHighlighted ? color : 'transparent'}`, borderRadius: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

// ─── ATMOSPHERE ───────────────────────────────────────────────────────────────
export const Atmosphere = ({ onPhysicsUpdate }: AtmosphereProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globalHoveredPlanet, setGlobalHoveredPlanet] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [planetsVisible, setPlanetsVisible] = useState(false);
  const [planetsActive, setPlanetsActive] = useState(false);

  const targetAltRef = useRef(90);
  const currentAltRef = useRef(90);
  const [altitudeState, setAltitudeState] = useState(90);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      targetAltRef.current = progressToAltitude(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const ALPHA = 0.06;
    const loop = () => {
      const target = targetAltRef.current;
      const current = currentAltRef.current;
      const diff = target - current;
      if (Math.abs(diff) > 0.05) {
        currentAltRef.current = current + diff * ALPHA;
        setAltitudeState(currentAltRef.current);
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    const upd = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);

  useEffect(() => { const u = subscribeToVisibility(setPlanetsVisible); return () => { u?.(); }; }, []);
  useEffect(() => { setPlanetsActive(altitudeState > -20 && dimensions.width > 0); }, [altitudeState, dimensions.width]);

  const sunX = dimensions.width * 0.7;
  const sunY = dimensions.height > 0
    ? Math.max(50, Math.min(dimensions.height - 50, dimensions.height * 0.1 + ((90 - altitudeState) / 110) * dimensions.height * 0.8))
    : 0;

  const highlightedShell = globalHoveredPlanet ? techPlanets.find(p => p.name === globalHoveredPlanet)?.shell : null;

  const physics = useMemo(() => {
    const alt = Math.max(-25, Math.min(90, altitudeState));
    const safeAlt = Math.max(0.5, Math.abs(alt));
    const rad = (safeAlt * Math.PI) / 180;
    const pathLength = Math.min(1 / Math.sin(rad), 50);
    const scatteringStrength = Math.min((pathLength - 1) * 1.5, 12);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lc = (c1: readonly number[], c2: readonly number[], t: number): number[] =>
      [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

    type K = SkyKey;
    const S = SKY_STATES;
    const mix = (a: K, b: K, t: number) => ({
      st: lc(S[a].st, S[b].st, t), sb: lc(S[a].sb, S[b].sb, t),
      su: lc(S[a].su, S[b].su, t), gl: lc(S[a].gl, S[b].gl, t),
      hz: lc(S[a].hz, S[b].hz, t), so: lerp(S[a].so, S[b].so, t),
    });

    let cs; let t = 0;
    if (alt > 60) { t = (90 - alt) / 30; cs = mix('noon', 'afternoon', t); }
    else if (alt > 30) { t = (60 - alt) / 30; cs = mix('afternoon', 'sunset', t); }
    else if (alt > 5) { t = (30 - alt) / 25; cs = mix('sunset', 'twilight', t); }
    else if (alt > -5) { t = (5 - alt) / 10; cs = mix('twilight', 'dusk', t); }
    else if (alt > -15) { t = (-5 - alt) / 10; cs = mix('dusk', 'night', t); }
    else { t = Math.min(1, (-15 - alt) / 10); cs = mix('night', 'night', t); }

    const rgb = (a: number[]) => `rgb(${a.map(v => Math.max(0, Math.min(255, Math.round(v)))).join(',')})`;
    const phaseKey = getPhaseLabel(alt);
    const cur = SKY_STATES[phaseKey];

    return {
      altitude: alt, pathLength, scatteringStrength,
      skyTop: rgb(cs.st), skyBottom: rgb(cs.sb),
      sunColor: rgb(cs.su), glowColor: rgb(cs.gl), horizonColor: rgb(cs.hz),
      starsOpacity: Math.max(0, Math.min(1, cs.so)),
      isNight: alt < -5, sunX, sunY,
      timeOfDay: phaseKey,
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

  const [particles] = useState<ScatteringParticle[]>(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i, x: 20 + Math.random() * 60, y: 10 + Math.random() * 70,
      size: 1.5 + Math.random() * 2.5, speed: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2,
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    let animId: number, time = 0;

    const draw = () => {
      const { width, height } = canvas; const p = physics;
      if (!width || !height) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, width, height); time += 0.016;

      if (p.starsOpacity > 0) {
        ctx.fillStyle = `rgba(255,255,255,${p.starsOpacity * 0.8})`;
        for (let i = 0; i < 60; i++) {
          const sx = ((i * 137.5) % width + width) % width;
          const sy = ((i * 71.3) % (height * 0.7) + height * 0.7) % (height * 0.7);
          const tw = Math.sin(time + i) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(sx, sy, 1 + tw * 1.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      const ox = width * 0.5, oy = height * 0.95;
      const bw = Math.min(40 + p.scatteringStrength * 5, 150);
      const bg = ctx.createLinearGradient(sunX, sunY, ox, oy);
      bg.addColorStop(0, p.sunColor.replace(')', `,${p.isNight ? 0.2 : 0.4})`));
      bg.addColorStop(0.5, p.glowColor.replace(')', `,${0.3 - p.scatteringStrength * 0.01})`));
      bg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(sunX - bw / 2, sunY); ctx.lineTo(sunX + bw / 2, sunY);
      ctx.lineTo(ox + bw, oy); ctx.lineTo(ox - bw, oy);
      ctx.closePath(); ctx.fillStyle = bg; ctx.fill();

      particles.forEach(pt => {
        const px2 = ((pt.x / 100) * width + width) % width;
        const py2 = ((pt.y / 100) * height + height) % height;
        const ph = (time * pt.speed + pt.phase) % (Math.PI * 2);
        ctx.beginPath(); ctx.arc(px2, py2, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,200,255,${0.1 + Math.sin(ph) * 0.1})`; ctx.fill();
      });

      const sr = Math.min(30 + p.scatteringStrength * 2, 80);
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sr * 2);
      sg.addColorStop(0, p.sunColor);
      sg.addColorStop(0.3, p.sunColor.replace(')', ',0.6)'));
      sg.addColorStop(0.7, p.glowColor.replace(')', ',0.3)'));
      sg.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(sunX, sunY, sr * 2 * pulse, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
      ctx.beginPath(); ctx.arc(sunX, sunY, 15, 0, Math.PI * 2); ctx.fillStyle = p.sunColor; ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, [particles, physics, sunX, sunY]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0"
      style={{ background: `linear-gradient(180deg, ${physics.skyTop} 0%, ${physics.skyBottom} 60%, ${physics.horizonColor} 100%)`, overflow: 'visible' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: physics.starsOpacity }} />
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 80% 50% at 70% ${20 + (90 - altitudeState) * 0.3}%, ${physics.glowColor.replace(')', ',0.3)')} 0%, transparent 70%)` }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {planetsActive && planetShells.map((shell, i) => (
        <OrbitalRing key={i} sunX={sunX} sunY={sunY} radius={shell.radius} color={shellNeonColors[i]}
          isActive={planetsActive} viewportWidth={dimensions.width} isHighlighted={highlightedShell === i} />
      ))}

      {dimensions.width > 0 && techPlanets.map(planet => (
        <TechPlanet key={planet.name} planet={planet} sunX={sunX} sunY={sunY}
          viewportWidth={dimensions.width} altitude={altitudeState}
          isActive={planetsVisible} globalHoveredPlanet={globalHoveredPlanet}
          setGlobalHoveredPlanet={setGlobalHoveredPlanet} revealAll={revealAll} />
      ))}

      {/* Debug */}
      <div className="absolute bottom-4 right-4 font-mono text-[11px] text-white/30 flex flex-col items-end gap-0.5 pointer-events-none select-none">
        <span>{altitudeState.toFixed(1)}°</span>
        <span>{physics.pathLength.toFixed(1)}×</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{physics.timeOfDay}</span>
      </div>
    </div>
  );
};