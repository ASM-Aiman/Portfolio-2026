// import { useEffect, useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import { MapPin } from 'lucide-react';

// import type { Map as LeafletMap } from 'leaflet';

// export const LocationMap = () => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<LeafletMap | null>(null);
//   const [L, setL] = useState<typeof import('leaflet') | null>(null);

//   useEffect(() => {
//     import('leaflet').then((leaflet) => {
//       setL(leaflet);
//     });
//   }, []);

//   useEffect(() => {
//     if (!L || !mapRef.current || mapInstanceRef.current) return;

//     const lat = 6.9271;
//     const lng = 79.8612;

//     const map = L.map(mapRef.current, {
//       center: [lat, lng],
//       zoom: 15,
//       zoomControl: true,
//       attributionControl: false,
//       scrollWheelZoom: true,
//       dragging: true,
//       doubleClickZoom: true,
//       boxZoom: true,
//     });

//     // Light/transparent tiles - CartoDB Positron (light theme)
//     L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//       maxZoom: 20,
//       subdomains: 'abcd',
//     }).addTo(map);

//     // Golden marker
//     const goldIcon = L.divIcon({
//       className: 'custom-gold-marker',
//       html: `
//         <div style="
//           width: 36px;
//           height: 36px;
//           background: radial-gradient(circle at 30% 30%, #e8d5a8 0%, #c5a059 50%, #8b6d3b 100%);
//           border-radius: 50% 50% 50% 0;
//           transform: rotate(-45deg);
//           box-shadow: 0 0 20px #c5a059, 0 0 40px rgba(197, 160, 89, 0.6);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border: 2px solid #fff;
//         ">
//           <span style="
//             transform: rotate(45deg);
//             color: #0a0c10;
//             font-size: 16px;
//           ">⚗️</span>
//         </div>
//       `,
//       iconSize: [36, 36],
//       iconAnchor: [18, 36],
//     });

//     L.marker([lat, lng], { icon: goldIcon }).addTo(map);

//     // Golden pulse circle
//     L.circle([lat, lng], {
//       color: '#c5a059',
//       fillColor: '#c5a059',
//       fillOpacity: 0.15,
//       radius: 400,
//       weight: 2,
//     }).addTo(map);

//     // Label
//     const labelIcon = L.divIcon({
//       className: 'map-label',
//       html: `
//         <div style="
//           background: linear-gradient(135deg, rgba(197, 160, 89, 0.95), rgba(139, 109, 59, 0.95));
//           padding: 10px 20px;
//           border-radius: 6px;
//           color: #0a0c10;
//           font-family: 'Cinzel', serif;
//           font-size: 13px;
//           font-weight: 600;
//           text-align: center;
//           box-shadow: 0 8px 32px rgba(197, 160, 89, 0.4);
//           border: 1px solid rgba(255, 255, 255, 0.4);
//           white-space: nowrap;
//           letter-spacing: 0.5px;
//         ">
//           <div style="font-size: 10px; opacity: 0.8; margin-bottom: 3px; font-family: 'Space Mono', monospace;">THE OBSERVATORY</div>
//           <div>125 Vivian Gunawardhana Mawatha</div>
//         </div>
//       `,
//       iconSize: [280, 70],
//       iconAnchor: [140, -30],
//     });

//     L.marker([lat, lng], { icon: labelIcon, zIndexOffset: 1000 }).addTo(map);

//     mapInstanceRef.current = map;

//     return () => {
//       map.remove();
//       mapInstanceRef.current = null;
//     };
//   }, [L]);

//   if (!L) {
//     return (
//       <div className="w-full max-w-4xl mx-auto px-6">
//         <div className="h-[350px] bg-gray-100 rounded-lg flex items-center justify-center">
//           <span className="font-mono text-xs text-[var(--gold)]">Loading map...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       className="w-full max-w-4xl mx-auto px-6 mt-auto"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30">
//           <MapPin className="w-5 h-5 text-[var(--gold)]" />
//         </div>
//         <div>
//           <span className="font-mono text-xs text-[var(--gold)] uppercase tracking-[0.3em] block">
//             Geographical Anchor
//           </span>
//           <span className="font-serif text-sm text-gray-600 italic">
//             6.9271° N, 79.8612° E
//           </span>
//         </div>
//       </div>

//       {/* Clean frame - no gradient background */}
//       <div className="relative rounded-xl overflow-hidden border-2 border-[var(--gold)]/40 shadow-2xl">
//         {/* Map container - transparent background */}
//         <div 
//           ref={mapRef}
//           className="w-full h-[350px] md:h-[450px] bg-white"
//         />

//         {/* Corner accents */}
//         <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--gold)]/60 rounded-tl-lg pointer-events-none" />
//         <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--gold)]/60 rounded-tr-lg pointer-events-none" />
//         <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--gold)]/60 rounded-bl-lg pointer-events-none" />
//         <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--gold)]/60 rounded-br-lg pointer-events-none" />

//         {/* Coordinates bar */}
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/90 backdrop-blur-sm border border-[var(--gold)]/40 rounded-full shadow-lg">
//           <p className="font-mono text-xs text-[var(--gold)] tracking-[0.2em]">
//             COLOMBO • SRI LANKA • INDIAN OCEAN
//           </p>
//         </div>
//       </div>

//       {/* Description */}
//       <motion.p 
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.3 }}
//         className="mt-6 font-serif italic text-gray-500 text-center text-sm leading-relaxed"
//       >
//         "Where the alchemist observes the convergence of sea and sky, 
//         plotting celestial mechanics from the edge of the Indian Ocean."
//       </motion.p>

//       <style>{`
//         .leaflet-container {
//           background: transparent !important;
//           font-family: inherit;
//         }
//         .custom-gold-marker {
//           animation: markerPulse 2s ease-in-out infinite;
//         }
//         @keyframes markerPulse {
//           0%, 100% { transform: rotate(-45deg) scale(1); }
//           50% { transform: rotate(-45deg) scale(1.1); }
//         }
//         .leaflet-control-zoom {
//           border: none !important;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
//         }
//         .leaflet-control-zoom a {
//           background: white !important;
//           color: var(--gold) !important;
//           border: 1px solid var(--gold) !important;
//           width: 32px !important;
//           height: 32px !important;
//           line-height: 32px !important;
//           font-size: 18px !important;
//           transition: all 0.2s ease;
//         }
//         .leaflet-control-zoom a:hover {
//           background: var(--gold) !important;
//           color: white !important;
//         }
//       `}</style>
//     </motion.div>
//   );
// };