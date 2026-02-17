import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, Feather, MapPin, Calendar, Award, 
  BookOpen, Crown, Star, ChevronRight, X,
  ScrollText, GraduationCap, Sparkles, Sun
} from 'lucide-react';

const educationData: Array<{
  id: number;
  degree: string;
  school: string;
  location: string;
  period: string;
  gpa: string;
  achievements: string[];
  description: string;
  seal: string;
  color: 'gold' | 'silver';
  accent: string;
  gradient: string;
}> = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science",
    school: "Informatics Institute of Technology",
    location: "Bambalapitiya, Sri Lanka",
    period: "2023 - 2026",
    gpa: "3.8/4.0",
    achievements: ["Dean's List", "Best Project Award"],
    description: "Studied the arcane arts of computation, algorithms, and digital architecture. Mastered the craft of weaving logic into reality.",
    seal: "🜔",
    color: "gold",
    accent: "#3b82f6", // Richer blue
    gradient: "from-blue-900/40 to-slate-900/60"
  },
  {
    id: 2,
    degree: "Advanced Level - Physical Science",
    school: "Amal International",
    location: "Havelock, Sri Lanka",
    period: "2019 - 2022",
    achievements: ["Best Creative Writer - 2019", "Science Society President - 2021"],
    description: "Foundation in the natural sciences. Explored the physical laws governing matter, energy, and the cosmos.",
    seal: "🜁",
    color: "silver",
    accent: "#f59e0b", // Richer amber
    gradient: "from-amber-900/30 to-slate-900/50",
    gpa: ''
  }
];

const IlluminatedLetter = ({ letter, accent }: { letter: string; accent: string }) => (
  <span 
    className="relative inline-block font-serif text-6xl md:text-7xl font-bold float-left mr-4 mt-2 leading-none"
    style={{ 
      color: accent,
      textShadow: `0 0 30px ${accent}, 0 0 60px ${accent}60`
    }}
  >
    {letter}
    <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)]" viewBox="0 0 100 100">
      <path
        d="M10,50 Q25,25 50,10 Q75,25 90,50 Q75,75 50,90 Q25,75 10,50"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  </span>
);

