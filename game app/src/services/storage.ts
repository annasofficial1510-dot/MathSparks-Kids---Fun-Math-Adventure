import { Accessory, Badge, ChildProfile, GameSessionLog, MascotId } from '../types/math';

export const ACCESSORIES_CATALOG: Accessory[] = [
  { id: 'none', name: 'Natural Look', cost: 0, emoji: '✨', description: 'Just cute as you are!', category: 'hat' },
  { id: 'party_hat', name: 'Party Cone', cost: 10, emoji: '🥳', description: 'Ready to celebrate every sum!', category: 'hat' },
  { id: 'crown', name: 'Royal Crown', cost: 25, emoji: '👑', description: 'For the ruler of numbers!', category: 'hat' },
  { id: 'wizard_hat', name: 'Magic Wizard Hat', cost: 40, emoji: '🧙‍♂️', description: 'Cast magical math spells!', category: 'hat' },
  { id: 'flower_crown', name: 'Daisy Wreath', cost: 15, emoji: '🌸', description: 'Fresh flowers picked from the meadow!', category: 'hat' },
  { id: 'astronaut_helmet', name: 'Astro Helmet', cost: 50, emoji: '👨‍🚀', description: 'Explore mathematical galaxies!', category: 'hat' },
  { id: 'cool_sunglasses', name: 'Star Shades', cost: 20, emoji: '😎', description: 'Too cool for tricky problems!', category: 'glasses' },
  { id: 'super_cape', name: 'Hero Cape', cost: 35, emoji: '🦸', description: 'Fly high into math adventures!', category: 'cape' },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_star',
    title: 'First Spark',
    description: 'Solved your very first math question correctly!',
    icon: '⭐',
    category: 'milestone',
    unlocked: false,
    criteriaText: 'Solve 1 question correctly',
  },
  {
    id: 'streak_5',
    title: 'High Five!',
    description: 'Answered 5 questions correctly in a row!',
    icon: '✋',
    category: 'streak',
    unlocked: false,
    criteriaText: 'Get 5 correct in a row',
  },
  {
    id: 'streak_10',
    title: 'On Fire!',
    description: 'Unstoppable! 10 correct answers in a row!',
    icon: '🔥',
    category: 'streak',
    unlocked: false,
    criteriaText: 'Get 10 correct in a row',
  },
  {
    id: 'counting_star',
    title: 'Safari Counter',
    description: 'Master of counting animals and stars!',
    icon: '🦁',
    category: 'mastery',
    unlocked: false,
    criteriaText: 'Solve 8 Counting challenges',
  },
  {
    id: 'addition_champ',
    title: 'Plus Power',
    description: 'Balloon popping addition champion!',
    icon: '🎈',
    category: 'mastery',
    unlocked: false,
    criteriaText: 'Solve 8 Addition challenges',
  },
  {
    id: 'subtraction_master',
    title: 'Minus Marvel',
    description: 'Fed the Dino and mastered subtraction!',
    icon: '🦕',
    category: 'mastery',
    unlocked: false,
    criteriaText: 'Solve 8 Subtraction challenges',
  },
  {
    id: 'compare_king',
    title: 'Seesaw Champion',
    description: 'Balanced the scales and compared numbers!',
    icon: '⚖️',
    category: 'mastery',
    unlocked: false,
    criteriaText: 'Solve 8 Comparison challenges',
  },
  {
    id: 'pattern_wizard',
    title: 'Train Conductor',
    description: 'Filled in the missing train cars and saw the pattern!',
    icon: '🚂',
    category: 'mastery',
    unlocked: false,
    criteriaText: 'Solve 8 Pattern challenges',
  },
  {
    id: 'speedy_star',
    title: 'Turbo Sprinter',
    description: 'Completed the Star Sprint speed run!',
    icon: '⚡',
    category: 'explorer',
    unlocked: false,
    criteriaText: 'Play a Star Sprint round',
  },
  {
    id: 'century_club',
    title: '50 Star Hero',
    description: 'Solved 50 math challenges! What an achievement!',
    icon: '🏅',
    category: 'milestone',
    unlocked: false,
    criteriaText: 'Solve 50 total questions',
  },
  {
    id: 'hundred_hero',
    title: 'Century Master',
    description: 'Reached 100 solved problems! Math royalty!',
    icon: '🏆',
    category: 'milestone',
    unlocked: false,
    criteriaText: 'Solve 100 total questions',
  },
  {
    id: 'fashion_icon',
    title: 'Style Superstar',
    description: 'Unlocked and equipped a new accessory for your mascot!',
    icon: '🎩',
    category: 'explorer',
    unlocked: false,
    criteriaText: 'Equip an accessory in the Shop',
  },
  {
    id: 'flawless_game',
    title: 'Perfectionist',
    description: 'Finished a game round with 100% accuracy!',
    icon: '💎',
    category: 'streak',
    unlocked: false,
    criteriaText: 'Complete any round with 100% accuracy',
  },
  {
    id: 'level_2_unlocked',
    title: 'Curious Explorer',
    description: 'Advanced to Level 2 math challenges!',
    icon: '🚀',
    category: 'milestone',
    unlocked: false,
    criteriaText: 'Reach Level 2 in adaptive mode',
  },
];

