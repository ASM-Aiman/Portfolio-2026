import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { techPlanets, planetShells, subscribeToVisibility } from '../sections/Technologies';

interface AtmosphereProps {
  onPhysicsUpdate?: (physics: any) => void;
}

const shellNeonColors = ['#00d4ff', '#ff00ff', '#ffaa00'];

// ─── Sky states ────────────────────────────────────────────────────────────────
const SKY_STATES = {
  noon:      { st:[15,25,70],   sb:[70,130,220], su:[255,255,240], gl:[220,230,255], hz:[120,170,255], so:0,    phase:'Noon' },
  afternoon: { st:[50,60,40],   sb:[200,160,120],su:[255,235,180], gl:[255,200,155], hz:[255,200,120], so:0,    phase:'Afternoon' },
  sunset:    { st:[30,40,60],   sb:[255,120,60], su:[255,180,100], gl:[255,140,80],  hz:[255,100,60],  so:0.15, phase:'Sunset' },
  twilight:  { st:[15,15,40],   sb:[255,100,60], su:[255,140,100], gl:[255,100,80],  hz:[180,60,60],   so:0.35, phase:'Twilight' },
  dusk:      { st:[8,8,25],     sb:[50,40,90],   su:[255,120,80],  gl:[80,50,80],    hz:[50,35,60],    so:0.65, phase:'Dusk' },
  night:     { st:[5,5,20],     sb:[15,13,30],   su:[255,150,100], gl:[60,40,80],    hz:[40,30,50],    so:0.85, phase:'Night' },
} as const;
type SkyKey = keyof typeof SKY_STATES;

const getPhaseLabel = (alt: number): SkyKey => {
  if (alt > 60) return 'noon'; if (alt > 30) return 'afternoon';
  if (alt > 5) return 'sunset'; if (alt > -5) return 'twilight';
  if (alt > -15) return 'dusk'; return 'night';
};

const progressToAltitude = (p: number): number => {
  const keys = [[0,90],[0.2,65],[0.4,30],[0.55,8],[0.65,-2],[0.78,-12],[1,-25]] as [number,number][];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0,a0]=keys[i],[p1,a1]=keys[i+1];
    if (p<=p1) return a0+(a1-a0)*(p-p0)/(p1-p0);
  }
  return -25;
};

const computeSkyColors = (alt: number) => {
  const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
  const lc=(c1:readonly number[],c2:readonly number[],t:number):number[]=>
    [lerp(c1[0],c2[0],t),lerp(c1[1],c2[1],t),lerp(c1[2],c2[2],t)];
  const S=SKY_STATES;
  const mix=(a:SkyKey,b:SkyKey,t:number)=>({
    st:lc(S[a].st,S[b].st,t),sb:lc(S[a].sb,S[b].sb,t),
    su:lc(S[a].su,S[b].su,t),gl:lc(S[a].gl,S[b].gl,t),
    hz:lc(S[a].hz,S[b].hz,t),so:lerp(S[a].so,S[b].so,t),
  });
  let cs:ReturnType<typeof mix>;
  if(alt>60) cs=mix('noon','afternoon',(90-alt)/30);
  else if(alt>30) cs=mix('afternoon','sunset',(60-alt)/30);
  else if(alt>5) cs=mix('sunset','twilight',(30-alt)/25);
  else if(alt>-5) cs=mix('twilight','dusk',(5-alt)/10);
  else if(alt>-15) cs=mix('dusk','night',(-5-alt)/10);
  else cs=mix('night','night',Math.min(1,(-15-alt)/10));
  const rgb=(a:number[])=>`rgb(${a.map(v=>Math.max(0,Math.min(255,Math.round(v)))).join(',')})`;
  return {cs,rgb};
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function easeOutBack(t: number): number {
  const c1=1.70158, c3=c1+1;
  return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);
}
function easeInCubic(t: number): number { return t*t*t; }

