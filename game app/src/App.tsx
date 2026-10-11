/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChildProfile, GameType, MascotId, AccessoryId } from './types/math';
import { loadProfile, saveProfile, checkAndUnlockBadges } from './services/storage';
import { Header } from './components/Header';
import { GameHub } from './components/GameHub';
import { ActiveGameArena } from './components/ActiveGameArena';
import { BadgeGallery } from './components/BadgeGallery';
import { PetCustomizer } from './components/PetCustomizer';
import { ParentDashboard } from './components/ParentDashboard';
import { ParentGateModal } from './components/ParentGateModal';
import { sound } from './utils/soundEffects';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(() => loadProfile());
  const [currentTab, setCurrentTab] = useState<'games' | 'badges' | 'shop' | 'parents'>('games');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [showParentGate, setShowParentGate] = useState(false);

  // Sync sound system state with profile
  useEffect(() => {
    sound.enabled = profile.soundEnabled;
  }, [profile.soundEnabled]);

  const updateProfile = (updated: ChildProfile) => {
    setProfile(updated);
    saveProfile(updated);
  };

  const handleToggleSound = () => {
    const nextSound = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: nextSound };
    updateProfile(updated);
    sound.enabled = nextSound;
  };

  const handleSelectGame = (game: GameType) => {
    setActiveGame(game);
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  const handleRequestParentZone = () => {
    setShowParentGate(true);
  };

  const handleParentGateSuccess = () => {
    setShowParentGate(false);
    setActiveGame(null);
    setCurrentTab('parents');
  };

  const handleUpdateMascot = (mascotId: MascotId) => {
    const updated = { ...profile, mascot: mascotId };
    updateProfile(updated);
  };

  const handleEquipAccessory = (accId: AccessoryId) => {
    const updated = { ...profile, equippedAccessory: accId };
    const { updatedProfile } = checkAndUnlockBadges(updated, { type: 'equip_item' });
    updateProfile(updatedProfile);
  };

  const handleBuyAccessory = (accId: AccessoryId, cost: number) => {
    const updated: ChildProfile = {
      ...profile,
      stars: profile.stars - cost,
      unlockedAccessories: [...profile.unlockedAccessories, accId],
      equippedAccessory: accId,
    };
    const { updatedProfile } = checkAndUnlockBadges(updated, { type: 'equip_item' });
    updateProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-sky-50/40 text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Global Header */}
      <Header
        profile={profile}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveGame(null);
          setCurrentTab(tab);
        }}
        onToggleSound={handleToggleSound}
        onRequestParentZone={handleRequestParentZone}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col">
        {/* If child is actively playing a game */}
        {activeGame ? (
          <ActiveGameArena
            gameType={activeGame}
            profile={profile}
            onUpdateProfile={updateProfile}
            onExit={handleExitGame}
          />
        ) : (
          <>
            {currentTab === 'games' && (
              <GameHub
                profile={profile}
                onSelectGame={handleSelectGame}
                onOpenBadges={() => setCurrentTab('badges')}
                onOpenShop={() => setCurrentTab('shop')}
              />
            )}

            {currentTab === 'badges' && (
              <BadgeGallery
                profile={profile}
                onClose={() => setCurrentTab('games')}
              />
            )}

            {currentTab === 'shop' && (
              <PetCustomizer
                profile={profile}
                onUpdateMascot={handleUpdateMascot}
                onEquipAccessory={handleEquipAccessory}
                onBuyAccessory={handleBuyAccessory}
              />
            )}

            {currentTab === 'parents' && (
              <ParentDashboard
                profile={profile}
                onUpdateProfile={updateProfile}
                onExit={() => setCurrentTab('games')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-600 font-bold border-t border-amber-100/60 bg-white/40">
        <div className="flex items-center justify-center gap-2">
          <span>MathSparks Kids</span>
          <span>•</span>
          <span>Adaptive Math Adventure</span>
          <span>•</span>
          <button
            onClick={handleRequestParentZone}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Parents Portal
          </button>
        </div>
      </footer>

      {/* Parent Verification Gate Modal */}
      <ParentGateModal
        isOpen={showParentGate}
        onSuccess={handleParentGateSuccess}
        onCancel={() => setShowParentGate(false)}
      />
    </div>
  );
}
