// components/ui/FooterWeight.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { planets } from '../../lib/constants';
import { Scale, ChevronDown, Orbit } from 'lucide-react';

export const FooterWeight = () => {
  const [weight, setWeight] = useState<string>('70');
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2]);
  const [isOpen, setIsOpen] = useState(false);

  const calculatedWeight = (parseFloat(weight) || 0) * selectedPlanet.gravity;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs text-[var(--parchment)]/50 hover:text-[var(--gold)] transition-colors duration-300 group"
      >
        <Orbit className="w-3 h-3 group-hover:animate-spin" />
        <span className="font-mono">
          {calculatedWeight.toFixed(1)}kg on {selectedPlanet.name}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-3 w-56 backdrop-blur-xl bg-black/40 border border-[var(--gold)]/20 rounded-xl p-4 shadow-2xl shadow-black/50"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--gold)] text-xs font-mono uppercase tracking-wider mb-2">
                <Scale className="w-3 h-3" />
                <span>Cosmic Mass</span>
              </div>
              
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[var(--parchment)] text-center focus:border-[var(--gold)]/50 focus:outline-none transition-colors font-mono"
                placeholder="Earth kg"
              />
              
              <div className="grid grid-cols-4 gap-1">
                {planets.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => setSelectedPlanet(planet)}
                    className={`text-[10px] py-1.5 px-1 rounded-lg border transition-all duration-200 font-mono ${
                      selectedPlanet.name === planet.name
                        ? 'border-[var(--gold)]/50 bg-[var(--gold)]/10 text-[var(--gold)]'
                        : 'border-white/5 text-[var(--parchment)]/40 hover:border-white/20 hover:text-[var(--parchment)]/60'
                    }`}
                  >
                    {planet.name.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className="text-center pt-2 border-t border-white/5">
                <span className="text-lg font-serif text-[var(--gold)]">
                  {calculatedWeight.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--parchment)]/40 ml-1 font-mono">kg</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};