// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowUp, Sunrise } from 'lucide-react';
// import { useScroll, useMotionValueEvent } from 'framer-motion';

// export const GoUpSunrise = () => {
//   const [showButton, setShowButton] = useState(false);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const { scrollYProgress } = useScroll();

//   useMotionValueEvent(scrollYProgress, "change", (latest) => {
//     setShowButton(latest > 0.3);
//   });

//   const scrollToSunrise = () => {
//     if (isScrolling) return;
//     setIsScrolling(true);

//     // Get current position
//     const start = window.scrollY;
//     const duration = 800; // 0.8 seconds for instant feel
//     const startTime = performance.now();

//     const animate = (currentTime: number) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Ease out quad for snappy feel
//       const ease = 1 - (1 - progress) * (1 - progress);
      
//       window.scrollTo(0, start * (1 - ease));
      
//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         setIsScrolling(false);
//       }
//     };

//     requestAnimationFrame(animate);
//   };

//   return (
//     <AnimatePresence>
//       {showButton && (
//         <motion.button
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           onClick={scrollToSunrise}
//           disabled={isScrolling}
//           className="fixed bottom-6 right-6 z-30 group"
//         >
//           <div className="relative">
//             <motion.div
//               className="absolute -inset-3 rounded-full blur-xl bg-[var(--gold)]/20"
//               animate={{ 
//                 scale: [1, 1.1, 1],
//                 opacity: [0.3, 0.5, 0.3],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
            
//             <div className="relative flex items-center gap-2 px-4 py-3 bg-transparent backdrop-blur-md border border-[var(--gold)]/50 rounded-full hover:bg-[var(--gold)]/20 transition-all">
//               <motion.div
//                 animate={{ y: isScrolling ? [0, -4, 0] : [0, -2, 0] }}
//                 transition={{ duration: isScrolling ? 0.5 : 1.5, repeat: Infinity }}
//               >
//                 {isScrolling ? (
//                   <Sunrise className="w-4 h-4 text-[var(--gold)]" />
//                 ) : (
//                   <ArrowUp className="w-4 h-4 text-[var(--gold)]" />
//                 )}
//               </motion.div>
              
//               <span className="font-mono text-xs text-[var(--gold)] uppercase tracking-wider">
//                 {isScrolling ? 'Rising...' : 'To Dawn'}
//               </span>
//             </div>
//           </div>
//         </motion.button>
//       )}
//     </AnimatePresence>
//   );
// };