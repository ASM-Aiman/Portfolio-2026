import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const interests = [
  {
    name: 'Artificial Intelligence',
    latin: 'Intelligentia Artificialis',
    level: 45,
    symbol: '☿',
    rune: 'ᚨ',
    color: '#c5a059',
    dimColor: '#8a6d3b',
    desc: 'Neural networks & intelligent systems',
    detail: 'Deep learning architectures, LLM fine-tuning, computer vision and the pursuit of machine reasoning that mirrors the cosmos.',
  },
  {
    name: 'WebGL & 3D Craft',
    latin: 'Ars Dimensionalis',
    level: 88,
    symbol: '♆',
    rune: 'ᚱ',
    color: '#a78bfa',
    dimColor: '#6d5fa8',
    desc: 'Immersive browser experiences',
    detail: 'Shader programming, three-dimensional worlds rendered in the browser, where geometry becomes narrative.',
  },
  {
    name: 'Systems Architecture',
    latin: 'Machina Profunda',
    level: 75,
    symbol: '♄',
    rune: 'ᛏ',
    color: '#e3d5c5',
    dimColor: '#9a8f82',
    desc: 'High-performance computing',
    detail: 'Memory-safe systems programming, zero-cost abstractions, and the discipline of writing code that endures through ages.',
  },
  {
    name: 'Linix and CLI Tools',
    latin: 'Terminus Magistralis',
    level: 70,
    symbol: '⊕',
    rune: 'ᛜ',
    color: '#34d399',
    dimColor: '#22846a',
    desc: 'Command-line mastery',
    detail: 'Crafting efficient CLI tools, shell scripting, and the art of bending the terminal to my will.',
  },
  {
    name: 'WSO2 and API Management',
    latin: 'Nexus Interfacium',
    level: 82,
    symbol: '✦',
    rune: 'ᛊ',
    color: '#f97316',
    dimColor: '#a34f0f',
    desc: 'API ecosystems and integration',
    detail: 'Designing robust API architectures, microservices orchestration, and enabling seamless connectivity in the digital ecosystem.',
  },
];

// Zodiac-style tick marks around the outer ring
const ZodiacTicks = ({ cx, cy, outerR }: { cx: number; cy: number; outerR: number }) => {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = (i * 360) / 72;
    const rad = (deg * Math.PI) / 180;
    const isMajor = i % 6 === 0;    // every 30° = zodiac house boundary
    const isMid   = i % 3 === 0;
    const len = isMajor ? 14 : isMid ? 8 : 5;
    const r1 = outerR - len;
    const r2 = outerR;
    return {
      x1: cx + r1 * Math.cos(rad - Math.PI / 2),
      y1: cy + r1 * Math.sin(rad - Math.PI / 2),
      x2: cx + r2 * Math.cos(rad - Math.PI / 2),
      y2: cy + r2 * Math.sin(rad - Math.PI / 2),
      isMajor, isMid,
    };
  });

  return (
    <g>
      {ticks.map((t, i) => (
        <line key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isMajor ? 'rgba(197,160,89,0.7)' : t.isMid ? 'rgba(197,160,89,0.35)' : 'rgba(197,160,89,0.15)'}
          strokeWidth={t.isMajor ? 1.5 : 0.8}
        />
      ))}
    </g>
  );
};

// House number labels (I–XII) around the outer ring
const HouseLabels = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
  const numerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  return (
    <g>
      {numerals.map((n, i) => {
        const deg = i * 30 - 90;
        const rad = (deg * Math.PI) / 180;
        return (
          <text key={i}
            x={cx + r * Math.cos(rad)}
            y={cy + r * Math.sin(rad)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="rgba(197,160,89,0.55)"
            fontFamily="'Cinzel', serif" letterSpacing="0.05em"
          >{n}</text>
        );
      })}
    </g>
  );
};

// A single pie-segment path
const segmentPath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const s = toRad(startDeg - 90);
  const e = toRad(endDeg - 90);
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
};

// Arc only (no centre lines) for the mastery fill ring
const arcPath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const s = toRad(startDeg - 90);
  const e = toRad(endDeg - 90);
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

