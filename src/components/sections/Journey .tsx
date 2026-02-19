// components/sections/Journey.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Compass, BookOpen, Code, Rocket, Star } from 'lucide-react';

const milestones = [
  {
    year: "2018",
    title: "The First Line",
    description: "Wrote my first 'Hello World' in Python. The spark that ignited the obsession.",
    icon: Code,
    color: "text-emerald-400"
  },
  {
    year: "2023",
    title: "Informatics Institute Of Technology",
    description: "Began formal studies in Computer Science. Late nights debugging, early mornings learning.",
    icon: BookOpen,
    color: "text-blue-400"
  },
  {
    year: "2024",
    title: "First Hackathon Participations",
    description: "Built a disaster management app in 48 hours. Learned that sleep is optional when inspired. Learned a lot about teamwork and rapid prototyping.",
    icon: Rocket,
    color: "text-amber-400"
  },
 
  {
    year: "2024 end",
    title: "Got my first Internship",
    description: "Joined Ifinity Global Pvt Ltd as an Intern Software Engineer. The real journey begins.",
    icon: Compass,
    color: "text-rose-400"
  },
   {
    year: "2025",
    title: "Started doing a lot of new things",
    description: "Coded apps that i would need in my day to day life. Solo travelled to new places. Started reading books that were not related to tech. Started doing a lot of things that i would have never imagined doing before. Hit the gym",
    icon: Star,
    color: "text-purple-400"
  },
];

export const Journey = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4">
            The Path Thus Far
          </span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            My Journey
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60 max-w-2xl mx-auto">
            "Not all those who wander are lost. Some are just exploring the stack."
          </p>
        </motion.div>

        {/* Constellation Path */}
        <div className="relative">
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-2 hidden md:block" viewBox="0 0 2 100" preserveAspectRatio="none">
            <motion.path
              d="M 1 0 L 1 100"
              stroke="rgba(197, 160, 89, 0.2)"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
            />
          </svg>

          <div className="space-y-24">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div 
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="font-mono text-5xl font-bold text-[var(--gold)]/20 block mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="text-2xl font-bold text-[var(--parchment)] mb-2 flex items-center gap-2 md:justify-end">
                        {!isEven && <Icon className={`w-6 h-6 ${milestone.color}`} />}
                        {milestone.title}
                        {isEven && <Icon className={`w-6 h-6 ${milestone.color}`} />}
                      </h3>
                      <p className="text-[var(--parchment)]/60 leading-relaxed max-w-md">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-[var(--void)] border-2 border-[var(--gold)] flex items-center justify-center relative"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-6 h-6 ${milestone.color}`} />
                      
                      {/* Orbiting particles */}
                      <motion.div 
                        className="absolute inset-0 rounded-full border border-[var(--gold)]/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-[var(--gold)] rounded-full" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};