const WaxSeal = ({ seal, color, isHovered, accent }: { seal: string; color: 'gold' | 'silver'; isHovered: boolean; accent: string }) => {
  const sealColors = {
    gold: 'bg-blue-800/90',
    silver: 'bg-amber-800/90'
  };
  
  const borderColors = {
    gold: 'border-blue-400',
    silver: 'border-amber-400'
  };

  return (
    <motion.div 
      className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl
        ${sealColors[color]}
        border-2 ${borderColors[color]}
        shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]
      `}
      animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      <div className="absolute inset-2 rounded-full border border-white/30" />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{seal}</span>
      
      <motion.div 
        className="absolute -inset-2 rounded-full blur-xl"
        style={{ backgroundColor: accent }}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
      />
    </motion.div>
  );
};

const ManuscriptCard = ({ edu, index, isExpanded, onToggle }: { edu: typeof educationData[0]; index: number; isExpanded: boolean; onToggle: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  const accent = edu.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.3, duration: 0.8 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer glow frame */}
      <motion.div 
        className="absolute -inset-1 rounded-lg opacity-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accent}50, transparent, ${accent}50)`,
          opacity: isHovered ? 0.6 : 0
        }}
      />

      {/* Glassmorphism card */}
      <div 
        className={`relative p-8 md:p-10 rounded-xl border backdrop-blur-xl
          bg-gradient-to-br ${edu.gradient}
          border-white/20
          shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        `}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/40" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/40" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/40" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/40" />

        {/* Header with seal and title */}
        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center mb-6 pb-6 border-b border-white/20">
          <WaxSeal seal={edu.seal} color={edu.color} isHovered={isHovered} accent={accent} />
          
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <ScrollText className="w-4 h-4" style={{ color: accent }} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/70">
                Charter of Learning #{String(edu.id).padStart(3, '0')}
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl leading-tight text-white drop-shadow-md">
              {edu.degree}
            </h3>
          </div>

          <motion.button
            onClick={onToggle}
            className="relative p-2 rounded-lg border border-white/30 text-white/80 
              hover:bg-white/20 hover:text-white hover:border-white/50 
              transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? <X size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </div>

        {/* Main content */}
        <div className="relative space-y-4">
          {/* Metadata tags */}
          <div className="flex flex-wrap gap-3 text-sm font-mono">
            {[
              { icon: Award, text: edu.school },
              { icon: MapPin, text: edu.location },
              { icon: Calendar, text: edu.period }
            ].map((item, i) => (
              <span 
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                  bg-white/10 border border-white/20 text-white/90
                  backdrop-blur-sm"
              >
                <item.icon className="w-4 h-4" style={{ color: accent }} />
                {item.text}
              </span>
            ))}
          </div>

          {/* Illuminated description */}
          <div 
            className="relative mt-6 p-6 rounded-lg bg-black/20 border-l-4"
            style={{ borderColor: accent }}
          >
            <IlluminatedLetter letter={edu.description.charAt(0)} accent={accent} />
            <p className="font-display leading-relaxed text-lg text-white/90 drop-shadow-sm">
              {edu.description.slice(1)}
            </p>
            
            <div 
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${accent}60, transparent)` }}
            />
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-3 pt-4">
            {edu.achievements.map((achievement: string, i: number) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="group/badge relative px-4 py-2 rounded-lg 
                  bg-white/10 border border-white/20 
                  text-white font-serif text-sm
                  backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l" style={{ borderColor: accent }} />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r" style={{ borderColor: accent }} />
                <span className="flex items-center gap-2">
                  <Star className="w-3 h-3 transition-colors" style={{ color: accent }} />
                  {achievement}
                </span>
              </motion.span>
            ))}
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg flex items-center gap-2 text-white">
                      <BookOpen className="w-4 h-4" style={{ color: accent }} />
                      Notable Studies
                    </h4>
                    <ul className="space-y-2 font-mono text-sm text-white/80">
                      {[
                        "Advanced Algorithms & Data Structures",
                        "Software Architecture & Design Patterns",
                        "Database Systems & Information Retrieval"
                      ].map((study, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span style={{ color: accent }}>❧</span>
                          {study}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg flex items-center gap-2 text-white">
                      <Crown className="w-4 h-4" style={{ color: accent }} />
                      Academic Honors
                    </h4>
                    <div className="p-4 rounded-lg bg-black/30 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-white/60">GPA</span>
                        <span className="font-serif text-2xl" style={{ color: accent, textShadow: `0 0 20px ${accent}` }}>
                          {edu.gpa}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "95%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(to right, ${accent}80, ${accent})`,
                            boxShadow: `0 0 10px ${accent}`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4 text-white/30">
            <span className="w-12 h-px bg-current" />
            <Sparkles className="w-4 h-4" />
            <span className="w-12 h-px bg-current" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const EducationSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section 
      id="education" 
      className="py-32 relative overflow-hidden"
      // NO BACKGROUND - transparent
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4 p-4 rounded-full 
              bg-white/10 backdrop-blur-xl border border-white/20
              shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <Sun className="w-6 h-6 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          </motion.div>
          
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <span className="italic text-amber-200">The</span> Scholar's Path
          </h2>
          
          <div className="flex items-center justify-center gap-4 text-white/80 font-mono text-sm tracking-widest uppercase">
            <span className="w-16 h-px bg-white/40" />
            <span className="drop-shadow-md">Chronicles of Learning</span>
            <span className="w-16 h-px bg-white/40" />
          </div>
        </div>

        {/* Manuscript scroll container */}
        <div className="relative">
          {/* Glassmorphism scroll edges */}
          <div className="absolute -left-4 top-0 bottom-0 w-8 
            bg-gradient-to-r from-white/20 to-transparent rounded-l-lg 
            backdrop-blur-md border-l border-y border-white/20" />
          <div className="absolute -right-4 top-0 bottom-0 w-8 
            bg-gradient-to-l from-white/20 to-transparent rounded-r-lg 
            backdrop-blur-md border-r border-y border-white/20" />

          <div className="space-y-12">
            {educationData.map((edu, index) => (
              <ManuscriptCard
                key={edu.id}
                edu={edu}
                index={index}
                isExpanded={expandedId === edu.id}
                onToggle={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg
            shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <Feather className="w-4 h-4 text-amber-200" />
            <span className="font-mono text-xs text-white/90 italic">
              "The pursuit of knowledge is never-ending"
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};