import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Briefcase, Cpu } from 'lucide-react';

export const StatsBar = () => {
  const stats = [
    { icon: Code2, value: "10", label: "Projects Completed", color: "#00d4ff", suffix: "+" },
    { icon: Users, value: "3", label: "Happy Clients", color: "#ff00ff", suffix: "+" },
    { icon: Briefcase, value: "4+", label: "Years Experience", color: "#ffaa00", suffix: "+" },
    { icon: Cpu, value: "15+", label: "Technologies Mastered", color: "#a855f7", suffix: "+" },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Removed border-y and bg-black/40 - now backgroundless */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <motion.div
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 relative"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
                  border: `2px solid ${stat.color}50`,
                  boxShadow: `0 0 25px ${stat.color}30, inset 0 0 20px ${stat.color}10`
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <stat.icon className="w-7 h-7" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color})` }} />
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${stat.color}` }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="flex items-baseline justify-center gap-1">
                <motion.span
                  className="text-3xl md:text-4xl font-black"
                  style={{ 
                    color: '#fff',
                    textShadow: `0 0 20px ${stat.color}, 0 0 40px ${stat.color}50`
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-xl font-bold" style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}` }}>
                  {stat.suffix}
                </span>
              </div>
              
              <p className="text-white/70 font-mono text-xs uppercase tracking-wider mt-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Subtle animated lines - more transparent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </section>
  );
};