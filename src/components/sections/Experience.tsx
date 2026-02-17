// components/sections/Experience.tsx
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

const experiences = [
  {
    id: 1,
    role: "Assosiate Software Engineer",
    company: "Ifinity Global Pvt Ltd",
    location: "Colombo, Sri Lanka",
    period: "2024 - Present",
    description: "Part of the Integration Team, responsible for developing and maintaining microservices that integrate with third-party APIs. Focused on building scalable backend systems using java and Spring Boot, while collaborating closely with frontend teams to ensure seamless user experiences.",
    achievements: ["Delivered, managed and developed a complete SWIFT Converter project", "Mentored a few people Overseas", "Implemented CI/CD pipelines"],
    color: "from-amber-400 to-orange-500"
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Ruri Gems",
    location: "Remote, Japan",
    period: "2024 - 2024",
    description: "Worked on a project to develop an e-commerce platform for a Japanese jewelry company. Utilized smart contract development and blockchain integration to create a secure and transparent marketplace for buying and selling precious gems. Collaborated with a team of designers and developers to deliver a user-friendly platform that met the client's requirements.",
    achievements: ["Learned blockchain development", "Learned Go Language", "Built real-time notification system"],
    color: "from-cyan-400 to-blue-500"
  }

];

export const Experience = () => {
  return (
    <section id="experience" className="py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4">
            Professional Chronicle
          </span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            Work Experience
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60">
            "The forge where theory meets practice"
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--gold)] via-[var(--gold)]/50 to-transparent md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-16 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[var(--gold)] border-4 border-[var(--void)] md:-translate-x-1/2 -translate-x-1/2 top-0 z-10 shadow-lg shadow-[var(--gold)]/50" />

              {/* Content */}
              <div className="flex-1 md:w-1/2 pl-8 md:pl-0 md:px-12">
                <div className="group relative bg-black/20 backdrop-blur-sm border border-[var(--gold)]/20 rounded-xl p-6 hover:border-[var(--gold)]/50 transition-all duration-500">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-[var(--gold)]" />
                      <span className="font-mono text-xs text-[var(--gold)] uppercase tracking-wider">
                        {exp.period}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[var(--parchment)] mb-1">
                      {exp.role}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-[var(--parchment)]/60">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>

                    <p className="text-[var(--parchment)]/70 mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.achievements.map((achievement, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 text-xs font-mono bg-[var(--gold)]/10 text-[var(--gold)] rounded-full border border-[var(--gold)]/20"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};