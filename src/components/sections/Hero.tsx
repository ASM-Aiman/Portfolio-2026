import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="entrance" className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center max-w-4xl"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="w-24 h-px bg-[var(--gold)] mx-auto mb-8"
        />

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 text-glow leading-tight drop-shadow-2xl">
         Aiman's
          <br />
          <span className="italic text-[var(--gold)]">Archive</span>
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
          "A wandering scholar-engineer's personal archive. Where code meets poetry, 
          and science dances with art."
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['Software Engineer', 'Otaku', 'Science Geek', 'Cinephile', 'Reader', 'Traveller'].map((tag) => (
            <span 
              key={tag}
              className="px-4 py-2 border border-white/20 text-white/70 text-xs font-mono uppercase tracking-widest hover:border-[var(--gold)]/60 hover:text-[var(--gold)] transition-all duration-300 backdrop-blur-sm bg-black/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <motion.a
          href="#cosmos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="inline-flex flex-col items-center gap-2 text-white/50 hover:text-[var(--gold)] transition-colors group"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Enter the Archive</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
};