export const CurrentInterests = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [active, setActive] = useState<number | null>(null);

  // Wheel geometry
  const SIZE   = 520;
  const CX     = SIZE / 2;
  const CY     = SIZE / 2;
  const OUTER  = 230;   // tick ring
  const SEG_R  = 210;   // segment fill radius
  const HOUSE_R = OUTER - 22; // house numeral placement
  const FILL_R  = 170;  // mastery arc ring outer edge
  const FILL_W  = 22;   // mastery ring thickness
  const INNER_R = FILL_R - FILL_W; // inner edge of mastery ring
  const CORE_R  = 58;   // centre disc

  const segCount  = interests.length;
  const segAngle  = 360 / segCount;
  const GAP       = 2;  // gap between segments in degrees

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(197,160,89,0.05) 0%, transparent 65%)',
      }} />

      {/* Faint stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden style={{ opacity: 0.18 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i}
            cx={`${((i * 137.508) % 100).toFixed(1)}%`}
            cy={`${((i * 97.3) % 100).toFixed(1)}%`}
            r={i % 7 === 0 ? 1.5 : 0.8} fill="#e3d5c5"
            opacity={(0.15 + (i % 4) * 0.12).toFixed(2)}
          />
        ))}
      </svg>

      <div className="max-w-5xl mx-auto px-6 relative">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            color: '#e3d5c5',
            letterSpacing: '0.08em',
            lineHeight: 1.15,
            marginBottom: 12,
          }}>
            Current{' '}
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(90deg, #c5a059 0%, #e3d5c5 50%, #c5a059 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 16px rgba(197,160,89,0.5))',
            }}>Pursuits</em>
          </h2>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            color: 'rgba(197,160,89,0.85)',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
          }}>
            Artes in quibus assidue versor
          </p>

          {/* Ornamental rule */}
          <div className="flex items-center gap-3 mt-5 max-w-xs mx-auto">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.45))' }} />
            <span style={{ color: 'rgba(197,160,89,0.7)', fontSize: 13 }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(197,160,89,0.45))' }} />
          </div>
        </motion.div>

        {/* ── Zodiac Wheel + Detail Card layout ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

          {/* ── THE WHEEL ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -20 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0 }}
          >
            {/* Slow ambient rotation wrapper */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
              style={{ width: SIZE, height: SIZE, position: 'relative' }}
            >
              <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: 'absolute', inset: 0 }}>
                {/* Outermost tick ring */}
                <circle cx={CX} cy={CY} r={OUTER} fill="none" stroke="rgba(197,160,89,0.2)" strokeWidth={1} />
                <ZodiacTicks cx={CX} cy={CY} outerR={OUTER} />
                <HouseLabels cx={CX} cy={CY} r={HOUSE_R} />

                {/* Segment fills + mastery arcs */}
                {interests.map((item, i) => {
                  const startDeg = i * segAngle + GAP / 2;
                  const endDeg   = (i + 1) * segAngle - GAP / 2;
                  const midDeg   = (startDeg + endDeg) / 2;
                  const midRad   = ((midDeg - 90) * Math.PI) / 180;

                  // Mastery arc sweep
                  const masterySpan  = (endDeg - startDeg) * (item.level / 100);
                  const masteryStart = startDeg;
                  const masteryEnd   = startDeg + masterySpan;

                  // Symbol position
                  const symR   = (INNER_R + CORE_R) / 2 + 18;
                  const symX   = CX + symR * Math.cos(midRad);
                  const symY   = CY + symR * Math.sin(midRad);

                  // Rune position (slightly further out)
                  const runeR  = FILL_R + 28;
                  const runeX  = CX + runeR * Math.cos(midRad);
                  const runeY  = CY + runeR * Math.sin(midRad);

                  const isSelected = active === i;

                  return (
                    <g key={item.name}>
                      {/* Dim background segment */}
                      <path
                        d={segmentPath(CX, CY, SEG_R, startDeg, endDeg)}
                        fill={isSelected ? `${item.color}18` : `${item.color}06`}
                        stroke={isSelected ? `${item.color}70` : `${item.color}25`}
                        strokeWidth={isSelected ? 1.5 : 0.8}
                        style={{ cursor: 'pointer', transition: 'all 0.35s ease' }}
                      />

                      {/* Mastery fill ring — animated stroke */}
                      {/* Track arc */}
                      <path
                        d={arcPath(CX, CY, FILL_R - FILL_W / 2, startDeg + 1, endDeg - 1)}
                        fill="none"
                        stroke={`${item.dimColor}45`}
                        strokeWidth={FILL_W}
                        strokeLinecap="butt"
                      />
                      {/* Filled mastery arc */}
                      <motion.path
                        d={arcPath(CX, CY, FILL_R - FILL_W / 2, masteryStart + 1, masteryEnd - 1 > masteryStart + 1 ? masteryEnd - 1 : masteryStart + 1.1)}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={FILL_W}
                        strokeLinecap="butt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isInView ? 1 : 0 }}
                        transition={{ duration: 1.2, delay: i * 0.15 + 0.4 }}
                        style={{ filter: `drop-shadow(0 0 6px ${item.color}80)` }}
                      />

                      {/* Symbol in inner ring */}
                      <text
                        x={symX} y={symY}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={22}
                        fill={isSelected ? item.color : `${item.color}bb`}
                        style={{
                          cursor: 'pointer',
                          filter: isSelected ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                          transition: 'all 0.35s ease',
                          fontFamily: 'serif',
                        }}
                      >{item.symbol}</text>

                      {/* Rune in outer ring */}
                      <text
                        x={runeX} y={runeY}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={13}
                        fill={isSelected ? `${item.color}ee` : `${item.color}60`}
                        style={{ fontFamily: 'serif', transition: 'all 0.35s ease', pointerEvents: 'none' }}
                      >{item.rune}</text>

                      {/* Invisible hit area */}
                      <path
                        d={segmentPath(CX, CY, SEG_R, startDeg, endDeg)}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActive(active === i ? null : i)}
                        onMouseEnter={() => setActive(i)}
                      />
                    </g>
                  );
                })}

                {/* Inner concentric rings */}
                <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(197,160,89,0.18)" strokeWidth={0.8} />
                <circle cx={CX} cy={CY} r={CORE_R + 12} fill="none" stroke="rgba(197,160,89,0.12)" strokeWidth={0.6} strokeDasharray="3 4" />

                {/* Spoke lines between segments */}
                {interests.map((_, i) => {
                  const deg = i * segAngle - 90;
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line key={i}
                      x1={CX + CORE_R * Math.cos(rad)} y1={CY + CORE_R * Math.sin(rad)}
                      x2={CX + SEG_R  * Math.cos(rad)} y2={CY + SEG_R  * Math.sin(rad)}
                      stroke="rgba(197,160,89,0.15)" strokeWidth={0.8}
                    />
                  );
                })}

                {/* Centre disc */}
                <circle cx={CX} cy={CY} r={CORE_R}
                  fill="rgba(10,12,16,0.92)"
                  stroke="rgba(197,160,89,0.35)" strokeWidth={1.2}
                />
                <circle cx={CX} cy={CY} r={CORE_R - 8}
                  fill="none" stroke="rgba(197,160,89,0.12)" strokeWidth={0.6} strokeDasharray="2 3"
                />
              </svg>
            </motion.div>

            {/* Centre disc content — COUNTER-rotates so text stays upright */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: CORE_R * 2 - 16,
              height: CORE_R * 2 - 16,
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
              textAlign: 'center',
            }}>
              {/* This div counter-rotates relative to the wheel */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
              >
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 11,
                  color: 'rgba(197,160,89,0.7)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                }}>Orbis</span>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 11,
                  color: 'rgba(197,160,89,0.7)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>Artium</span>
                <span style={{ fontSize: 18, color: 'rgba(197,160,89,0.5)', marginTop: 2 }}>✦</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Detail card ── */}
          <div style={{ minWidth: 280, maxWidth: 360, width: '100%' }}>
            <AnimatePresence mode="wait">
              {active !== null ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    background: 'rgba(10,12,16,0.90)',
                    border: `1.5px solid ${interests[active].color}60`,
                    boxShadow: `0 0 40px ${interests[active].color}20, inset 0 0 30px ${interests[active].color}06`,
                    borderRadius: 4,
                    padding: '32px 28px',
                    backdropFilter: 'blur(16px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner accents */}
                  {[
                    { top: 0, left: 0, borderTop: `1.5px solid ${interests[active].color}`, borderLeft: `1.5px solid ${interests[active].color}` },
                    { top: 0, right: 0, borderTop: `1.5px solid ${interests[active].color}`, borderRight: `1.5px solid ${interests[active].color}` },
                    { bottom: 0, left: 0, borderBottom: `1.5px solid ${interests[active].color}`, borderLeft: `1.5px solid ${interests[active].color}` },
                    { bottom: 0, right: 0, borderBottom: `1.5px solid ${interests[active].color}`, borderRight: `1.5px solid ${interests[active].color}` },
                  ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...s }} />)}

                  {/* Scan line */}
                  <motion.div
                    style={{
                      position: 'absolute', left: 0, right: 0, height: 1,
                      background: `linear-gradient(90deg, transparent, ${interests[active].color}60, transparent)`,
                      opacity: 0.6,
                    }}
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Symbol */}
                  <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 12, lineHeight: 1, filter: `drop-shadow(0 0 16px ${interests[active].color})` }}>
                    {interests[active].symbol}
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 22,
                    color: interests[active].color,
                    textAlign: 'center',
                    letterSpacing: '0.06em',
                    textShadow: `0 0 20px ${interests[active].color}60`,
                    marginBottom: 4,
                  }}>
                    {interests[active].name}
                  </h3>

                  {/* Latin */}
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    fontStyle: 'italic',
                    color: 'rgba(197,160,89,0.85)',
                    textAlign: 'center',
                    letterSpacing: '0.12em',
                    marginBottom: 20,
                  }}>
                    {interests[active].latin}
                  </p>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${interests[active].color}50)` }} />
                    <span style={{ color: `${interests[active].color}80`, fontSize: 12 }}>{interests[active].rune}</span>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${interests[active].color}50)` }} />
                  </div>

                  {/* Detail text */}
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 16,
                    color: 'rgba(227,213,197,0.9)',
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}>
                    {interests[active].detail}
                  </p>

                  {/* Mastery bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(197,160,89,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Mastery
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: interests[active].color, fontWeight: 600 }}>
                        {interests[active].level}°
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${interests[active].level}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: `linear-gradient(90deg, ${interests[active].dimColor}, ${interests[active].color})`,
                          boxShadow: `0 0 10px ${interests[active].color}60`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '40px 20px' }}
                >
                  {/* Decorative wheel hint */}
                  <div style={{ fontSize: 48, color: 'rgba(197,160,89,0.25)', marginBottom: 20 }}>☽</div>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 18,
                    color: 'rgba(197,160,89,0.55)',
                    letterSpacing: '0.1em',
                    marginBottom: 10,
                  }}>
                    Hover a House
                  </p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15,
                    fontStyle: 'italic',
                    color: 'rgba(227,213,197,0.45)',
                    lineHeight: 1.7,
                  }}>
                    Each segment of the zodiac reveals a discipline — hover to read its augury.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Legend strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 28px', marginTop: 40 }}
        >
          {interests.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: item.color,
                boxShadow: `0 0 8px ${item.color}80`,
                flexShrink: 0,
                display: 'block',
                opacity: active === i || active === null ? 1 : 0.35,
                transition: 'opacity 0.3s ease',
              }} />
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 13,
                color: active === i ? item.color : 'rgba(227,213,197,0.65)',
                letterSpacing: '0.08em',
                transition: 'color 0.3s ease',
                textShadow: active === i ? `0 0 10px ${item.color}50` : 'none',
              }}>
                {item.name}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Footer motto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            textAlign: 'center',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14,
            fontStyle: 'italic',
            color: 'rgba(197,160,89,0.6)',
            letterSpacing: '0.16em',
            marginTop: 28,
          }}
        >
          "Per aspera ad astra — through hardship to the stars"
        </motion.p>

      </div>
    </section>
  );
};