const STORAGE_KEY = 'mathsparks_child_profile_v2';
const SIBLINGS_KEY = 'mathsparks_all_profiles_v2';

export const MASCOTS_INFO: Record<MascotId, { name: string; species: string; color: string; bg: string; soundPitch: number; defaultPhrase: string }> = {
  lion: { name: 'Leo', species: 'Friendly Lion', color: 'text-amber-600', bg: 'bg-amber-100', soundPitch: 1.0, defaultPhrase: "Roar! Let's count some numbers!" },
  bunny: { name: 'Pip', species: 'Bouncy Bunny', color: 'text-pink-600', bg: 'bg-pink-100', soundPitch: 1.3, defaultPhrase: "Hop, hop! Math is super fun!" },
  robot: { name: 'Sparky', species: 'Smart Bot', color: 'text-cyan-600', bg: 'bg-cyan-100', soundPitch: 0.9, defaultPhrase: "Beep boop! Ready to compute!" },
  unicorn: { name: 'Starla', species: 'Magic Unicorn', color: 'text-purple-600', bg: 'bg-purple-100', soundPitch: 1.2, defaultPhrase: "Sparkle magic! You can do it!" },
  bear: { name: 'Barnaby', species: 'Cozy Bear', color: 'text-emerald-600', bg: 'bg-emerald-100', soundPitch: 0.8, defaultPhrase: "Big bear hug! Let's solve this!" },
};

export function createDefaultProfile(name: string = 'Leo', age: number = 6, mascot: MascotId = 'lion'): ChildProfile {
  return {
    id: 'profile_' + Date.now(),
    name,
    age,
    mascot,
    equippedAccessory: 'none',
    unlockedAccessories: ['none'],
    stars: 10, // Starter gift
    coins: 20,
    totalSolved: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    difficultyMode: 'adaptive',
    skillProficiency: {
      counting: 20,
      addition: 15,
      subtraction: 10,
      comparison: 15,
      patterns: 15,
    },
    skillStreaks: {
      counting: 0,
      addition: 0,
      subtraction: 0,
      comparison: 0,
      patterns: 0,
    },
    badges: INITIAL_BADGES,
    history: [],
    soundEnabled: true,
    createdAt: new Date().toISOString(),
  };
}

export function loadProfile(): ChildProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure any newly added badges are present
      const existingBadgeIds = new Set(parsed.badges.map((b: Badge) => b.id));
      INITIAL_BADGES.forEach(initB => {
        if (!existingBadgeIds.has(initB.id)) {
          parsed.badges.push(initB);
        }
      });
      return parsed;
    }
  } catch (err) {
    console.error('Error loading profile from localStorage', err);
  }

  const defaultProfile = createDefaultProfile();
  saveProfile(defaultProfile);
  return defaultProfile;
}

