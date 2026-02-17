// import { motion } from 'framer-motion';
// import { Planet } from '../../lib/constants';

// interface PlanetCardProps {
//   planet: Planet;
//   isSelected: boolean;
//   onClick: () => void;
// }

// export const PlanetCard = ({ planet, isSelected, onClick }: PlanetCardProps) => {
//   return (
//     <motion.button
//       onClick={onClick}
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       className={`relative w-full p-4 text-left border transition-all duration-300 ${
//         isSelected 
//           ? 'border-[var(--gold)] bg-[var(--gold)]/5' 
//           : 'border-[var(--gold)]/10 hover:border-[var(--gold)]/30 bg-transparent'
//       }`}
//     >
//       {/* Planet Color Indicator */}
//       <div 
//         className="absolute top-4 right-4 w-3 h-3 rounded-full shadow-lg"
//         style={{ backgroundColor: planet.color, boxShadow: `0 0 10px ${planet.color}` }}
//       />
      
//       <span className={`font-serif text-sm block mb-1 ${isSelected ? 'text-[var(--gold)]' : 'text-[var(--parchment)]'}`}>
//         {planet.name}
//       </span>
//       <span className="font-mono text-[10px] text-[var(--parchment)]/40">
//         {planet.gravity}g
//       </span>

//       {/* Selection Glow */}
//       {isSelected && (
//         <motion.div
//           layoutId="planetGlow"
//           className="absolute inset-0 border border-[var(--gold)]/50"
//           initial={false}
//           transition={{ type: "spring", stiffness: 500, damping: 30 }}
//         />
//       )}
//     </motion.button>
//   );
// };