import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Lightbulb, Users } from 'lucide-react';

export const CoreValues = () => {
  const values = [
    { 
      icon: Heart, 
      title: "Passion-Driven", 
      desc: "Every line of code written with genuine enthusiasm and commitment to excellence", 
      color: "#ff006e" 
    },
    { 
      icon: Target, 
      title: "Precision", 
      desc: "Meticulous attention to detail, from architecture to the final pixel", 
      color: "#00d4ff" 
    },
    { 
      icon: Lightbulb, 
      title: "Innovation", 
      desc: "Constantly exploring new technologies and creative solutions", 
      color: "#ffaa00" 
    },
    { 
      icon: Users, 
      title: "Collaboration", 
      desc: "Believing the best work emerges from diverse minds working together", 
      color: "#a855f7" 
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
              Core
            </span>{' '}
            <span className="text-white">Values & Philosophy</span>
          </h2>
          <p className="font-serif italic text-white/60 text-lg max-w-2xl mx-auto">
            "The principles that guide every project and interaction"
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div 
                className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: value.color }}
              />
              <div 
                className="relative p-6 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 
                  hover:border-white/30 transition-all duration-300 h-full"
                style={{ boxShadow: `0 0 30px ${value.color}10` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${value.color}30, ${value.color}10)`,
                    border: `1px solid ${value.color}50`,
                    boxShadow: `0 0 20px ${value.color}30`
                  }}
                >
                  <value.icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <h3 
                  className="font-bold text-white text-lg mb-2"
                  style={{ textShadow: `0 0 10px ${value.color}30` }}
                >
                  {value.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};