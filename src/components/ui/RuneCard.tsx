import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';


interface RuneCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export const RuneCard = ({ name, description, icon: Icon, index }: RuneCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="rune-border group relative p-6 bg-[var(--ink)]/40 overflow-hidden"
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)]/0 via-[var(--gold)]/10 to-[var(--gold)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-6 h-6 text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="font-mono text-[10px] text-[var(--gold)]/50 tracking-widest uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        <h3 className="font-serif text-xl text-[var(--parchment)] mb-2 group-hover:text-[var(--gold)] transition-colors">
          {name}
        </h3>
        
        <p className="font-serif italic text-sm text-[var(--parchment)]/60 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};