// ============================================================================
// PLANETARY DATA
// ============================================================================

export interface Planet {
  name: string;
  gravity: number;
  color: string;
  poetry: string;
  science: string;
}

export const planets: Planet[] = [
  {
    name: "Mercury",
    gravity: 0.38,
    color: "#A5A5A5",
    poetry: "On Mercury, gravity loosens its grip — and you rise lighter, almost hopeful, yet scorched by the proximity to the sun.",
    science: "Smallest planet, closest to the Sun. No atmosphere to retain heat."
  },
  {
    name: "Venus",
    gravity: 0.90,
    color: "#E3BB76",
    poetry: "The Morning Star holds you close, a dense, toxic embrace that feels deceptively like home.",
    science: "Thick atmosphere of CO2 creates a runaway greenhouse effect."
  },
  {
    name: "Earth",
    gravity: 1.00,
    color: "#4F86F7",
    poetry: "The baseline. The cradle. The only place where falling in love feels exactly like 9.8 m/s².",
    science: "Perfect distance from the Sun for liquid water and life."
  },
  {
    name: "Mars",
    gravity: 0.38,
    color: "#FF6B6B",
    poetry: "The Red Planet. You are light enough to leap, heavy enough to stay grounded in the dust.",
    science: "Home to Olympus Mons, the largest volcano in the solar system."
  },
  {
    name: "Jupiter",
    gravity: 2.53,
    color: "#D4A373",
    poetry: "Here, you are crushed by majesty. The weight of a thousand storms presses upon your shoulders.",
    science: "Gas giant with a mass greater than all other planets combined."
  },
  {
    name: "Saturn",
    gravity: 1.07,
    color: "#F4E4BC",
    poetry: "Surprisingly gentle for its size. You float in the rings' shadow, heavy but serene.",
    science: "Less dense than water. Famous for its prominent ring system."
  },
  {
    name: "Uranus",
    gravity: 0.89,
    color: "#7DE3F4",
    poetry: "Tilted on its side, the ice giant offers a cold, blue reprieve from earthly burdens.",
    science: "Rotates on its side. Composed mainly of ices."
  },
  {
    name: "Neptune",
    gravity: 1.14,
    color: "#3B5CC9",
    poetry: "The winds here are supersonic, and your weight increases slightly in the deep blue dark.",
    science: "Farthest planet. Winds reach speeds of 2,100 km/h."
  }
];

// ============================================================================
// TECHNOLOGY STACK DATA
// ============================================================================

export interface TechItem {
  name: string;
  description: string;
}

export interface TechStack {
  frontend: TechItem[];
  backend: TechItem[];
  database: TechItem[];
  messaging: TechItem[];
  integration: TechItem[];
  devops: TechItem[];
  ml: TechItem[];
}

export const techStack: TechStack = {
  frontend: [
    { name: "React", description: "Forging reactive interfaces with disciplined elegance." },
    { name: "TypeScript", description: "Imposing order upon the chaos of JavaScript." },
    { name: "TailwindCSS", description: "Utility-first styling for rapid, surgical design." },
    { name: "Electron", description: "Bridging the web and desktop realms." }
  ],
  backend: [
    { name: "Java", description: "The sturdy bedrock of enterprise logic." },
    { name: "Spring Boot", description: "Forging RESTful architectures with minimal configuration." },
    { name: "Python", description: "The lingua franca of data and automation." },
    { name: "Node.js", description: "Asynchronous I/O for high-concurrency spells." }
  ],
  database: [
    { name: "PostgreSQL", description: "The reliable relational tome of structured data." },
    { name: "MongoDB", description: "Schemaless flexibility for evolving documents." },
    { name: "Redis", description: "In-memory velocity for transient states." },
    { name: "SQL", description: "The ancient language of structured queries." }
  ],
  messaging: [
    { name: "Kafka", description: "Distributed streaming for high-throughput events." },
    { name: "RabbitMQ", description: "Robust message brokering for complex workflows." }
  ],
  integration: [
    { name: "WSO2 MI", description: "Orchestrating the mediation of enterprise messages." },
    { name: "WSO2 APIM", description: "Governing the gateways to digital assets." },
    { name: "WSO2 IAM", description: "Securing the identity of every wandering soul." }
  ],
  devops: [
    { name: "Jenkins", description: "Automating the ritual of continuous delivery." },
    { name: "Nexus", description: "Curating the artifacts of our labor." },
    { name: "Docker", description: "Encapsulating environments in portable vessels." }
  ],
  ml: [
    { name: "Random Forest", description: "Ensemble learning through democratic decision trees." },
    { name: "Scikit-Learn", description: "The toolkit for predictive alchemy." }
  ]
};

// ============================================================================
// STORIES DATA (Books, Films, Anime)
// ============================================================================

export interface StoryItem {
  title: string;
  quote: string;
  author?: string;
  director?: string;
}

export interface StoriesCollection {
  books: StoryItem[];
  films: StoryItem[];
  anime: StoryItem[];
}

export const stories: StoriesCollection = {
  books: [
    { 
      title: "The Name of the Rose", 
      author: "Umberto Eco", 
      quote: "The book is a fragile creature, it suffers the wear of time, it fears rodents, the elements, clumsy hands." 
    },
    { 
      title: "Dune", 
      author: "Frank Herbert", 
      quote: "I must not fear. Fear is the mind-killer." 
    },
    { 
      title: "Norwegian Wood", 
      author: "Haruki Murakami", 
      quote: "Death is not the opposite of life, but a part of it." 
    },
    { 
      title: "The Design of Everyday Things", 
      author: "Don Norman", 
      quote: "Good design is actually a lot harder to notice than poor design." 
    }
  ],
  films: [
    { 
      title: "Blade Runner 2049", 
      director: "Denis Villeneuve", 
      quote: "You look lonely. I can fix that." 
    },
    { 
      title: "Dead Poets Society", 
      director: "Peter Weir", 
      quote: "We don't read and write poetry because it's cute. We read and write poetry because we are members of the" 
    },
    { 
      title: "Midnight in Paris", 
      director: "Woody Allen", 
      quote: "The past is not dead. Actually, it's not even past." 
    },
    { 
      title: "Pirates of the Caribbean", 
      director: "Gore Verbinski", 
      quote: "Not all treasure is silver and gold, mate." 
    }
  ],
  anime: [
    { 
      title: "One Piece", 
      quote: "As long as im alive, There are infinite chances." 
    },
    { 
      title: "Monster", 
      quote: "The only thing humans are equal in is death." 
    },
    { 
      title: "Vinland Saga", 
      quote: "You have no enemies" 
    },
    { 
      title: "My hero Academia", 
      quote: "You can become a hero too." 
    }
  ]
};

// ============================================================================
// NAVIGATION & UI CONSTANTS
// ============================================================================

export const navItems = [
  { id: 'entrance', label: 'Entrance' },
  { id: 'cosmos', label: 'Cosmos' },
  { id: 'atmosphere', label: 'Atmosphere' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'stories', label: 'Stories' }
] as const;

export type NavItem = typeof navItems[number];

// ============================================================================
// ANIMATION CONFIGURATIONS
// ============================================================================

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};