export function saveProfile(profile: ChildProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Also save in profiles map
    const all = loadAllProfiles();
    all[profile.id] = profile;
    localStorage.setItem(SIBLINGS_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Error saving profile to localStorage', err);
  }
}

export function loadAllProfiles(): Record<string, ChildProfile> {
  try {
    const data = localStorage.getItem(SIBLINGS_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error loading profiles list', err);
  }
  return {};
}

export function checkAndUnlockBadges(
  profile: ChildProfile, 
  extraEvent?: { type: 'round_complete'; accuracy: number; gameType: string } | { type: 'equip_item' }
): { updatedProfile: ChildProfile; newBadges: Badge[] } {
  const newBadges: Badge[] = [];
  const updatedBadges = profile.badges.map(badge => {
    if (badge.unlocked) return badge;

    let shouldUnlock = false;

    switch (badge.id) {
      case 'first_star':
        if (profile.totalCorrect >= 1) shouldUnlock = true;
        break;
      case 'streak_5':
        if (profile.bestStreak >= 5) shouldUnlock = true;
        break;
      case 'streak_10':
        if (profile.bestStreak >= 10) shouldUnlock = true;
        break;
      case 'counting_star':
        const countCount = profile.history.filter(h => h.gameType === 'counting').reduce((sum, h) => sum + h.correctAnswers, 0);
        if (countCount >= 8) shouldUnlock = true;
        break;
      case 'addition_champ':
        const addCount = profile.history.filter(h => h.gameType === 'addition').reduce((sum, h) => sum + h.correctAnswers, 0);
        if (addCount >= 8) shouldUnlock = true;
        break;
      case 'subtraction_master':
        const subCount = profile.history.filter(h => h.gameType === 'subtraction').reduce((sum, h) => sum + h.correctAnswers, 0);
        if (subCount >= 8) shouldUnlock = true;
        break;
      case 'compare_king':
        const compCount = profile.history.filter(h => h.gameType === 'comparison').reduce((sum, h) => sum + h.correctAnswers, 0);
        if (compCount >= 8) shouldUnlock = true;
        break;
      case 'pattern_wizard':
        const patCount = profile.history.filter(h => h.gameType === 'patterns').reduce((sum, h) => sum + h.correctAnswers, 0);
        if (patCount >= 8) shouldUnlock = true;
        break;
      case 'speedy_star':
        if (profile.history.some(h => h.gameType === 'sprint')) shouldUnlock = true;
        break;
      case 'century_club':
        if (profile.totalSolved >= 50) shouldUnlock = true;
        break;
      case 'hundred_hero':
        if (profile.totalSolved >= 100) shouldUnlock = true;
        break;
      case 'fashion_icon':
        if (extraEvent && extraEvent.type === 'equip_item') shouldUnlock = true;
        if (profile.equippedAccessory !== 'none') shouldUnlock = true;
        break;
      case 'flawless_game':
        if (extraEvent && extraEvent.type === 'round_complete' && extraEvent.accuracy === 100) shouldUnlock = true;
        break;
      case 'level_2_unlocked':
        const avg = Object.values(profile.skillProficiency).reduce((a, b) => a + b, 0) / 5;
        if (avg >= 40) shouldUnlock = true;
        break;
    }

    if (shouldUnlock) {
      const unlockedBadge = {
        ...badge,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newBadges.push(unlockedBadge);
      return unlockedBadge;
    }

    return badge;
  });

  const updatedProfile: ChildProfile = {
    ...profile,
    badges: updatedBadges,
  };

  if (newBadges.length > 0) {
    saveProfile(updatedProfile);
  }

  return { updatedProfile, newBadges };
}
