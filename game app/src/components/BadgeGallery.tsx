import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge, ChildProfile } from '../types/math';
import { sound } from '../utils/soundEffects';
import { Trophy, CheckCircle, Lock, Sparkles, Filter } from 'lucide-react';

interface BadgeGalleryProps {
  profile: ChildProfile;
  onClose?: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ profile, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'milestone' | 'streak' | 'mastery' | 'explorer'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = profile.badges.filter(b => {
    if (filter === 'all') return true;
    return b.category === filter;
  });

  const unlockedCount = profile.badges.filter(b => b.unlocked).length;
  const totalCount = profile.badges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const handleBadgeClick = (badge: Badge) => {
    sound.playClick();
    setSelectedBadge(badge);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 rounded-3xl p-6 md:p-8 text-white cartoon-shadow mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-950 font-black text-xs uppercase tracking-wider bg-white/30 backdrop-blur-xs px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              <Trophy className="w-4 h-4 fill-amber-950" />
              <span>Hall of Trophies</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
              {profile.name}&apos;s Badges
            </h1>
            <p className="text-amber-100 font-semibold text-sm mt-1">
              Collect shiny badges by solving problems, beating streaks, and exploring!
            </p>
          </div>

          {/* Progress ring/box */}
          <div className="bg-white/95 rounded-2xl p-4 text-slate-800 shadow-md min-w-[160px] text-center border-2 border-white/60">
            <div className="text-3xl font-black text-amber-600">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5">Badges Unlocked</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-x-auto">
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'milestone', label: 'Milestones' },
          { id: 'streak', label: 'Streaks' },
          { id: 'mastery', label: 'Skill Masters' },
          { id: 'explorer', label: 'Special' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setFilter(tab.id as any);
            }}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleBadgeClick(badge)}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center cursor-pointer transition-all relative select-none ${
                badge.unlocked
                  ? 'bg-white border-amber-300 shadow-sm hover:shadow-md'
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Badge Icon circle */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner relative ${
                badge.unlocked
                  ? 'bg-gradient-to-tr from-amber-100 to-orange-100 border-2 border-amber-300'
                  : 'bg-slate-200 border-2 border-slate-300 grayscale'
              }`}>
                <span>{badge.icon}</span>
                {badge.unlocked ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 fill-white absolute -top-1.5 -right-1.5" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 absolute -top-1.5 -right-1.5" />
                )}
              </div>

              <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1">
                {badge.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {badge.description}
              </p>

              <div className="mt-3 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg w-full truncate">
                {badge.unlocked ? 'Unlocked! ⭐' : badge.criteriaText}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-3 border-amber-300 cartoon-shadow text-center relative"
            >
              <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-4 shadow-sm ${
                selectedBadge.unlocked
                  ? 'bg-gradient-to-tr from-amber-200 to-orange-200 border-3 border-amber-400'
                  : 'bg-slate-100 border-2 border-slate-300'
              }`}>
                {selectedBadge.icon}
              </div>

              <h2 className="text-2xl font-black text-slate-800">{selectedBadge.title}</h2>
              <p className="text-sm font-semibold text-slate-600 mt-2">
                {selectedBadge.description}
              </p>

              <div className="my-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-700">
                <div className="font-bold text-amber-900 mb-0.5">How to unlock:</div>
                <div>{selectedBadge.criteriaText}</div>
                {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                  <div className="mt-2 text-[10px] text-slate-600">
                    Earned: {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl cartoon-button cursor-pointer"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
