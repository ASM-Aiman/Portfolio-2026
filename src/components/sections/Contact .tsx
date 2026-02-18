// components/sections/Contact.tsx
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

// ─── Satellite SVG Scene ───────────────────────────────────────────────────────
const SatelliteTransmission = ({ onComplete }: { onComplete: () => void }) => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // 1. Satellite flies in from top-right
      await controls.start('satelliteIn');
      // 2. Signal pulses burst
      await controls.start('transmit');
      // 3. Hold, then fade out
      await new Promise(r => setTimeout(r, 1400));
      await controls.start('exit');
      onComplete();
    };
    sequence();
  }, []);

  const satelliteVariants = {
    hidden:      { x: 200, y: -200, opacity: 0, rotate: -30 },
    satelliteIn: { x: 0, y: 0, opacity: 1, rotate: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
    transmit:    { x: 0, y: 0, opacity: 1, rotate: 0, transition: { duration: 0.1 } },
    exit:        { x: -300, y: 300, opacity: 0, rotate: 20, transition: { duration: 0.9, ease: [0.4, 0, 1, 1] } },
  };

  const ringVariants = (delay: number) => ({
    hidden:   { scale: 0, opacity: 0 },
    transmit: {
      scale: [0, 3.5, 6],
      opacity: [0, 0.8, 0],
      transition: { duration: 2.2, delay, ease: 'easeOut' },
    },
    exit: { opacity: 0 },
  });

  const beamVariants = {
    hidden:   { pathLength: 0, opacity: 0 },
    transmit: { pathLength: 1, opacity: [0, 1, 1, 0], transition: { duration: 2.5, ease: 'easeInOut' } },
    exit:     { opacity: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
      }}
    >
      <svg width="340" height="260" viewBox="0 0 340 260" style={{ overflow: 'visible' }}>
        {/* Star field background dots */}
        {Array.from({ length: 28 }, (_, i) => (
          <motion.circle
            key={i}
            cx={(i * 73 + 17) % 340}
            cy={(i * 47 + 11) % 260}
            r={i % 4 === 0 ? 1.5 : 0.8}
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3, 0.7, 0], transition: { duration: 2 + i * 0.1, delay: i * 0.06, repeat: Infinity } }}
          />
        ))}

        {/* Dotted orbit path */}
        <motion.ellipse
          cx="170" cy="130" rx="130" ry="50"
          fill="none" stroke="rgba(255,180,50,0.15)" strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
        />

        {/* Signal rings emanating from satellite */}
        {[0, 0.35, 0.7].map((delay, i) => (
          <motion.circle
            key={i}
            cx="170" cy="90" r="16"
            fill="none" stroke="#00d4ff" strokeWidth="1.5"
            variants={ringVariants(delay)}
            initial="hidden"
            animate={controls}
            style={{ originX: '170px', originY: '90px' }}
          />
        ))}

        {/* Signal beam to planet/earth */}
        <motion.path
          d="M 170 106 Q 240 160 300 200"
          fill="none"
          stroke="url(#beamGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          variants={beamVariants}
          initial="hidden"
          animate={controls}
        />
        {/* Secondary beam */}
        <motion.path
          d="M 170 106 Q 100 160 50 195"
          fill="none"
          stroke="url(#beamGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          variants={beamVariants}
          initial="hidden"
          animate={controls}
        />

        {/* Earth/planet */}
        <motion.circle
          cx="300" cy="210" r="22"
          fill="url(#earthGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.6 } }}
        />
        <motion.circle cx="300" cy="210" r="22"
          fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.3 } }}
        />
        {/* Earth atmosphere glow */}
        <motion.circle cx="300" cy="210" r="28"
          fill="none" stroke="rgba(0,180,255,0.2)" strokeWidth="6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5 } }}
        />

        {/* Moon */}
        <motion.circle cx="50" cy="200" r="12"
          fill="url(#moonGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
        />

        {/* Satellite body — flies in */}
        <motion.g
          variants={satelliteVariants}
          initial="hidden"
          animate={controls}
          style={{ originX: '170px', originY: '90px' }}
        >
          {/* Solar panel left */}
          <rect x="130" y="84" width="28" height="12" rx="2"
            fill="url(#solarGrad)" stroke="rgba(255,200,80,0.5)" strokeWidth="0.5" />
          <line x1="135" y1="84" x2="135" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="140" y1="84" x2="140" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="145" y1="84" x2="145" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="150" y1="84" x2="150" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          {/* Connector arm left */}
          <rect x="157" y="88" width="5" height="4" rx="1" fill="rgba(150,150,170,0.8)" />

          {/* Main body */}
          <rect x="161" y="82" width="18" height="16" rx="3"
            fill="url(#bodyGrad)" stroke="rgba(200,200,220,0.4)" strokeWidth="0.8" />
          {/* Body details */}
          <rect x="163" y="85" width="14" height="4" rx="1" fill="rgba(0,212,255,0.3)" />
          <rect x="163" y="91" width="14" height="2" rx="0.5" fill="rgba(255,180,50,0.3)" />

          {/* Connector arm right */}
          <rect x="178" y="88" width="5" height="4" rx="1" fill="rgba(150,150,170,0.8)" />
          {/* Solar panel right */}
          <rect x="182" y="84" width="28" height="12" rx="2"
            fill="url(#solarGrad)" stroke="rgba(255,200,80,0.5)" strokeWidth="0.5" />
          <line x1="187" y1="84" x2="187" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="192" y1="84" x2="192" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="197" y1="84" x2="197" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />
          <line x1="202" y1="84" x2="202" y2="96" stroke="rgba(255,200,80,0.3)" strokeWidth="0.5" />

          {/* Dish antenna */}
          <path d="M 170 82 Q 162 72 158 68" stroke="rgba(200,200,220,0.6)" strokeWidth="1" fill="none" />
          <ellipse cx="158" cy="67" rx="7" ry="4" fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth="1.2" transform="rotate(-30 158 67)" />

          {/* Blinking status light */}
          <motion.circle cx="170" cy="90" r="2.5" fill="#00d4ff"
            animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a6b" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1a3a6b" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="earthGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="70%" stopColor="#166534" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <radialGradient id="moonGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beamGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text below satellite */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.5 } }}
        style={{ textAlign: 'center', marginTop: 8 }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#00d4ff', textShadow: '0 0 12px #00d4ff' }}>
          Transmitting Signal
        </div>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 2 }}
        >
          ● ● ●
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── Success State ─────────────────────────────────────────────────────────────
const SignalReceived = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.6, ease: [0.34, 1.4, 0.64, 1] }}
    style={{ textAlign: 'center', padding: '48px 0', position: 'relative' }}
  >
    {/* Orbit rings around check */}
    <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
          transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -(i * 14),
            borderRadius: '50%',
            border: `1px solid rgba(0,212,255,${0.4 - i * 0.1})`,
            borderTopColor: 'transparent',
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 12 }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <CheckCircle size={40} color="#4ade80" style={{ filter: 'drop-shadow(0 0 12px #4ade80)' }} />
      </motion.div>
    </div>

    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{ fontFamily: 'serif', fontSize: 22, color: 'rgba(255,255,240,0.95)', marginBottom: 6 }}
    >
      Signal Received
    </motion.h3>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}
    >
      Transmission complete · Response incoming
    </motion.p>
  </motion.div>
);

