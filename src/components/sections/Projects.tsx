import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Star, GitBranch } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
  constellation: string;
}

const projects: Project[] = [
  {
    id: 'codex-reader',
    title: 'Codex Reader',
    description: 'A digital archive interface for exploring and annotating literary works. Built with the patience of a monk illuminating manuscripts.',
    tech: ['TypeScript', 'Electron', 'SQLite', 'Tailwind', 'ElectronJS'],
    githubUrl: 'https://github.com/ASM-Aiman/pdfreader',
    constellation: '♈',
  },
  {
    id: 'vocabulary-arsenal',
    title: 'Vocabulary Arsenal',
    description: 'A sanctuary for words. Personalized lexicons drawn from literature, art, and cinema.',
    tech: ['React', 'Turso', 'Groq', 'Tailwind','oauth'],
    githubUrl: 'https://github.com/ASM-Aiman/Vocab-One4All',
    liveUrl: 'https://fluencyvocab.netlify.app/',
    constellation: '♉',
  },
  {
    id: 'FinancialAssistant',
    title: 'FinancialAssistant',
    description: 'A text to SQL query generator for financial data analysis. Transforming natural language into actionable insights.',
    tech: ['TypeScript', 'Tailwind', 'React.js', 'OpenAI API','oauth','Pinecone'],
    githubUrl: 'https://github.com/ASM-Aiman/Financial-Assistant',
    liveUrl: 'https://nocturne-ui.dev',
    constellation: '♊',
  },
  {
    id: 'Inventort-Stock and employee management system',
    title: 'Inventort-Stock and employee management system',
    description: 'A comprehensive inventory and employee management system. Streamlining operations with a user-friendly interface.',
    tech: ['Electron', 'TypeScript', 'SQLite', 'Tailwind'],
    githubUrl: 'https://github.com/ASM-Aiman/Electron_InventorySystem-',
    constellation: '♋',
  },
];

export const Projects = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <section id="works" className="relative min-h-screen py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-[var(--gold)]" />
            <span className="font-mono text-xs text-[var(--gold)] uppercase tracking-[0.3em]">
              Constellations of Code
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 text-glow">
            The Astronomer's Observations
          </h2>
          <p className="font-serif italic text-white/60 max-w-xl mx-auto">
            "Each project a star in the firmament. Click to trace the connections 
            between thought and manifestation."
          </p>
        </motion.div>

        {/* Constellation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const isActive = activeProject === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
                className="relative group"
              >
                {/* Constellation symbol */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-black/50 border border-[var(--gold)]/30 flex items-center justify-center text-xl z-10">
                  {project.constellation}
                </div>

                <div className={`relative p-6 backdrop-blur-md border transition-all duration-500 ${isActive ? 'bg-black/40 border-[var(--gold)]/50' : 'bg-black/20 border-white/10'}`}>
                  {/* Connection lines (decorative) */}
                  {isActive && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--gold)" strokeDasharray="4 4" />
                    </svg>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-2xl text-white group-hover:text-[var(--gold)] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/5 hover:bg-[var(--gold)]/20 border border-white/10 hover:border-[var(--gold)]/50 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4 text-white/70 hover:text-[var(--gold)]" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/5 hover:bg-[var(--gold)]/20 border border-white/10 hover:border-[var(--gold)]/50 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4 text-white/70 hover:text-[var(--gold)]" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-white/70 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span 
                        key={t}
                        className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--gold)]/70 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    {project.stars !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Star className="w-3 h-3" />
                        <span className="font-mono">{project.stars}</span>
                      </div>
                    )}
                    {project.forks !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <GitBranch className="w-3 h-3" />
                        <span className="font-mono">{project.forks}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};