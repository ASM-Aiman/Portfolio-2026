// components/sections/Experience.tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const experiences = [
  {
    id: 1,
    role: "Associate Software Engineer",
    company: "Ifinity Global Pvt Ltd",
    location: "Colombo, Sri Lanka",
    period: "2024 — Present",
    era: "Current Epoch",
    constellation: "Orion",
    description: "Part of the Integration Team, responsible for developing and maintaining microservices that integrate with third-party APIs. Focused on building scalable backend systems using Java and Spring Boot, while collaborating closely with frontend teams to ensure seamless user experiences.",
    achievements: ["Delivered a complete SWIFT Converter project", "Mentored colleagues overseas", "Implemented CI/CD pipelines"],
    accentColor: "#f59e0b",
    neonColor: "#fbbf24",
    starCount: 7,
    glyphAngle: 12,
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Ruri Gems",
    location: "Remote · Japan",
    period: "2024",
    era: "Prior Voyage",
    constellation: "Lyra",
    description: "Developed an e-commerce platform for a Japanese jewelry company. Utilized smart contract development and blockchain integration to create a secure and transparent marketplace for precious gems. Collaborated across time zones with designers to deliver a polished user experience.",
    achievements: ["Mastered blockchain development", "Learned the Go language", "Built real-time notification system"],
    accentColor: "#22d3ee",
    neonColor: "#00d4ff",
    starCount: 5,
    glyphAngle: -8,
  },
];

