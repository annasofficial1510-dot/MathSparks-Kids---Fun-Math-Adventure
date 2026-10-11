import React from 'react';
import { motion } from 'motion/react';
import { AccessoryId, ChildProfile, MascotId } from '../types/math';
import { ACCESSORIES_CATALOG, MASCOTS_INFO } from '../services/storage';
import { MascotBuddy } from './MascotBuddy';
import { sound } from '../utils/soundEffects';
import { fireStarBurst } from '../utils/confetti';
import { Sparkles, Check, Lock, ShoppingBag } from 'lucide-react';

interface PetCustomizerProps {
  profile: ChildProfile;
  onUpdateMascot: (mascotId: MascotId) => void;
  onEquipAccessory: (accId: AccessoryId) => void;
  onBuyAccessory: (accId: AccessoryId, cost: number) => void;
}

export const PetCustomizer: React.FC<PetCustomizerProps> = ({
  profile,
  onUpdateMascot,
  onEquipAccessory,
  onBuyAccessory,
}) => {
  const mascotsList: MascotId[] = ['lion', 'bunny', 'robot', 'unicorn', 'bear'];

  const handleSelectAccessory = (accId: AccessoryId, cost: number) => {
    const isUnlocked = profile.unlockedAccessories.includes(accId);

    if (isUnlocked) {
      sound.playPop();
      onEquipAccessory(accId);
    } else {
      if (profile.stars >= cost) {
        sound.playFanfare();
        fireStarBurst();
        onBuyAccessory(accId, cost);
      } else {
        sound.playWrong();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 rounded-3xl p-6 md:p-8 text-white cartoon-shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-950 font-black text-xs uppercase tracking-wider bg-white/30 backdrop-blur-xs px-3 py-1 rounded-full w-fit">
            <ShoppingBag className="w-4 h-4 fill-teal-950" />
            <span>Buddy Sanctuary & Dress Up</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Mascot Wardrobe
          </h1>
          <p className="text-sky-100 font-semibold text-sm mt-1">
            Pick your favorite math buddy and dress them up with stars you earned!
          </p>
        </div>

        {/* Current Stars Balance */}
        <div className="bg-white/95 rounded-2xl px-5 py-3 text-slate-800 shadow-md border-2 border-white/60 flex items-center gap-3">
          <span className="text-3xl">⭐</span>
          <div>
            <div className="text-2xl font-black text-amber-600 tabular-nums">
              {profile.stars}
            </div>
            <div className="text-xs font-bold text-slate-500">Stars Available</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Mascot Live Preview & Selector */}
        <div className="bg-white rounded-3xl p-6 border-3 border-teal-200 cartoon-shadow flex flex-col items-center text-center">
          <span className="text-xs font-black uppercase text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-4">
            Current Buddy
          </span>

          <div className="my-3">
            <MascotBuddy
              mascotId={profile.mascot}
              accessoryId={profile.equippedAccessory}
              size="lg"
              isExcited={true}
            />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {MASCOTS_INFO[profile.mascot].name}
          </h2>
          <p className="text-xs font-bold text-slate-500">
            {MASCOTS_INFO[profile.mascot].species}
          </p>

          {/* Mascot Picker */}
          <div className="w-full mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-black uppercase text-slate-600 mb-3 text-left">
              Choose Your Companion:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {mascotsList.map((mId) => {
                const info = MASCOTS_INFO[mId];
                const isSelected = profile.mascot === mId;
                const emoji = mId === 'lion' ? '🦁' : mId === 'bunny' ? '🐰' : mId === 'robot' ? '🤖' : mId === 'unicorn' ? '🦄' : '🐻';

                return (
                  <motion.button
                    key={mId}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      sound.playPop();
                      onUpdateMascot(mId);
                    }}
                    className={`h-12 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                    title={info.name}
                  >
                    {emoji}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Accessories Catalog */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border-3 border-sky-200 cartoon-shadow">
          <h2 className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Hats, Shades & Capes</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 mb-4">
            Tap an accessory to equip or unlock using your math stars!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACCESSORIES_CATALOG.map((item) => {
              const isUnlocked = profile.unlockedAccessories.includes(item.id);
              const isEquipped = profile.equippedAccessory === item.id;
              const canAfford = profile.stars >= item.cost;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectAccessory(item.id, item.cost)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between transition-all cursor-pointer select-none ${
                    isEquipped
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                      : isUnlocked
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      : canAfford
                      ? 'bg-white hover:bg-amber-50/50 border-dashed border-amber-300'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.emoji}</span>
                    {isEquipped ? (
                      <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Worn
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        Owned
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        ⭐ {item.cost}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-black text-slate-800 line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition-all ${
                        isEquipped
                          ? 'bg-amber-200 text-amber-900 cursor-default'
                          : isUnlocked
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          : canAfford
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-2xs hover:brightness-105'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed flex items-center justify-center gap-1'
                      }`}
                    >
                      {isEquipped
                        ? 'Equipped'
                        : isUnlocked
                        ? 'Equip'
                        : canAfford
                        ? `Get for ⭐${item.cost}`
                        : `Need ⭐${item.cost}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