// ─── Tooltip portal ────────────────────────────────────────────────────────────
const PlanetTooltip = ({ planet, x, y, isLocked }: {
  planet: typeof techPlanets[0]; x: number; y: number; isLocked: boolean;
}) => {
  const neon = shellNeonColors[planet.shell||0];
  if (!x||!y||isNaN(x)||isNaN(y)) return null;
  return createPortal(
    <motion.div initial={{opacity:0,scale:0.85,y:-6}} animate={{opacity:1,scale:1,y:0}}
      exit={{opacity:0,scale:0.85,y:-6}} transition={{duration:0.15}}
      style={{position:'fixed',left:x,top:y,transform:'translateX(-50%)',zIndex:9999,pointerEvents:'none'}}
    >
      <div style={{
        background:'rgba(0,0,0,0.88)',border:`1px solid ${neon}`,borderRadius:8,
        padding:'6px 11px',minWidth:110,position:'relative',
        boxShadow:`0 0 16px ${neon}40`,backdropFilter:'blur(14px)',
      }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{
            position:'absolute',width:4,height:4,
            borderTop:i<2?`1px solid ${neon}`:'none',borderBottom:i>=2?`1px solid ${neon}`:'none',
            borderLeft:i%2===0?`1px solid ${neon}`:'none',borderRight:i%2===1?`1px solid ${neon}`:'none',
            top:i<2?3:'auto',bottom:i>=2?3:'auto',left:i%2===0?3:'auto',right:i%2===1?3:'auto',
          }}/>
        ))}
        <div style={{color:neon,fontFamily:'monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',textShadow:`0 0 6px ${neon}`}}>
          {planet.name}
        </div>
        <div style={{color:'rgba(255,255,255,0.6)',fontFamily:'monospace',fontSize:8,marginTop:2}}>
          {planet.description}
        </div>
        <div style={{color:neon,fontFamily:'monospace',fontSize:7,marginTop:3,opacity:0.5,letterSpacing:1}}>
          {isLocked?'ORBIT LOCKED':'SCANNING...'}
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

