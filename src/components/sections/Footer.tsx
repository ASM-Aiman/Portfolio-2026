// components/sections/Footer.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Clock, Heart, Sparkles, ExternalLink, ChevronUp } from 'lucide-react';
import { FooterWeight } from '../ui/FooterWeight';

const socialLinks = [
  { 
    icon: Github, 
    href: "https://github.com/ASM-Aiman", 
    label: "GitHub",
    color: "hover:text-[#f59e0b]"
  },
  { 
    icon: Linkedin, 
    href: "https://www.linkedin.com/in/aimansalam/", 
    label: "LinkedIn",
    color: "hover:text-[#06b6d4]"
  },
  { 
    icon: Mail, 
    href: "mailto:aimansalam26@gmail.com", 
    label: "Email",
    color: "hover:text-[#f43f5e]"
  }
];

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" }
];

export const Footer = () => {
  const [time, setTime] = useState(new Date());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Main Footer */}
      <footer className="relative mt-32">
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
        
        {/* Glass Container */}
        <div className="relative backdrop-blur-xl bg-black/10 border-t border-white/5">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gold)]/5 to-[var(--gold)]/10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 py-16 relative">
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
              
              {/* Brand Column */}
              <div className="md:col-span-5 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-amber-600 flex items-center justify-center shadow-lg shadow-[var(--gold)]/20">
                      <Sparkles className="w-5 h-5 text-[var(--void)]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-[var(--parchment)]">ASM Aiman</h3>
                      <p className="text-xs font-mono text-[var(--gold)]/60 uppercase tracking-widest">Digital Alchemist</p>
                    </div>
                  </div>
                  
                  <p className="text-[var(--parchment)]/60 text-sm leading-relaxed max-w-sm font-light">
                    Crafting digital experiences at the intersection of art and code. 
                    Based in Colombo, shipping worldwide.
                  </p>
                </motion.div>

                {/* Live Time Display */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <Clock className="w-3 h-3 text-[var(--gold)]" />
                  <span className="font-mono text-xs text-[var(--parchment)]/80 tabular-nums">
                    {formatTime(time)}
                  </span>
                  <span className="text-[10px] text-[var(--parchment)]/40 uppercase tracking-wider">CMB</span>
                </motion.div>
              </div>

              {/* Navigation Column */}
              <div className="md:col-span-3 md:col-start-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-xs font-mono text-[var(--gold)] uppercase tracking-[0.2em] mb-6">Navigation</h4>
                  <ul className="space-y-3">
                    {navLinks.map((link, index) => (
                      <motion.li 
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <a 
                          href={link.href}
                          className="group flex items-center gap-2 text-sm text-[var(--parchment)]/60 hover:text-[var(--gold)] transition-colors duration-300"
                        >
                          <span className="w-0 group-hover:w-2 h-px bg-[var(--gold)] transition-all duration-300" />
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Connect Column */}
              <div className="md:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-xs font-mono text-[var(--gold)] uppercase tracking-[0.2em] mb-4">Connect</h4>
                    <div className="flex gap-3">
                      {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                          <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--parchment)]/60 ${social.color} hover:bg-white/10 hover:border-[var(--gold)]/30 transition-all duration-300 backdrop-blur-sm`}
                            aria-label={social.label}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weight Widget */}
                  <div className="pt-4 border-t border-white/5">
                    <FooterWeight />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative py-8 mb-8"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />
              </div>
              <p className="relative text-center font-serif italic text-[var(--parchment)]/40 text-lg max-w-2xl mx-auto px-8">
                "The sky is the daily bread of the eyes"
                <span className="block text-xs font-mono not-italic text-[var(--gold)]/40 mt-2 uppercase tracking-widest">
                  — Ralph Waldo Emerson
                </span>
              </p>
            </motion.div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-[var(--parchment)]/30">
                <MapPin className="w-3 h-3" />
                <span className="font-mono">125 Vivian Gunawardhana Mawatha, Colombo, Sri Lanka</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[var(--parchment)]/30 font-mono">
                <span>Crafted with</span>
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
                <span>by ASM Aiman</span>
                <span className="mx-2">•</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--gold)]/10 backdrop-blur-md border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center hover:bg-[var(--gold)]/20 hover:scale-110 transition-all duration-300 z-50 shadow-lg shadow-[var(--gold)]/10"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </footer>
    </>
  );
};