// ─── Constellation mini-SVG ────────────────────────────────────────────────────
const ConstellationGlyph = ({ count, color, angle }: { count: number; color: string; angle: number }) => {
  const pts: [number, number][] = [
    [12, 8], [28, 4], [42, 14], [36, 26], [20, 30], [8, 22], [50, 8],
  ].slice(0, count);

  return (
    <svg width="60" height="38" viewBox="0 0 60 38" style={{ transform: `rotate(${angle}deg)`, opacity: 0.5 }}>
      {pts.map((pt, i) =>
        i < pts.length - 1 ? (
          <line key={`l${i}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[i+1][0]} y2={pts[i+1][1]}
            stroke={color} strokeWidth="0.6" strokeOpacity="0.4" />
        ) : null
      )}
      {pts.map((pt, i) => (
        <motion.circle key={`c${i}`} cx={pt[0]} cy={pt[1]} r={i === 0 ? 2.2 : 1.3}
          fill={color}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
};

// ─── Orbital dot for timeline ─────────────────────────────────────────────────
const OrbitalDot = ({ color }: { color: string }) => (
  <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0, marginTop: 6 }}>
    {[0, 1].map(i => (
      <motion.div key={i}
        animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
        transition={{ duration: 5 + i * 3, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: -(i * 6),
          borderRadius: '50%',
          border: `1px solid ${color}${i === 0 ? '60' : '30'}`,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
    ))}
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  </div>
);

// ─── Roman numeral helper ─────────────────────────────────────────────────────
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

// ─── Experience Chronicle Card ────────────────────────────────────────────────
const ChronicleCard = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <div style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${exp.accentColor}28`,
        borderRadius: 16,
        padding: '32px 32px 28px',
        overflow: 'hidden',
      }}
        className="group"
      >
        {/* Hover glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: `radial-gradient(ellipse at 30% 30%, ${exp.accentColor}08 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Illuminated corner flourish — top left */}
        <svg style={{ position: 'absolute', top: 0, left: 0, opacity: 0.35 }} width="70" height="70" viewBox="0 0 70 70">
          <path d="M 2 40 Q 2 2 40 2" stroke={exp.accentColor} strokeWidth="1" fill="none" />
          <path d="M 2 55 Q 2 2 55 2" stroke={exp.accentColor} strokeWidth="0.5" fill="none" strokeDasharray="3 5" />
          <circle cx="2" cy="2" r="3" fill={exp.accentColor} opacity="0.7" />
          <circle cx="40" cy="2" r="1.5" fill={exp.accentColor} opacity="0.5" />
          <circle cx="2" cy="40" r="1.5" fill={exp.accentColor} opacity="0.5" />
          {/* Small leaf ornament */}
          <path d="M 12 12 Q 18 6 24 12 Q 18 18 12 12" fill={exp.accentColor} opacity="0.3" />
        </svg>

        {/* Bottom right flourish */}
        <svg style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.35 }} width="50" height="50" viewBox="0 0 50 50">
          <path d="M 50 20 Q 50 50 20 50" stroke={exp.accentColor} strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="2.5" fill={exp.accentColor} opacity="0.5" />
        </svg>

        {/* Roman numeral index */}
        <div style={{
          position: 'absolute', top: 14, right: 20,
          fontFamily: 'serif',
          fontSize: 11,
          letterSpacing: 3,
          color: `${exp.accentColor}55`,
          textTransform: 'uppercase',
        }}>
          Vol. {ROMAN[index]}
        </div>

        {/* Top section: era + constellation */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <OrbitalDot color={exp.neonColor} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 10,
                letterSpacing: 3, textTransform: 'uppercase',
                color: exp.neonColor, opacity: 0.7,
              }}>
                {exp.era}
              </span>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${exp.accentColor}40, transparent)` }} />
              <ConstellationGlyph count={exp.starCount} color={exp.neonColor} angle={exp.glyphAngle} />
            </div>

            {/* Period badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* Tiny astrolabe clock icon */}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" fill="none" stroke={exp.accentColor} strokeWidth="0.8" opacity="0.6"/>
                <line x1="6" y1="6" x2="6" y2="2.5" stroke={exp.accentColor} strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
                <line x1="6" y1="6" x2="8.5" y2="7.5" stroke={exp.accentColor} strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                <circle cx="6" cy="6" r="1" fill={exp.accentColor} opacity="0.8"/>
              </svg>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: `${exp.accentColor}90`, letterSpacing: 1 }}>
                {exp.period}
              </span>
            </div>
          </div>
        </div>

        {/* Role title */}
        <h3 style={{
          fontFamily: 'serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'rgba(255,255,240,0.95)',
          marginBottom: 6,
          lineHeight: 1.25,
          textShadow: `0 0 20px ${exp.accentColor}30`,
          letterSpacing: 0.3,
        }}>
          {exp.role}
        </h3>

        {/* Company + location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 12, color: exp.neonColor, opacity: 0.8 }}>
            <ExternalLink size={11} />
            {exp.company}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <MapPin size={11} />
            {exp.location}
          </span>
        </div>

        {/* Separator flourish */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ height: '1px', flex: 1, background: `linear-gradient(to right, transparent, ${exp.accentColor}35)` }} />
          <svg width="16" height="16" viewBox="0 0 16 16">
            <polygon points="8,1 9.5,6 15,6 10.5,9.5 12,15 8,11.5 4,15 5.5,9.5 1,6 6.5,6" fill={exp.accentColor} opacity="0.4" />
          </svg>
          <div style={{ height: '1px', flex: 1, background: `linear-gradient(to left, transparent, ${exp.accentColor}35)` }} />
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'serif',
          fontSize: 14,
          lineHeight: 1.75,
          color: 'rgba(255,255,220,0.6)',
          marginBottom: 20,
          fontStyle: 'italic',
        }}>
          {exp.description}
        </p>

        {/* Achievements as manuscript scroll items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exp.achievements.map((achievement, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2 + i * 0.12 + 0.4, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              {/* Decorative bullet: small diamond */}
              <svg width="8" height="8" viewBox="0 0 8 8" style={{ flexShrink: 0 }}>
                <polygon points="4,0 8,4 4,8 0,4" fill={exp.accentColor} opacity="0.65" />
              </svg>
              <span style={{
                fontFamily: 'monospace', fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: 0.3,
              }}>
                {achievement}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Astronomical divider ─────────────────────────────────────────────────────
const AstroDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '12px 0' }}>
    <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(to right, transparent, rgba(255,180,50,0.25))' }} />
    {/* Orrery / astrolabe ring SVG */}
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,180,50,0.2)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="22" cy="22" r="13" fill="none" stroke="rgba(255,180,50,0.15)" strokeWidth="0.8" />
      <circle cx="22" cy="22" r="6" fill="none" stroke="rgba(255,180,50,0.3)" strokeWidth="1" />
      {/* Pointer arms */}
      <line x1="22" y1="2" x2="22" y2="9" stroke="rgba(255,180,50,0.4)" strokeWidth="1" />
      <line x1="22" y1="35" x2="22" y2="42" stroke="rgba(255,180,50,0.4)" strokeWidth="1" />
      <line x1="2" y1="22" x2="9" y2="22" stroke="rgba(255,180,50,0.4)" strokeWidth="1" />
      <line x1="35" y1="22" x2="42" y2="22" stroke="rgba(255,180,50,0.4)" strokeWidth="1" />
      {/* Center star */}
      <polygon points="22,18 23,21 26,21 23.5,23 24.5,26 22,24 19.5,26 20.5,23 18,21 21,21" fill="rgba(255,180,50,0.5)" />
      {/* Orbiting dot */}
      <motion.circle cx="35" cy="22" r="2" fill="#fbbf24" opacity="0.7"
        animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '22px', originY: '22px' }}
      />
    </svg>
    <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(to left, transparent, rgba(255,180,50,0.25))' }} />
  </div>
);

// ─── Experience Section ───────────────────────────────────────────────────────
export const Experience = () => {
  return (
    <section id="experience" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          {/* Decorative top line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(255,180,50,0.4))' }} />
            <svg width="18" height="18" viewBox="0 0 18 18">
              <polygon points="9,1 11,7 17,7 12,11 14,17 9,13 4,17 6,11 1,7 7,7" fill="rgba(255,180,50,0.45)" />
            </svg>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(255,180,50,0.4))' }} />
          </div>

          <span className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4">
            Professional Chronicle
          </span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            Work Experience
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60">
            "The forge where theory meets practice, under starlit vigils"
          </p>
        </motion.div>

        {/* Scrolling manuscript note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: 'center', marginBottom: 48,
            fontFamily: 'monospace', fontSize: 10,
            color: 'rgba(255,255,255,0.2)', letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Annals of the Craft · Recorded in Order of Epoch
        </motion.div>

        {/* Chronicle cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {experiences.map((exp, index) => (
            <div key={exp.id}>
              <ChronicleCard exp={exp} index={index} />
              {index < experiences.length - 1 && <AstroDivider />}
            </div>
          ))}
        </div>

        {/* Footer seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 48, gap: 10 }}
        >
          {/* Wax seal SVG */}
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="26" fill="rgba(180,80,20,0.12)" stroke="rgba(255,140,40,0.3)" strokeWidth="1" />
            <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,140,40,0.2)" strokeWidth="0.6" strokeDasharray="2 3" />
            {/* Star in center */}
            <polygon points="28,16 30.5,24 39,24 32.5,29 35,37 28,32 21,37 23.5,29 17,24 25.5,24" fill="rgba(255,140,40,0.35)" />
          </svg>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 4, color: 'rgba(255,180,50,0.25)', textTransform: 'uppercase' }}>
            Finis Chronicae
          </span>
        </motion.div>

      </div>
    </section>
  );
};