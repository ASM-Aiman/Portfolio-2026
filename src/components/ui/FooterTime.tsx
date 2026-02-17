// components/ui/FooterTime.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const celestialBodies = [
  { name: 'Earth', offset: 0, color: '#4F86F7', abbr: 'CMB' },
  { name: 'Moon', offset: 0, color: '#C0C0C0', abbr: 'LUN' }, // Same timezone for display
];

export const FooterTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Colombo',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <Clock className="w-3 h-3 text-[var(--gold)]" />
      {celestialBodies.map((body) => (
        <div key={body.name} className="flex items-center gap-1">
          <span style={{ color: body.color }}>●</span>
          <span className="text-[var(--parchment)]/60">{body.abbr}</span>
          <span className="text-[var(--parchment)]">{formatTime(time)}</span>
        </div>
      ))}
    </div>
  );
};