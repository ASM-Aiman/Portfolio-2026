import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Sun, Eye, ArrowRight, Info, ChevronDown } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  size: number;
  scattered: boolean;
  color: string;
  delay: number;
}

export const SkyPhysics = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sunAngle, setSunAngle] = useState(90); // 90 = zenith (noon), 0 = horizon
  const [showRays, setShowRays] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [scatteringMode, setScatteringMode] = useState<'rayleigh' | 'mie'>('rayleigh');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth sun position based on scroll
  const smoothAngle = useSpring(
    useTransform(scrollYProgress, [0, 1], [90, 0]),
    { stiffness: 50, damping: 20 }
  );

  useEffect(() => {
    const unsubscribe = smoothAngle.on("change", (latest) => {
      setSunAngle(latest);
    });
    return () => unsubscribe();
  }, [smoothAngle]);

  // Physics calculations
  const physics = useMemo(() => {
    const angleRad = (sunAngle * Math.PI) / 180;
    const pathLength = 1 / Math.sin(angleRad + 0.05); // Atmospheric path length
    const scatteringIntensity = Math.min(pathLength * 1.5, 15);
    
    // Color calculations based on scattering
    let skyTop, skyBottom, sunColor, atmosphereColor;
    
    if (sunAngle > 60) {
      // Noon - Deep Blue
      skyTop = [25, 60, 120];
      skyBottom = [100, 160, 255];
      sunColor = [255, 255, 240];
      atmosphereColor = [100, 160, 255];
    } else if (sunAngle > 30) {
      // Afternoon - Transition
      const t = (sunAngle - 30) / 30;
      skyTop = [
        25 + (80 - 25) * (1 - t),
        60 + (60 - 60) * (1 - t),
        120 + (40 - 120) * (1 - t)
      ];
      skyBottom = [
        100 + (255 - 100) * (1 - t),
        160 + (140 - 160) * (1 - t),
        255 + (80 - 255) * (1 - t)
      ];
      sunColor = [255, 255 - (1 - t) * 100, 240 - (1 - t) * 160];
      atmosphereColor = [255, 180, 100];
    } else if (sunAngle > 10) {
      // Sunset - Golden/Red
      const t = (sunAngle - 10) / 20;
      skyTop = [
        80 + (120 - 80) * t,
        60 + (40 - 60) * t,
        40 + (60 - 40) * t
      ];
      skyBottom = [
        255,
        140 + (80 - 140) * (1 - t),
        80 + (60 - 80) * (1 - t)
      ];
      sunColor = [255, 155 + 100 * t, 80 + 160 * t];
      atmosphereColor = [255, 120, 60];
    } else {
      // Twilight - Deep Purple/Red
      const t = sunAngle / 10;
      skyTop = [
        120 - 60 * (1 - t),
        40 - 20 * (1 - t),
        60 + 20 * (1 - t)
      ];
      skyBottom = [
        255 - 100 * (1 - t),
        80 - 40 * (1 - t),
        60
      ];
      sunColor = [255, 100 + 55 * t, 80 + 75 * t];
      atmosphereColor = [180, 80, 100];
    }

    return {
      pathLength,
      scatteringIntensity,
      skyTop: `rgb(${skyTop.join(',')})`,
      skyBottom: `rgb(${skyBottom.join(',')})`,
      sunColor: `rgb(${sunColor.join(',')})`,
      atmosphereColor,
      blueScattered: Math.max(5, 100 - scatteringIntensity * 8),
      redSurviving: Math.min(95, 20 + scatteringIntensity * 5)
    };
  }, [sunAngle]);

  // Canvas animation for light rays and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let time = 0;

    // Create atmospheric particles
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7, // Only in sky area
        size: 2 + Math.random() * 3,
        scattered: false,
        color: 'rgba(255,255,255,0.3)',
        delay: Math.random() * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      const sunX = width * 0.5;
      const sunY = height - (sunAngle / 90) * height * 0.8;

      // Draw light rays from sun
      if (showRays) {
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
          const angle = -Math.PI / 2 + (i - rayCount / 2) * 0.15;
          const rayLength = height * 1.2;
          
          const gradient = ctx.createLinearGradient(sunX, sunY, 
            sunX + Math.cos(angle) * rayLength,
            sunY + Math.sin(angle) * rayLength
          );
          
          gradient.addColorStop(0, `rgba(255, 255, 200, ${0.3 - physics.scatteringIntensity * 0.01})`);
          gradient.addColorStop(0.5, `rgba(255, 200, 150, ${0.1 - physics.scatteringIntensity * 0.005})`);
          gradient.addColorStop(1, 'rgba(255, 150, 100, 0)');

          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(
            sunX + Math.cos(angle) * rayLength,
            sunY + Math.sin(angle) * rayLength
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw and animate particles
      particles.forEach((p, i) => {
        const dx = p.x - sunX;
        const dy = p.y - sunY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Calculate scattering based on angle and distance
        const pathThroughAtmosphere = dist / (sunAngle / 90 + 0.1);
        const scatterProbability = Math.min(1, pathThroughAtmosphere / 300);
        
        // Animate scattering
        const scatterPhase = (time + p.delay) % 3;
        const isScattering = scatterPhase < 1.5;
        
        // Particle color based on scattering
        if (isScattering) {
          // Blue light scatters first (Rayleigh scattering)
          const blueIntensity = Math.min(1, physics.scatteringIntensity / 5);
          p.color = `rgba(${100 + 155 * blueIntensity}, ${160 + 40 * blueIntensity}, 255, ${0.4 + scatterPhase * 0.3})`;
        } else {
          // Red light passes through
          const redIntensity = Math.min(1, physics.scatteringIntensity / 8);
          p.color = `rgba(255, ${200 - redIntensity * 100}, ${150 - redIntensity * 80}, 0.3)`;
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + scatterPhase * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw scattered light halo
        if (isScattering && showRays) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          const haloGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          haloGradient.addColorStop(0, p.color.replace('0.4', '0.2'));
          haloGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = haloGradient;
          ctx.fill();
        }
      });

      // Draw sun
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 40);
      sunGradient.addColorStop(0, physics.sunColor);
      sunGradient.addColorStop(0.5, physics.sunColor.replace(')', ', 0.5)'));
      sunGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      ctx.fillStyle = sunGradient;
      ctx.fill();

      // Draw observer
      const observerX = width * 0.8;
      const observerY = height * 0.85;
      
      // Observer's view cone
      const viewGradient = ctx.createRadialGradient(observerX, observerY - 20, 0, observerX, observerY - 20, 100);
      viewGradient.addColorStop(0, `rgba(${physics.atmosphereColor.join(',')}, 0.3)`);
      viewGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.moveTo(observerX, observerY - 20);
      ctx.lineTo(observerX - 60, observerY - 120);
      ctx.lineTo(observerX + 60, observerY - 120);
      ctx.closePath();
      ctx.fillStyle = viewGradient;
      ctx.fill();

      // Observer figure
      ctx.fillStyle = '#1a1c23';
      ctx.beginPath();
      ctx.arc(observerX, observerY - 30, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(observerX - 6, observerY - 22, 12, 25);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [sunAngle, showRays, physics]);

  const getExplanation = () => {
    if (sunAngle > 60) return {
      title: "Noon: The Blue Dome",
      phenomenon: "Rayleigh Scattering Dominates",
      description: "Sunlight travels through the thinnest atmospheric path. Blue light (450nm) scatters in all directions, filling your vision from every angle.",
      detail: "The sky appears blue because blue photons have short wavelengths that interact with nitrogen and oxygen molecules, bouncing around like pinballs until they reach your eyes.",
      wavelength: "450nm",
      color: "Blue"
    };
    if (sunAngle > 30) return {
      title: "Afternoon: The Golden Transition",
      phenomenon: "Increased Path Length",
      description: "As the sun descends, light travels through more atmosphere. Some blue light scatters away, allowing yellows and oranges to emerge.",
      detail: "The optical path length increases, causing more scattering events. Blue photons are deflected completely out of the direct beam.",
      wavelength: "550-600nm",
      color: "Yellow-Orange"
    };
    if (sunAngle > 10) return {
      title: "Sunset: The Crimson Hour",
      phenomenon: "Maximum Scattering",
      description: "Light travels through 38x more atmosphere than at noon. All blue and green light scatters away. Only red survives the journey.",
      detail: "The sun appears red because all shorter wavelengths have been scattered out. The scattered blue light still reaches you from other sky regions, but much weaker.",
      wavelength: "650-700nm",
      color: "Red"
    };
    return {
      title: "Twilight: The Shadow of Earth",
      phenomenon: "Refraction & Multiple Scattering",
      description: "The sun is near or below the horizon. Light refracts through Earth's curve. Blue light scatters, then scatters again from high dust.",
      detail: "The 'Belt of Venus' appears - pink light reflecting off high clouds, while Earth's shadow creates the deep blue-purple band below.",
      wavelength: "400-700nm (diffuse)",
      color: "Purple-Pink"
    };
  };

  const explanation = getExplanation();

  return (
    <section ref={containerRef} id="atmosphere" className="relative min-h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dynamic Sky Background */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${physics.skyTop}, ${physics.skyBottom})`
          }}
        />

        {/* Main Visualization Canvas */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Header */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
            <div>
              <motion.h2 
                className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                Why the Sky Burns
              </motion.h2>
              <p className="font-serif italic text-white/80 text-lg max-w-md drop-shadow-md">
                {explanation.title}
              </p>
            </div>
            
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="pointer-events-auto p-3 bg-black/30 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              <Info className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
            animate={{ opacity: sunAngle < 5 ? 0 : 1 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest">Scroll to change time</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>

          {/* Scientific Explanation Panel */}
          <motion.div
            initial={false}
            animate={{ 
              x: showExplanation ? 0 : '100%',
              opacity: showExplanation ? 1 : 0
            }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-black/60 backdrop-blur-xl border-l border-white/10 p-8 pointer-events-auto overflow-y-auto"
          >
            <div className="space-y-8 pt-20">
              {/* Current State */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[var(--gold)]">
                  <Sun className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-widest">
                    Solar Altitude: {sunAngle.toFixed(1)}°
                  </span>
                </div>
                
                <h3 className="text-3xl font-serif text-white">{explanation.phenomenon}</h3>
                <p className="font-serif text-lg text-white/80 leading-relaxed">
                  {explanation.description}
                </p>
              </div>

              {/* Wavelength Visualization */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-mono text-xs text-[var(--gold)] uppercase tracking-widest mb-4">
                  Light Spectrum Analysis
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Blue Light Scattered</span>
                      <span>{physics.blueScattered.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        animate={{ width: `${physics.blueScattered}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Red Light Reaching Observer</span>
                      <span>{physics.redSurviving.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                        animate={{ width: `${physics.redSurviving}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-2 shadow-lg shadow-blue-500/30" />
                      <span className="text-[10px] text-white/40 font-mono">450nm</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20" />
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-600 mb-2 shadow-lg shadow-orange-500/30" />
                      <span className="text-[10px] text-white/40 font-mono">{explanation.wavelength}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs text-[var(--gold)] uppercase tracking-widest">
                  The Physics
                </h4>
                <p className="font-serif text-sm text-white/70 leading-relaxed">
                  {explanation.detail}
                </p>
              </div>

              {/* Atmospheric Path */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-mono text-xs text-[var(--gold)] uppercase tracking-widest mb-4">
                  Atmospheric Path Length
                </h4>
                <div className="flex items-end gap-2 h-32">
                  {[1, 2, 5, 10, 15, 20, 30, 38].map((factor, i) => {
                    const active = physics.pathLength >= factor;
                    return (
                      <div key={factor} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div 
                          className={`w-full rounded-t transition-colors duration-500 ${
                            active ? 'bg-[var(--gold)]' : 'bg-white/10'
                          }`}
                          style={{ height: `${(factor / 38) * 100}%` }}
                        />
                        <span className={`text-[10px] font-mono ${active ? 'text-[var(--gold)]' : 'text-white/30'}`}>
                          {factor}x
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-white/40 mt-2 font-mono">
                  Current: {physics.pathLength.toFixed(1)}x atmospheric thickness
                </p>
              </div>

              {/* Toggle Controls */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRays(!showRays)}
                  className={`flex-1 py-3 px-4 border rounded font-mono text-xs uppercase tracking-widest transition-colors ${
                    showRays 
                      ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10' 
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {showRays ? 'Hide Light Rays' : 'Show Light Rays'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Observer Indicator */}
          <div className="absolute bottom-32 right-32 hidden lg:block">
            <motion.div 
              className="flex items-center gap-3 text-white/60 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs">Observer's View</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};