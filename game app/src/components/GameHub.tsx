import React from 'react';
import { motion } from 'motion/react';
import { ChildProfile, GameType } from '../types/math';
import { MascotBuddy } from './MascotBuddy';
import { sound } from '../utils/soundEffects';
import { Sparkles, Play, Flame, Star, Trophy } from 'lucide-react';

interface GameHubProps {
  profile: ChildProfile;
  onSelectGame: (game: GameType) => void;
  onOpenBadges: () => void;
  onOpenShop: () => void;
}

interface GameCardDef {
  type: GameType;
  title: string;
  tagline: string;
  emoji: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  skillKey: 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns';
}

const GAMES: GameCardDef[] = [
  {
    type: 'counting',
    title: 'Safari Counting',
    tagline: 'Tap and count playful animals & stars!',
    emoji: '🦁',
    accentBg: 'from-amber-400/20 to-orange-400/10',
    accentBorder: 'border-amber-300 hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-900',
    skillKey: 'counting',
  },
  {
    type: 'addition',
    title: 'Balloon Pop Addition',
    tagline: 'Combine colorful groups and pop the sums!',
    emoji: '🎈',
    accentBg: 'from-sky-400/20 to-blue-400/10',
    accentBorder: 'border-sky-300 hover:border-sky-400',
    badgeBg: 'bg-sky-100 text-sky-900',
    skillKey: 'addition',
  },
  {
    type: 'subtraction',
    title: 'Hungry Dino',
    tagline: 'Feed Dino snacks and see what is left!',
    emoji: '🦕',
    accentBg: 'from-emerald-400/20 to-teal-400/10',
    accentBorder: 'border-emerald-300 hover:border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-900',
    skillKey: 'subtraction',
  },
  {
    type: 'comparison',
    title: 'Balance Scale',
    tagline: 'Seesaw comparison with >, =, and < signs!',
    emoji: '⚖️',
    accentBg: 'from-purple-400/20 to-indigo-400/10',
    accentBorder: 'border-purple-300 hover:border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-900',
    skillKey: 'comparison',
  },
  {
    type: 'patterns',
    title: 'Mystery Train',
    tagline: 'Connect missing numbers on the train tracks!',
    emoji: '🚂',
    accentBg: 'from-rose-400/20 to-pink-400/10',
    accentBorder: 'border-rose-300 hover:border-rose-400',
    badgeBg: 'bg-rose-100 text-rose-900',
    skillKey: 'patterns',
  },
  {
    type: 'sprint',
    title: 'Star Sprint ⚡',
    tagline: '45-second lightning round with 2x stars!',
    emoji: '⚡',
    accentBg: 'from-yellow-400/30 to-amber-500/20',
    accentBorder: 'border-yellow-400 hover:border-amber-500',
    badgeBg: 'bg-amber-200 text-amber-950 font-black',
    skillKey: 'addition',
  },
];

export const GameHub: React.FC<GameHubProps> = ({
  profile,
  onSelectGame,
  onOpenBadges,
  onOpenShop,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Playful Hero Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 md:p-8 text-white cartoon-shadow mb-8 relative overflow-hidden">
        {/* Floating clouds/sparkles in background */}
        <div className="absolute top-2 right-4 text-3xl opacity-30 select-none">☁️</div>
        <div className="absolute bottom-2 right-32 text-4xl opacity-30 select-none">☁️</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-950 font-black text-xs uppercase tracking-wider bg-white/30 backdrop-blur-xs px-3 py-1 rounded-full w-fit mx-auto md:mx-0 mb-2">
              <Sparkles className="w-4 h-4 fill-amber-950" />
              <span>Let&apos;s Learn Math!</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {getGreeting()}, {profile.name}! 🌟
            </h1>
            <p className="text-amber-100 font-semibold text-sm md:text-base mt-1 max-w-md">
              Choose an adventure below to earn stars, win shiny trophies, and unlock awesome buddy costumes!
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-200 text-amber-200" />
                <span>{profile.stars} Stars collected</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold">
                <Trophy className="w-4 h-4 text-amber-200" />
                <span>{profile.badges.filter(b => b.unlocked).length} Badges won</span>
              </div>
            </div>
          </div>

          {/* Interactive Mascot on right */}
          <div className="flex flex-col items-center">
            <MascotBuddy
              mascotId={profile.mascot}
              accessoryId={profile.equippedAccessory}
              speechText={`Ready to play, ${profile.name}?`}
              size="lg"
              isExcited={true}
            />
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            Choose Your Math Game
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Interactive, colorful activities tuned to your learning pace
          </p>
        </div>
        <div className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
          Mode: {profile.difficultyMode === 'adaptive' ? 'Adaptive Auto-Tune' : profile.difficultyMode.toUpperCase()}
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((game) => {
          const score = profile.skillProficiency[game.skillKey] || 15;

          return (
            <motion.div
              key={game.type}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onSelectGame(game.type);
              }}
              className={`bg-white rounded-3xl p-5 border-3 transition-all cursor-pointer cartoon-shadow flex flex-col justify-between ${game.accentBorder} group relative overflow-hidden`}
            >
              {/* Subtle gradient background inside */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.accentBg} pointer-events-none opacity-60`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {game.emoji}
                  </div>
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl shadow-2xs ${game.badgeBg}`}>
                    {game.type === 'sprint' ? 'Bonus Stars' : `Mastery: ${score}%`}
                  </span>
                </div>

                <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                  {game.tagline}
                </p>
              </div>

              {/* Bottom Play Action */}
              <div className="relative z-10 mt-5 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {game.type === 'sprint' ? 'Lightning Mode' : 'Step-by-step'}
                </span>
                <div className="flex items-center gap-1 bg-amber-400 group-hover:bg-amber-500 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors">
                  <span>Play</span>
                  <Play className="w-3.5 h-3.5 fill-amber-950" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
