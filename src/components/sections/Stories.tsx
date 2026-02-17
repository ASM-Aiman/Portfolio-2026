import { motion } from 'framer-motion';
import { Book, Film, Tv, Quote } from 'lucide-react';
import { stories } from '../../lib/constants';

export const Stories = () => {
  return (
    <section id="stories" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4 drop-shadow-lg">
            Cultural Artifacts
          </span>
          <h2 className="text-4xl md:text-6xl text-white mb-6 drop-shadow-2xl text-glow">
            Stories That Built Me
          </h2>
          <p className="font-serif italic text-white/70 max-w-2xl mx-auto drop-shadow-lg">
            "We are the stories we consume. Here are the narratives that shaped my perspective."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <StoryCategory icon={Book} title="Literature" items={stories.books} color="var(--gold)" />
          <StoryCategory icon={Film} title="Cinema" items={stories.films} color="#c084fc" />
          <StoryCategory icon={Tv} title="Anime" items={stories.anime} color="#f472b6" />
        </div>
      </div>
    </section>
  );
};

interface StoryCategoryProps {
  icon: React.ElementType;
  title: string;
  items: Array<{ title: string; author?: string; director?: string; quote: string }>;
  color: string;
}

const StoryCategory = ({ icon: Icon, title, items, color }: StoryCategoryProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <Icon className="w-6 h-6" style={{ color }} />
        <h3 className="font-serif text-2xl text-white drop-shadow-lg">{title}</h3>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-6 border-l-2 border-white/10 hover:border-[color] transition-colors duration-300"
            style={{ '--hover-color': color } as React.CSSProperties}
          >
            <h4 className="font-serif text-lg text-white group-hover:text-[var(--gold)] transition-colors mb-1 drop-shadow-md">
              {item.title}
            </h4>
            {(item.author || item.director) && (
              <p className="font-mono text-xs text-white/40 mb-3">
                {item.author || item.director}
              </p>
            )}
            <div className="relative">
              <Quote className="absolute -left-4 -top-2 w-4 h-4 text-white/10" />
              <p className="font-serif italic text-sm text-white/60 leading-relaxed pl-2">
                "{item.quote}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};