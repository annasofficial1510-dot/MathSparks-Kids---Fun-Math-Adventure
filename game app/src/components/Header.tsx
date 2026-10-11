import React from 'react';
import { Sparkles, Trophy, ShoppingBag, ShieldCheck, Volume2, VolumeX, Flame } from 'lucide-react';
import { ChildProfile } from '../types/math';
import { MascotBuddy } from './MascotBuddy';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  profile: ChildProfile;
  currentTab: 'games' | 'badges' | 'shop' | 'parents';
  onSelectTab: (tab: 'games' | 'badges' | 'shop' | 'parents') => void;
  onToggleSound: () => void;
  onRequestParentZone: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentTab,
  onSelectTab,
  onToggleSound,
  onRequestParentZone,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Mascot Companion */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              sound.playClick();
              onSelectTab('games');
            }} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-amber-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                MathSparks
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Kids
              </span>
            </div>
          </div>

          {/* Mini Mascot */}
          <div className="hidden md:flex items-center ml-2 pl-3 border-l border-amber-100">
            <MascotBuddy
              mascotId={profile.mascot}
              accessoryId={profile.equippedAccessory}
              size="sm"
            />
            <div className="ml-2">
              <div className="text-xs font-black text-slate-700">{profile.name}</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                {profile.difficultyMode === 'adaptive' ? 'Adaptive' : profile.difficultyMode.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-amber-50/80 rounded-2xl border border-amber-200/60">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('games');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              currentTab === 'games'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-102'
                : 'text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="text-base">🎮</span>
            <span>Play</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('badges');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              currentTab === 'badges'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-102'
                : 'text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-900" />
            <span className="hidden sm:inline">Trophies</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('shop');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              currentTab === 'shop'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-102'
                : 'text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-900" />
            <span className="hidden sm:inline">Shop</span>
          </button>
        </nav>

        {/* Stats & Parent Zone */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          {profile.currentStreak > 1 && (
            <div 
              className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-xl text-xs font-black border border-orange-200"
              title={`Current streak: ${profile.currentStreak}`}
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{profile.currentStreak}</span>
            </div>
          )}

          {/* Stars */}
          <div 
            className="flex items-center gap-1 bg-amber-100/90 text-amber-900 px-2.5 py-1 rounded-xl text-xs md:text-sm font-black border border-amber-200 shadow-2xs"
            title="Total stars earned"
          >
            <span className="text-base">⭐</span>
            <span className="tabular-nums">{profile.stars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title={profile.soundEnabled ? 'Mute sound' : 'Turn sound on'}
            aria-label="Sound Toggle"
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Parent Zone Button */}
          <button
            onClick={() => {
              sound.playClick();
              onRequestParentZone();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black transition-colors"
            title="Parents Dashboard (Math Gate Protected)"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Parents</span>
          </button>
        </div>
      </div>
    </header>
  );
};
