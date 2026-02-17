// components/sections/Achievements.tsx
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Users, Globe, Zap, Award, TrendingUp } from 'lucide-react';

const achievements = [
  {
    icon: Trophy,
    value: "4+",
    label: "WSO2 certificates",
    description: "WSO2 Certified API Manager, Micro Integrator, and Identity Server",
    color: "from-amber-400 to-yellow-300"
  },
  {
    icon: Users,
    value: "2+",
    label: "Projects Deployed and Delievered",
    description: "Deployed and delieverd BOC SWIFT converter with local, Domestic and seychelles.",
    color: "from-blue-400 to-cyan-300"
  },
  {
    icon: Globe,
    value: "4+",
    label: "Personal Projects",
    description: "Making my day to day life easier by building apps that i would need in my day to day life. Some of them are open sourced and available on my github.",
    color: "from-emerald-400 to-teal-300"
  },

  {
    icon: Award,
    value: "8+",
    label: "Certifications",
    description: "Azure, BPC, Microsoft, WSO2 and more",
    color: "from-rose-400 to-orange-300"
  },
];

const Counter = ({ value }: { value: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold)] to-amber-200"
    >
      {value}
    </motion.span>
  );
};

export const Achievements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <section id="achievements" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4">
            Notable Feats
          </span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            Key Achievements
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60">
            "Numbers that tell stories of dedication"
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            
            return (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-black/20 backdrop-blur-md border border-[var(--gold)]/20 rounded-2xl p-8 overflow-hidden hover:border-[var(--gold)]/50 transition-all duration-500">
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-xl bg-[var(--void)] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[var(--parchment)]" />
                    </div>
                  </div>

                  {/* Content */}
                  <Counter value={achievement.value} />
                  <h3 className="text-lg font-semibold text-[var(--parchment)] mt-2 mb-1">
                    {achievement.label}
                  </h3>
                  <p className="text-sm text-[var(--parchment)]/50">
                    {achievement.description}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[var(--gold)]/20 rounded-tr-lg group-hover:border-[var(--gold)]/50 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};