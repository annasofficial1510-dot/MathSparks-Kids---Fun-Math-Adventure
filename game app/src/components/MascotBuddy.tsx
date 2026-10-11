import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotId, AccessoryId } from '../types/math';
import { MASCOTS_INFO, ACCESSORIES_CATALOG } from '../services/storage';
import { sound } from '../utils/soundEffects';

interface MascotBuddyProps {
  mascotId: MascotId;
  accessoryId: AccessoryId;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  isExcited?: boolean;
  onTap?: () => void;
}

export const MascotBuddy: React.FC<MascotBuddyProps> = ({
  mascotId,
  accessoryId,
  speechText,
  size = 'md',
  isExcited = false,
  onTap,
}) => {
  const [localBubble, setLocalBubble] = useState<string | null>(null);
  const info = MASCOTS_INFO[mascotId] || MASCOTS_INFO.lion;
  const accessory = ACCESSORIES_CATALOG.find(a => a.id === accessoryId);

  const getMascotFace = (id: MascotId) => {
    switch (id) {
      case 'lion': return '🦁';
      case 'bunny': return '🐰';
      case 'robot': return '🤖';
      case 'unicorn': return '🦄';
      case 'bear': return '🐻';
      default: return '🦁';
    }
  };

  const handleMascotClick = () => {
    sound.playPop();
    const greetings = [
      "You're doing fantastic!",
      "Math is awesome with you!",
      "High five, superstar! ⭐",
      "Look at you go!",
      "I believe in you!",
    ];
    const pick = greetings[Math.floor(Math.random() * greetings.length)];
    setLocalBubble(pick);
    setTimeout(() => setLocalBubble(null), 2500);
    if (onTap) onTap();
  };

  const displayText = speechText || localBubble;

  const sizeClasses = {
    sm: 'w-14 h-14 text-3xl',
    md: 'w-24 h-24 text-5xl',
    lg: 'w-36 h-36 text-7xl',
  };

  const accessorySizeClasses = {
    sm: 'text-xl -top-2',
    md: 'text-3xl -top-4',
    lg: 'text-5xl -top-7',
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Speech Bubble */}
      <AnimatePresence>
        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            className="absolute bottom-full mb-3 z-30 px-3 py-1.5 bg-white text-slate-800 rounded-2xl shadow-lg border-2 border-amber-300 font-bold text-xs md:text-sm whitespace-nowrap pointer-events-none"
          >
            {displayText}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-amber-300" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Base with animation */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92, rotate: -5 }}
        animate={isExcited ? {
          y: [0, -12, 0, -8, 0],
          rotate: [0, -5, 5, -3, 0],
          transition: { duration: 0.6, repeat: 1 }
        } : {}}
        onClick={handleMascotClick}
        className={`relative ${sizeClasses[size]} ${info.bg} rounded-3xl flex items-center justify-center cursor-pointer shadow-md border-3 border-white ring-2 ring-amber-200 select-none group`}
        title={`Click me! I am ${info.name}`}
      >
        {/* Accessory on Top (Hats) */}
        {accessory && accessory.category === 'hat' && accessory.id !== 'none' && (
          <motion.span
            animate={isExcited ? { rotate: [-10, 10, -10] } : {}}
            className={`absolute ${accessorySizeClasses[size]} z-20 pointer-events-none filter drop-shadow`}
          >
            {accessory.emoji}
          </motion.span>
        )}

        {/* Mascot Face */}
        <span className="filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105">
          {getMascotFace(mascotId)}
        </span>

        {/* Accessory on Face (Glasses) */}
        {accessory && accessory.category === 'glasses' && (
          <span className={`absolute inset-0 flex items-center justify-center text-2xl md:text-3xl z-20 pointer-events-none`}>
            {accessory.emoji}
          </span>
        )}

        {/* Accessory on Back (Cape) */}
        {accessory && accessory.category === 'cape' && (
          <span className="absolute -bottom-1 -right-2 text-2xl md:text-3xl z-10 pointer-events-none">
            {accessory.emoji}
          </span>
        )}
      </motion.div>

      {size !== 'sm' && (
        <span className="mt-1 text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
          {info.name}
        </span>
      )}
    </div>
  );
};