// ─── Contact Section ──────────────────────────────────────────────────────────
export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<'form' | 'transmitting' | 'success'>('form');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/mykdjnbp', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setPhase('transmitting');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transmission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleTransmitComplete = () => {
    setPhase('success');
    setIsSubmitting(false);
    setTimeout(() => setPhase('form'), 6000);
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4"
          >
            Establish Connection
          </motion.span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            Send a Signal
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60">
            "Messages travel far in the digital ether. Where shall we meet?"
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black/20 backdrop-blur-xl border border-[var(--gold)]/20 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Corner astrolabe accents */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              width: 28, height: 28,
              top: i < 2 ? 12 : 'auto', bottom: i >= 2 ? 12 : 'auto',
              left: i % 2 === 0 ? 12 : 'auto', right: i % 2 === 1 ? 12 : 'auto',
              borderTop:    i < 2  ? '1px solid rgba(255,180,50,0.35)' : 'none',
              borderBottom: i >= 2 ? '1px solid rgba(255,180,50,0.35)' : 'none',
              borderLeft:   i % 2 === 0 ? '1px solid rgba(255,180,50,0.35)' : 'none',
              borderRight:  i % 2 === 1 ? '1px solid rgba(255,180,50,0.35)' : 'none',
            }} />
          ))}

          {/* Ambient glow orb */}
          <motion.div
            className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,160,40,0.06) 0%, transparent 70%)', translateY: '-40%', translateX: '40%' }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />

          <AnimatePresence mode="wait">
            {phase === 'transmitting' && (
              <SatelliteTransmission key="satellite" onComplete={handleTransmitComplete} />
            )}

            {phase === 'success' && <SignalReceived key="success" />}

            {phase === 'form' && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="relative space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <motion.div className="relative group"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                    <input type="text" name="name" placeholder="Your Name"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-11 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
                      required />
                  </motion.div>
                  {/* Email */}
                  <motion.div className="relative group"
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                    <input type="email" name="email" placeholder="your@email.com"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-11 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
                      required />
                  </motion.div>
                </div>

                {/* Message */}
                <motion.div className="relative group"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                  <textarea name="message" placeholder="Your message across the void..."
                    value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={5} required
                    className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-11 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300 resize-none"
                  />
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-3 px-4"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden group rounded-lg py-4 flex items-center justify-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,160,40,0.9), rgba(200,100,20,0.9))',
                    border: '1px solid rgba(255,180,60,0.4)',
                    color: '#0a0806',
                    boxShadow: '0 0 0 rgba(255,160,40,0)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(255,160,40,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 rgba(255,160,40,0)')}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={isSubmitting ? { x: '200%' } : { x: '-100%' }}
                    transition={{ duration: 0.9, repeat: isSubmitting ? Infinity : 0, ease: 'linear' }}
                  />
                  {/* Satellite icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="9" y="10" width="6" height="5" rx="1" fill="currentColor" opacity="0.9"/>
                    <rect x="2" y="11" width="7" height="3" rx="0.5" fill="currentColor" opacity="0.7"/>
                    <rect x="15" y="11" width="7" height="3" rx="0.5" fill="currentColor" opacity="0.7"/>
                    <line x1="12" y1="10" x2="10" y2="6" stroke="currentColor" strokeWidth="1.2"/>
                    <ellipse cx="9.5" cy="5" rx="2.5" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-35 9.5 5)"/>
                    <circle cx="12" cy="12.5" r="1.2" fill="#00d4ff" opacity="0.8"/>
                  </svg>
                  <span>Transmit Message</span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};