// ─── MOBILE: Interactive Constellation Star Map ────────────────────────────────
const MobileConstellationMap = ({ isVisible }: { isVisible: boolean }) => {
  const [selected, setSelected] = useState<number|null>(null);
  const W=360, H=400;

  // Fixed positions — artfully arranged, 3 shells visible
  const starPos: [number,number][] = useMemo(()=>[
    // Shell 0 core triangle
    [180,115],[138,152],[222,152],
    // Shell 1 ring
    [86,88],[274,88],[52,188],[308,188],[75,278],[285,272],
    // Shell 2 outer
    [128,48],[232,48],[180,22],[36,138],[324,138],
    [28,242],[332,242],[180,385],
  ],[]);

  const constellationLines: [number,number][] = useMemo(()=>[
    // Core shell 0
    [0,1],[1,2],[2,0],
    // Shell 1
    [3,0],[4,0],[5,3],[6,4],[7,5],[8,6],[7,1],[8,2],
    // Shell 2
    [9,3],[10,4],[11,9],[11,10],[12,5],[13,6],[14,7],[15,8],[16,7],[16,8],
  ],[]);

  const sel = selected!==null ? techPlanets[selected] : null;
  const selNeon = sel ? shellNeonColors[sel.shell||0] : '#00d4ff';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:0.8}}
          style={{
            position:'fixed',inset:0,zIndex:20,
            display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',
            pointerEvents:'none',
          }}
        >
          {/* Header */}
          <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}
            transition={{delay:0.3,duration:0.6}}
            style={{textAlign:'center',marginBottom:8,pointerEvents:'none'}}
          >
            <div style={{fontFamily:'monospace',fontSize:9,letterSpacing:5,textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:3}}>
              Star Chart · Signal Stack
            </div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.18)',letterSpacing:1}}>
              Tap a star to identify
            </div>
          </motion.div>

          {/* SVG Star Map */}
          <motion.div
            initial={{scale:0.82,opacity:0}} animate={{scale:1,opacity:1}}
            transition={{delay:0.4,duration:0.9,ease:[0.34,1.2,0.64,1]}}
            style={{position:'relative',pointerEvents:'auto'}}
          >
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
              style={{display:'block'}} onClick={()=>setSelected(null)}
            >
              {/* Atlas grid */}
              {[1,2,3,4].map(i=>(
                <line key={`h${i}`} x1={0} y1={i*H/5} x2={W} y2={i*H/5}
                  stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}
              {[1,2,3].map(i=>(
                <line key={`v${i}`} x1={i*W/4} y1={0} x2={i*W/4} y2={H}
                  stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}

              {/* Constellation lines */}
              {constellationLines.map(([a,b],i)=>{
                const pa=starPos[a],pb=starPos[b];
                if(!pa||!pb) return null;
                const neon=shellNeonColors[techPlanets[a]?.shell||0];
                const active=selected===a||selected===b;
                return (
                  <motion.line key={i} x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]}
                    stroke={active?neon:'rgba(255,255,255,0.07)'}
                    strokeWidth={active?1.2:0.5}
                    initial={{pathLength:0,opacity:0}}
                    animate={{pathLength:1,opacity:1}}
                    transition={{delay:0.5+i*0.035,duration:0.9}}
                  />
                );
              })}

              {/* Stars */}
              {techPlanets.map((planet,i)=>{
                const pos=starPos[i];
                if(!pos) return null;
                const neon=shellNeonColors[planet.shell||0];
                const isSel=selected===i;
                const r=planet.shell===0?5.5:planet.shell===1?4.2:3.5;

                return (
                  <g key={planet.name}
                    onClick={e=>{e.stopPropagation();setSelected(isSel?null:i)}}
                    style={{cursor:'pointer'}}
                  >
                    {/* Tap target */}
                    <circle cx={pos[0]} cy={pos[1]} r={22} fill="transparent"/>
                    {/* Ambient glow */}
                    <circle cx={pos[0]} cy={pos[1]} r={isSel?24:14}
                      fill={`${neon}${isSel?'25':'10'}`}
                      style={{transition:'r 0.3s,fill 0.3s'}}
                    />
                    {/* Selection ring */}
                    {isSel&&(
                      <motion.circle cx={pos[0]} cy={pos[1]} r={18}
                        fill="none" stroke={neon} strokeWidth="1" opacity="0.5"
                        initial={{scale:0.4,opacity:0}} animate={{scale:1,opacity:0.5}}
                        transition={{duration:0.35}}
                      />
                    )}
                    {/* Star core */}
                    <circle cx={pos[0]} cy={pos[1]} r={isSel?r*1.75:r}
                      fill={isSel?neon:`${neon}cc`}
                      stroke={isSel?'rgba(255,255,255,0.8)':'none'}
                      strokeWidth={isSel?0.8:0}
                      style={{
                        filter:`drop-shadow(0 0 ${isSel?9:3}px ${neon})`,
                        transition:'r 0.25s,filter 0.25s',
                      }}
                    />
                    {/* Cross-hairs when selected */}
                    {isSel&&(
                      <>
                        <line x1={pos[0]-16} y1={pos[1]} x2={pos[0]-r*1.75-3} y2={pos[1]} stroke={neon} strokeWidth="0.7" opacity="0.5"/>
                        <line x1={pos[0]+r*1.75+3} y1={pos[1]} x2={pos[0]+16} y2={pos[1]} stroke={neon} strokeWidth="0.7" opacity="0.5"/>
                        <line x1={pos[0]} y1={pos[1]-16} x2={pos[0]} y2={pos[1]-r*1.75-3} stroke={neon} strokeWidth="0.7" opacity="0.5"/>
                        <line x1={pos[0]} y1={pos[1]+r*1.75+3} x2={pos[0]} y2={pos[1]+16} stroke={neon} strokeWidth="0.7" opacity="0.5"/>
                      </>
                    )}
                    {/* Symbol */}
                    <text x={pos[0]} y={pos[1]+0.5} textAnchor="middle" dominantBaseline="middle"
                      fontSize={isSel?11:7} style={{userSelect:'none',pointerEvents:'none',
                      filter:`drop-shadow(0 0 2px ${neon})`}}>
                      {planet.symbol}
                    </text>
                    {/* Name label */}
                    <text x={pos[0]} y={pos[1]+(isSel?r*1.75:r)+11}
                      textAnchor="middle" fontSize={isSel?9.5:7}
                      fill={isSel?neon:'rgba(255,255,255,0.35)'}
                      fontFamily="monospace" fontWeight={isSel?700:400}
                      style={{userSelect:'none',pointerEvents:'none',
                        filter:isSel?`drop-shadow(0 0 4px ${neon})`:'none',
                        transition:'font-size 0.2s,fill 0.2s'}}>
                      {planet.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Info card */}
            <AnimatePresence>
              {sel&&(
                <motion.div key={sel.name}
                  initial={{opacity:0,y:8,scale:0.93}} animate={{opacity:1,y:0,scale:1}}
                  exit={{opacity:0,y:5,scale:0.96}} transition={{duration:0.22}}
                  style={{
                    position:'absolute',bottom:-90,left:'50%',transform:'translateX(-50%)',
                    width:260,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(18px)',
                    border:`1px solid ${selNeon}50`,borderRadius:12,padding:'10px 16px',
                    pointerEvents:'none',boxShadow:`0 0 22px ${selNeon}20`,
                  }}
                >
                  {[0,1,2,3].map(i=>(
                    <div key={i} style={{
                      position:'absolute',width:4,height:4,
                      borderTop:i<2?`1px solid ${selNeon}`:'none',borderBottom:i>=2?`1px solid ${selNeon}`:'none',
                      borderLeft:i%2===0?`1px solid ${selNeon}`:'none',borderRight:i%2===1?`1px solid ${selNeon}`:'none',
                      top:i<2?5:'auto',bottom:i>=2?5:'auto',left:i%2===0?5:'auto',right:i%2===1?5:'auto',
                    }}/>
                  ))}
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:15}}>{sel.symbol}</span>
                    <span style={{fontFamily:'monospace',fontSize:11,fontWeight:700,letterSpacing:2,color:selNeon,textShadow:`0 0 8px ${selNeon}`}}>
                      {sel.name}
                    </span>
                    <div style={{marginLeft:'auto',width:5,height:5,borderRadius:'50%',background:selNeon,boxShadow:`0 0 6px ${selNeon}`}}/>
                  </div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.55)',letterSpacing:0.5}}>
                    {sel.description}
                  </div>
                  <div style={{marginTop:5,fontFamily:'monospace',fontSize:7,color:`${selNeon}70`,letterSpacing:1,textTransform:'uppercase'}}>
                    {['Core Stack','Infrastructure','Specialized'][sel.shell||0]} · Shell {(sel.shell||0)+1}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Shell legend */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            transition={{delay:0.9,duration:0.5}}
            style={{display:'flex',gap:14,marginTop:sel?104:20,
              pointerEvents:'none',transition:'margin-top 0.3s ease'}}
          >
            {['Core','Infra','Special'].map((label,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                <div style={{width:5,height:5,borderRadius:'50%',
                  background:shellNeonColors[i],boxShadow:`0 0 5px ${shellNeonColors[i]}`}}/>
                <span style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.3)',letterSpacing:1,textTransform:'uppercase'}}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── ATMOSPHERE ────────────────────────────────────────────────────────────────
// Orbit rendering is fully canvas-based — NO setAngle React state per frame.
// This eliminates the jank entirely.
export const Atmosphere = ({ onPhysicsUpdate }: AtmosphereProps) => {
  const skyDivRef      = useRef<HTMLDivElement>(null);
  const bgCanvasRef    = useRef<HTMLCanvasElement>(null);
  const orbitCanvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions,   setDimensions]       = useState({ width: 0, height: 0 });
  const [planetsVisible, setPlanetsVisibleState] = useState(false);
  const [planetsActive,  setPlanetsActive]   = useState(false);
  const [isMobile,     setIsMobile]          = useState(false);
  const [altitudeState,setAltitudeState]     = useState(90);

  // Hover/lock in refs — never cause re-renders inside animation loop
  const hoveredIdxRef = useRef(-1);
  const lockedIdxRef  = useRef(-1);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [lockedIdx,  setLockedIdx]  = useState(-1);

  // Orbit angles — Float64Array, never React state
  const anglesRef = useRef<Float64Array>(
    new Float64Array(techPlanets.map(p=>(p.initialAngle||0)*Math.PI/180))
  );

  // Entry state per planet: 0=hidden,1=entering,2=orbiting,3=exiting
  const entryStateRef    = useRef<Int8Array>(new Int8Array(techPlanets.length).fill(0));
  const entryProgressRef = useRef<Float32Array>(new Float32Array(techPlanets.length).fill(0));
  const entryOriginsRef  = useRef<{x:number,y:number}[]>([]);
  const exitTargetsRef   = useRef<{x:number,y:number}[]>([]);

  // Current screen positions for hit-testing
  const positionsRef = useRef<{x:number,y:number,size:number}[]>(
    techPlanets.map(()=>({x:-9999,y:-9999,size:24}))
  );

  const targetAltRef  = useRef(90);
  const currentAltRef = useRef(90);
  const activeRef     = useRef(false);
  const rafAltRef     = useRef(0);

  // Mutable refs that the orbit loop reads without closures
  const sunXRef    = useRef(0);
  const sunYRef    = useRef(0);
  const dimRef     = useRef(dimensions);
  const physicsRef = useRef<any>(null);

  useEffect(()=>{dimRef.current=dimensions;},[dimensions]);

  // ── Mobile ──
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check(); window.addEventListener('resize',check);
    return ()=>window.removeEventListener('resize',check);
  },[]);

  // ── Resize ──
  useEffect(()=>{
    const upd=()=>setDimensions({width:window.innerWidth,height:window.innerHeight});
    upd(); window.addEventListener('resize',upd);
    return ()=>window.removeEventListener('resize',upd);
  },[]);

  // ── Visibility ──
  useEffect(()=>{
    const u=subscribeToVisibility(setPlanetsVisibleState);
    return ()=>{u?.();};
  },[]);

  // ── Scroll → altitude smooth loop (no React setState per frame) ──
  useEffect(()=>{
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      targetAltRef.current=progressToAltitude(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0);
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();

    const loop=()=>{
      const diff=targetAltRef.current-currentAltRef.current;
      if(Math.abs(diff)>0.02){
        currentAltRef.current+=diff*0.06;
        const alt=Math.max(-25,Math.min(90,currentAltRef.current));
        setAltitudeState(alt);
        if(skyDivRef.current){
          const {cs,rgb}=computeSkyColors(alt);
          skyDivRef.current.style.background=
            `linear-gradient(to bottom,${rgb(cs.st)} 0%,${rgb(cs.sb)} 52%,${rgb(cs.hz)} 100%)`;
        }
      }
      rafAltRef.current=requestAnimationFrame(loop);
    };
    rafAltRef.current=requestAnimationFrame(loop);
    return ()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(rafAltRef.current);};
  },[]);

  // ── Sun position & active state ──
  const sunX=dimensions.width*0.7;
  const sunY=dimensions.height>0
    ? Math.max(50,Math.min(dimensions.height-50,dimensions.height*0.1+((90-altitudeState)/110)*dimensions.height*0.8))
    : 0;
  useEffect(()=>{sunXRef.current=sunX;sunYRef.current=sunY;},[sunX,sunY]);

  useEffect(()=>{
    const active=altitudeState>-20&&dimensions.width>0&&planetsVisible;
    setPlanetsActive(active);
    activeRef.current=active;
  },[altitudeState,dimensions.width,planetsVisible]);

  // ── Initialise entry/exit origins ──
  useEffect(()=>{
    if(!dimensions.width) return;
    const {width:vw,height:vh}=dimensions;
    entryOriginsRef.current=techPlanets.map((_,i)=>{
      const angle=seededRandom(i*3.7)*Math.PI*2;
      const dist=Math.max(vw,vh)*(1.2+seededRandom(i*1.3)*0.8);
      return {x:vw*0.5+Math.cos(angle)*dist,y:vh*0.5+Math.sin(angle)*dist};
    });
    // Exit targets computed at exit time from current pos, just pre-fill defaults
    exitTargetsRef.current=techPlanets.map((_,i)=>{
      const seed=i*7.7+99;
      const angle=seededRandom(seed)*Math.PI*2;
      const dist=Math.max(vw,vh)*(1.4+seededRandom(seed+1)*0.4);
      return {x:vw*0.5+Math.cos(angle)*dist,y:vh*0.5+Math.sin(angle)*dist};
    });
  },[dimensions]);

  // ── Physics (React state, for external consumers) ──
  const physics=useMemo(()=>{
    const alt=Math.max(-25,Math.min(90,altitudeState));
    const safeAlt=Math.max(0.5,Math.abs(alt));
    const rad=(safeAlt*Math.PI)/180;
    const pathLength=Math.min(1/Math.sin(rad),50);
    const scatteringStrength=Math.min((pathLength-1)*1.5,12);
    const {cs,rgb}=computeSkyColors(alt);
    const phaseKey=getPhaseLabel(alt);
    return {
      altitude:alt,pathLength,scatteringStrength,
      skyTop:rgb(cs.st),skyBottom:rgb(cs.sb),
      sunColor:rgb(cs.su),glowColor:rgb(cs.gl),horizonColor:rgb(cs.hz),
      starsOpacity:Math.max(0,Math.min(1,cs.so)),
      isNight:alt<-5,sunX,sunY,timeOfDay:phaseKey,
      currentState:{phase:SKY_STATES[phaseKey].phase},
      blueSurvival:Math.max(0,Math.min(100,100-scatteringStrength*8)),
    };
  },[altitudeState,sunX,sunY]);

  useEffect(()=>{
    physicsRef.current=physics;
    onPhysicsUpdate?.(physics);
    window.dispatchEvent(new CustomEvent('atmosphere-physics-update',{detail:physics}));
  },[physics,onPhysicsUpdate]);

  // ── Background canvas: sky fx, stars, sun ──
  const [particles]=useState(()=>
    Array.from({length:55},(_,i)=>({
      x:20+Math.random()*60,y:10+Math.random()*70,
      size:1+Math.random()*2,speed:0.3+Math.random()*0.5,phase:Math.random()*Math.PI*2,
    }))
  );

  useEffect(()=>{
    const canvas=bgCanvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    if(!ctx) return;
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize();
    window.addEventListener('resize',resize);
    let animId:number,time=0;

    const draw=()=>{
      const {width,height}=canvas;
      const p=physicsRef.current||physics;
      if(!width||!height){animId=requestAnimationFrame(draw);return;}
      ctx.clearRect(0,0,width,height);
      time+=0.016;

      if(p.starsOpacity>0){
        for(let i=0;i<60;i++){
          const sx=((i*137.5)%width+width)%width;
          const sy=((i*71.3)%(height*0.7)+height*0.7)%(height*0.7);
          const tw=Math.sin(time+i)*0.5+0.5;
          ctx.beginPath();ctx.arc(sx,sy,1+tw*1.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${p.starsOpacity*0.85*tw})`;ctx.fill();
        }
      }

      const sx=sunXRef.current,sy=sunYRef.current;
      const ox=width*0.5,oy=height*0.95;
      const bw=Math.min(40+p.scatteringStrength*5,160);
      const bg=ctx.createLinearGradient(sx,sy,ox,oy);
      bg.addColorStop(0,p.sunColor.replace(')',`,${p.isNight?0.1:0.28})`));
      bg.addColorStop(0.5,p.glowColor.replace(')',`,${Math.max(0,0.18-p.scatteringStrength*0.01)})`));
      bg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.moveTo(sx-bw/2,sy);ctx.lineTo(sx+bw/2,sy);
      ctx.lineTo(ox+bw,oy);ctx.lineTo(ox-bw,oy);ctx.closePath();
      ctx.fillStyle=bg;ctx.fill();

      particles.forEach(pt=>{
        const px2=((pt.x/100)*width+width)%width;
        const py2=((pt.y/100)*height+height)%height;
        const ph=(time*pt.speed+pt.phase)%(Math.PI*2);
        ctx.beginPath();ctx.arc(px2,py2,pt.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(100,200,255,${0.05+Math.sin(ph)*0.04})`;ctx.fill();
      });

      const sr=Math.min(30+p.scatteringStrength*2,80);
      const pulse=Math.sin(time*1.8)*0.07+0.93;
      const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sr*2.5);
      sg.addColorStop(0,p.sunColor);
      sg.addColorStop(0.25,p.sunColor.replace(')',',0.7)'));
      sg.addColorStop(0.6,p.glowColor.replace(')',',0.25)'));
      sg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(sx,sy,sr*2.5*pulse,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
      ctx.beginPath();ctx.arc(sx,sy,13,0,Math.PI*2);ctx.fillStyle=p.sunColor;ctx.fill();

      animId=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(animId);};
  },[particles]); // physicsRef is a ref — updates happen without re-running effect

  // ── Orbit canvas — THE MAIN FIX: pure canvas, no React state per frame ──
  useEffect(()=>{
    if(isMobile) return;
    const canvas=orbitCanvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx) return;
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize();
    window.addEventListener('resize',resize);

    let animId:number;
    let last=performance.now();
    let wasActive=false;
    const staggerTimers:ReturnType<typeof setTimeout>[]=[];

    const ENTRY_SPEED=0.65;
    const EXIT_SPEED=1.3;

    const startEntry=(idx:number)=>{
      if(entryStateRef.current[idx]!==0) return;
      const jitter=seededRandom(idx*4.2)*300;
      const delay=idx*100+jitter+250;
      staggerTimers.push(setTimeout(()=>{
        entryStateRef.current[idx]=1;
        entryProgressRef.current[idx]=0;
      },delay));
    };

    const startExit=(idx:number)=>{
      if(entryStateRef.current[idx]===0) return;
      entryStateRef.current[idx]=3;
      const pos=positionsRef.current[idx];
      const seed=idx*7.7+99;
      const angle=seededRandom(seed)*Math.PI*2;
      const {width:vw,height:vh}=dimRef.current;
      const dist=Math.max(vw,vh)*(1.4+seededRandom(seed+1)*0.4);
      exitTargetsRef.current[idx]={x:pos.x+Math.cos(angle)*dist,y:pos.y+Math.sin(angle)*dist};
    };

    const draw=(now:number)=>{
      // Cap delta to prevent huge jumps on tab switch
      const delta=Math.min((now-last)/1000,0.05);
      last=now;

      const {width,height}=canvas;
      if(!width||!height){animId=requestAnimationFrame(draw);return;}

      const isActive=activeRef.current;
      const sx=sunXRef.current,sy=sunYRef.current;
      const hov=hoveredIdxRef.current,lock=lockedIdxRef.current;

      // Transitions
      if(isActive&&!wasActive){
        entryStateRef.current.fill(0);
        entryProgressRef.current.fill(0);
        techPlanets.forEach((_,i)=>startEntry(i));
      }
      if(!isActive&&wasActive){
        staggerTimers.forEach(t=>clearTimeout(t));
        techPlanets.forEach((_,i)=>startExit(i));
      }
      wasActive=isActive;

      ctx.clearRect(0,0,width,height);

      // Orbital rings
      if(isActive){
        planetShells.forEach((shell,si)=>{
          const px=width*shell.radius;
          const neon=shellNeonColors[si];
          const highlight=(hov>=0&&techPlanets[hov]?.shell===si)||(lock>=0&&techPlanets[lock]?.shell===si);
          ctx.beginPath();
          ctx.ellipse(sx,sy,px,px*0.5,0,0,Math.PI*2);
          ctx.strokeStyle=highlight?`${neon}65`:`${neon}18`;
          ctx.lineWidth=highlight?1.2:0.6;
          ctx.stroke();
        });
      }

      // Planets
      techPlanets.forEach((planet,i)=>{
        const shell=planetShells[planet.shell||0];
        const neon=shellNeonColors[planet.shell||0];
        const state=entryStateRef.current[i];
        let prog=entryProgressRef.current[i];

        if(state===0) return;

        // Advance orbit angle regardless of entry/exit state (keeps continuity)
        const slow=(hov>=0&&hov!==i)||(lock>=0&&lock!==i&&state===2);
        anglesRef.current[i]+=(slow?shell.speed*0.04:shell.speed)*delta;

        const angle=anglesRef.current[i];
        const pixR=width*shell.radius;
        const orbitX=sx+Math.cos(angle)*pixR;
        const orbitY=sy+Math.sin(angle)*pixR*0.5;

        let drawX=orbitX,drawY=orbitY,alpha=1,scl=1;

        if(state===1){
          // Entering
          prog=Math.min(1,prog+ENTRY_SPEED*delta);
          entryProgressRef.current[i]=prog;
          const t=Math.max(0,Math.min(1,easeOutBack(prog)));
          const origin=entryOriginsRef.current[i]||{x:orbitX,y:orbitY};
          drawX=origin.x+(orbitX-origin.x)*t;
          drawY=origin.y+(orbitY-origin.y)*t;
          alpha=Math.min(1,prog*2.5);
          scl=0.15+t*0.85;
          if(prog>=1) entryStateRef.current[i]=2;
        } else if(state===3){
          // Exiting
          prog=Math.min(1,prog+EXIT_SPEED*delta);
          entryProgressRef.current[i]=prog;
          const t=easeInCubic(prog);
          const target=exitTargetsRef.current[i]||{x:orbitX,y:orbitY};
          drawX=orbitX+(target.x-orbitX)*t;
          drawY=orbitY+(target.y-orbitY)*t;
          alpha=1-prog;
          scl=1-prog*0.9;
          if(prog>=1) entryStateRef.current[i]=0;
        }

        const size=planet.size||24;
        positionsRef.current[i]={x:drawX,y:drawY,size};

        const inFront=Math.sin(angle)>0;
        const isActive2=(i===hov||i===lock);
        const depthScale=isActive2?1.75:(inFront?1.1:0.72);
        const dimmed=(hov>=0&&!isActive2)||(lock>=0&&!isActive2&&state===2);
        const bright=inFront?1:0.5;

        ctx.save();
        ctx.translate(drawX,drawY);
        ctx.scale(scl,scl);
        ctx.globalAlpha=alpha*(dimmed?0.15:1)*bright;

        // Glow halo
        const grd=ctx.createRadialGradient(0,0,0,0,0,size*1.8);
        grd.addColorStop(0,`${neon}28`);grd.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(0,0,size*1.8,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();

        // Orbit ring around planet
        ctx.beginPath();ctx.arc(0,0,size/2+2.5,0,Math.PI*2);
        ctx.strokeStyle=neon;
        ctx.lineWidth=isActive2?1.8:0.8;
        ctx.shadowColor=neon;ctx.shadowBlur=isActive2?14:4;
        ctx.stroke();ctx.shadowBlur=0;

        // Planet sphere
        const sphere=ctx.createRadialGradient(-size*0.12,-size*0.12,0,0,0,size/2);
        sphere.addColorStop(0,planet.color+'ff');
        sphere.addColorStop(0.55,planet.color+'bb');
        sphere.addColorStop(1,planet.color+'25');
        ctx.beginPath();ctx.arc(0,0,size/2,0,Math.PI*2);
        ctx.fillStyle=sphere;ctx.fill();

        // Symbol
        ctx.globalAlpha=alpha*(dimmed?0.15:1);
        ctx.font=`${Math.round(size*0.42)}px serif`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.shadowColor=neon;ctx.shadowBlur=3;
        ctx.fillText(planet.symbol,0,1);ctx.shadowBlur=0;

        // Name label — always visible
        const labelAlpha=dimmed?0.04:(isActive2?1.0:0.82);
        ctx.globalAlpha=alpha*labelAlpha;
        ctx.font=`bold ${Math.max(7,Math.round(size*0.3))}px monospace`;
        ctx.textAlign='center';ctx.textBaseline='top';
        ctx.shadowColor='rgba(0,0,0,0.95)';ctx.shadowBlur=7;
        ctx.fillStyle=isActive2?neon:'rgba(255,255,255,0.92)';
        if(isActive2){ctx.shadowColor=neon;ctx.shadowBlur=10;}
        ctx.fillText(planet.name,0,size/2+5);
        ctx.shadowBlur=0;

        ctx.restore();
      });

      animId=requestAnimationFrame(draw);
    };

    animId=requestAnimationFrame(draw);
    return ()=>{
      window.removeEventListener('resize',resize);
      cancelAnimationFrame(animId);
      staggerTimers.forEach(t=>clearTimeout(t));
    };
  },[isMobile]); // intentionally stable — reads everything via refs

  // ── Hit testing ──
  const handleMouseMove=useCallback((e:React.MouseEvent)=>{
    const canvas=orbitCanvasRef.current;
    if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    let found=-1;
    for(let i=0;i<positionsRef.current.length;i++){
      const {x,y,size}=positionsRef.current[i];
      const dx=mx-x,dy=my-y;
      if(dx*dx+dy*dy<(size*1.3)*(size*1.3)){found=i;break;}
    }
    if(found!==hoveredIdxRef.current){
      hoveredIdxRef.current=found;
      setHoveredIdx(found);
    }
  },[]);

  const handleClick=useCallback(()=>{
    const found=hoveredIdxRef.current;
    if(found<0){lockedIdxRef.current=-1;setLockedIdx(-1);return;}
    if(lockedIdxRef.current===found){lockedIdxRef.current=-1;setLockedIdx(-1);}
    else{lockedIdxRef.current=found;setLockedIdx(found);}
  },[]);

  const handleLeave=useCallback(()=>{
    hoveredIdxRef.current=-1;setHoveredIdx(-1);
  },[]);

  const {cs:initCs,rgb:initRgb}=computeSkyColors(90);

  // Tooltip
  const tooltipIdx   = hoveredIdx>=0?hoveredIdx:lockedIdx;
  const tooltipPlanet= tooltipIdx>=0?techPlanets[tooltipIdx]:null;
  const tooltipPos   = tooltipPlanet?positionsRef.current[tooltipIdx]:null;

  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
      {/* Sky gradient */}
      <div ref={skyDivRef} style={{
        position:'absolute',inset:0,
        background:`linear-gradient(to bottom,${initRgb(initCs.st)} 0%,${initRgb(initCs.sb)} 52%,${initRgb(initCs.hz)} 100%)`,
      }}/>

      {/* Background FX canvas */}
      <canvas ref={bgCanvasRef} style={{position:'absolute',inset:0}}/>

      {/* Orbit canvas (desktop) */}
      {!isMobile&&(
        <canvas ref={orbitCanvasRef}
          style={{
            position:'absolute',inset:0,
            pointerEvents:planetsActive?'auto':'none',
            cursor:hoveredIdx>=0?'pointer':'default',
          }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={handleLeave}
        />
      )}

      {/* Tooltip */}
      {!isMobile&&tooltipPlanet&&tooltipPos&&(
        <AnimatePresence>
          <PlanetTooltip key={tooltipPlanet.name} planet={tooltipPlanet}
            x={tooltipPos.x}
            y={tooltipPos.y+(tooltipPlanet.size||24)/2+26}
            isLocked={lockedIdx===tooltipIdx}
          />
        </AnimatePresence>
      )}

      {/* Mobile constellation map */}
      {isMobile&&<MobileConstellationMap isVisible={planetsActive}/>}

      {/* Debug */}
      <div style={{position:'fixed',bottom:14,left:14,fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.18)',pointerEvents:'none',zIndex:999}}>
        {altitudeState.toFixed(1)}° · {getPhaseLabel(altitudeState)}
      </div>
    </div>
  );
};