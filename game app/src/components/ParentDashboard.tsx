import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChildProfile, DifficultyMode, GameSessionLog } from '../types/math';
import { CertificateModal } from './CertificateModal';
import { sound } from '../utils/soundEffects';
import { 
  ShieldCheck, 
  BarChart3, 
  Award, 
  Sliders, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  ArrowLeft, 
  Printer, 
  RefreshCw, 
  Target, 
  TrendingUp,
  BrainCircuit,
  Info
} from 'lucide-react';

interface ParentDashboardProps {
  profile: ChildProfile;
  onUpdateProfile: (updated: ChildProfile) => void;
  onExit: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  onUpdateProfile,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'adaptive' | 'history' | 'settings'>('progress');
  const [showCertificate, setShowCertificate] = useState(false);
  const [childName, setChildName] = useState(profile.name);
  const [childAge, setChildAge] = useState(profile.age);
  const [saveToast, setSaveToast] = useState(false);

  const accuracy = profile.totalSolved > 0 
    ? Math.round((profile.totalCorrect / profile.totalSolved) * 100) 
    : 0;

  // Approximate minutes spent
  const totalSeconds = profile.history.reduce((sum, h) => sum + (h.durationSeconds || 45), 0);
  const minutesSpent = Math.max(1, Math.round(totalSeconds / 60));

  const handleDifficultyModeChange = (mode: DifficultyMode) => {
    sound.playClick();
    const updated = {
      ...profile,
      difficultyMode: mode,
    };
    onUpdateProfile(updated);
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCorrect();
    const updated = {
      ...profile,
      name: childName.trim() || 'Hero',
      age: Number(childAge) || 6,
    };
    onUpdateProfile(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSeedDemoData = () => {
    sound.playClick();
    const sampleHistory: GameSessionLog[] = [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        gameType: 'counting',
        gameName: 'Safari Counting',
        totalQuestions: 10,
        correctAnswers: 9,
        starsEarned: 9,
        durationSeconds: 140,
        difficultyLevel: 1,
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        gameType: 'addition',
        gameName: 'Balloon Addition',
        totalQuestions: 10,
        correctAnswers: 8,
        starsEarned: 8,
        durationSeconds: 180,
        difficultyLevel: 2,
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        gameType: 'subtraction',
        gameName: 'Hungry Dino',
        totalQuestions: 8,
        correctAnswers: 7,
        starsEarned: 7,
        durationSeconds: 160,
        difficultyLevel: 1,
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        gameType: 'comparison',
        gameName: 'Balance Scale',
        totalQuestions: 6,
        correctAnswers: 5,
        starsEarned: 5,
        durationSeconds: 120,
        difficultyLevel: 2,
      },
      {
        id: 'log-5',
        timestamp: new Date().toISOString(),
        gameType: 'patterns',
        gameName: 'Mystery Train',
        totalQuestions: 8,
        correctAnswers: 8,
        starsEarned: 8,
        durationSeconds: 130,
        difficultyLevel: 2,
      },
    ];

    const updated: ChildProfile = {
      ...profile,
      stars: profile.stars + 35,
      totalSolved: profile.totalSolved + 42,
      totalCorrect: profile.totalCorrect + 37,
      bestStreak: Math.max(profile.bestStreak, 7),
      skillProficiency: {
        counting: 85,
        addition: 75,
        subtraction: 68,
        comparison: 70,
        patterns: 80,
      },
      history: [...sampleHistory, ...profile.history],
    };

    onUpdateProfile(updated);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset this child's math progress? Stars and history will be cleared.")) {
      sound.playClick();
      const updated: ChildProfile = {
        ...profile,
        stars: 0,
        coins: 0,
        totalSolved: 0,
        totalCorrect: 0,
        currentStreak: 0,
        bestStreak: 0,
        skillProficiency: {
          counting: 10,
          addition: 10,
          subtraction: 10,
          comparison: 10,
          patterns: 10,
        },
        skillStreaks: {
          counting: 0,
          addition: 0,
          subtraction: 0,
          comparison: 0,
          patterns: 0,
        },
        history: [],
      };
      onUpdateProfile(updated);
    }
  };

  const skillsList = [
    { key: 'counting', name: 'Counting & Ten-Frames', emoji: '🦁', color: 'from-amber-400 to-amber-500' },
    { key: 'addition', name: 'Visual & Mental Addition', emoji: '🎈', color: 'from-sky-400 to-blue-500' },
    { key: 'subtraction', name: 'Take-Away & Subtraction', emoji: '🦕', color: 'from-emerald-400 to-teal-500' },
    { key: 'comparison', name: 'Balance & Comparison (<, =, >)', emoji: '⚖️', color: 'from-purple-400 to-indigo-500' },
    { key: 'patterns', name: 'Number Trains & Sequences', emoji: '🚂', color: 'from-orange-400 to-rose-500' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      {/* Top Bar inside Parent Zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-3xl border-2 border-indigo-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-800">
                Parent Progress Portal
              </h1>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                {profile.name} (Age {profile.age})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Track your child&apos;s early math development, accuracy, and adaptive learning curve.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs cartoon-button cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Certificate</span>
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cartoon-button cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Games</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-x-auto">
        {[
          { id: 'progress', label: 'Progress & Mastery', icon: BarChart3 },
          { id: 'adaptive', label: 'Adaptive Levels', icon: Sliders },
          { id: 'history', label: 'Session History', icon: Clock },
          { id: 'settings', label: 'Child Profile Settings', icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Progress & Mastery */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Problems Solved
              </div>
              <div className="text-3xl font-black text-slate-900">
                {profile.totalCorrect}{' '}
                <span className="text-sm font-semibold text-slate-600">/ {profile.totalSolved}</span>
              </div>
              <div className="text-xs font-semibold text-indigo-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{profile.totalSolved - profile.totalCorrect} practice tries</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Overall Accuracy
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {accuracy}%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{accuracy >= 75 ? 'Strong foundation' : 'Building confidence'}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Stars & Badges
              </div>
              <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
                <span>⭐ {profile.stars}</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-2">
                🏆 {profile.badges.filter(b => b.unlocked).length} badges unlocked
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Learning Time
              </div>
              <div className="text-3xl font-black text-indigo-600">
                ~{minutesSpent} <span className="text-sm font-semibold text-slate-600">mins</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-2">
                Across {profile.history.length || 1} sessions
              </div>
            </div>
          </div>

          {/* Skill Mastery Breakdown */}
          <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>Curriculum Skill Mastery</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated based on correct problem streaks, hints requested, and accuracy per domain.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {skillsList.map((skill) => {
                const score = profile.skillProficiency[skill.key] || 15;
                const status = score >= 75 ? 'Proficient' : score >= 40 ? 'Developing' : 'Introductory';

                return (
                  <div key={skill.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold">
                      <div className="flex items-center gap-2 text-slate-800">
                        <span className="text-base">{skill.emoji}</span>
                        <span>{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                          score >= 75 ? 'bg-emerald-100 text-emerald-800' :
                          score >= 40 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {status}
                        </span>
                        <span className="text-slate-700 font-mono tabular-nums">{score}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pedagogical Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl border-2 border-indigo-200 cartoon-shadow">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Pedagogical Insights for Parents</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-slate-700">
              <div className="bg-white/80 p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                <span className="font-extrabold text-indigo-900 block mb-1">
                  🌟 Strongest Mathematical Competency:
                </span>
                <p className="leading-relaxed">
                  {profile.skillProficiency.counting >= 60
                    ? `${profile.name} demonstrates confident 1-to-1 correspondence and item enumeration. They are ready to tackle combined group addition.`
                    : `${profile.name} is making steady progress! Regular 5-minute sessions with Counting Safari will solidify quantity sense.`}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                <span className="font-extrabold text-indigo-900 block mb-1">
                  🎯 Recommended Practice:
                </span>
                <p className="leading-relaxed">
                  {profile.skillProficiency.subtraction < profile.skillProficiency.addition
                    ? `Try playing "Hungry Dino Subtraction" together. Seeing physical snack items disappear makes the concept of "taking away" concrete.`
                    : `Try "Mystery Train Patterns" to strengthen logical reasoning and skip-counting before beginning multiplication.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Adaptive Difficulty Controls */}
      {activeTab === 'adaptive' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-100 cartoon-shadow space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-indigo-600" />
              <span>Adaptive Difficulty Engine Settings</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Select how MathSparks adjusts problem complexity as your child plays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Auto-Adaptive */}
            <div
              onClick={() => handleDifficultyModeChange('adaptive')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                profile.difficultyMode === 'adaptive'
                  ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">
                  Recommended
                </span>
                {profile.difficultyMode === 'adaptive' && (
                  <CheckCircle className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                🤖 Dynamic Auto-Adaptive Mode
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automatically scales with your child. If they answer 3 problems in a row correctly, complexity gently climbs (higher numbers, missing addends). If they stumble twice, the system introduces visual ten-frames and hints to prevent frustration.
              </p>
            </div>

            {/* Option 2: Level 1 Sprout */}
            <div
              onClick={() => handleDifficultyModeChange('level1')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                profile.difficultyMode === 'level1'
                  ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Ages 3 – 5 (Preschool)
                </span>
                {profile.difficultyMode === 'level1' && (
                  <CheckCircle className="w-5 h-5 text-amber-600 fill-amber-100" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                🌱 Fixed Level 1: Tiny Sprouts
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Lock difficulty strictly to numbers 1 through 5, visual counting, single-item additions, and simple two-item comparisons. Ideal for beginners developing basic motor and counting habits.
              </p>
            </div>

            {/* Option 3: Level 2 Explorer */}
            <div
              onClick={() => handleDifficultyModeChange('level2')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                profile.difficultyMode === 'level2'
                  ? 'bg-sky-50/60 border-sky-500 ring-2 ring-sky-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  Ages 6 – 7 (Kindergarten / 1st)
                </span>
                {profile.difficultyMode === 'level2' && (
                  <CheckCircle className="w-5 h-5 text-sky-600 fill-sky-100" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                🚀 Fixed Level 2: Curious Cubs
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Focuses on numbers up to 10 and 20. Addition and subtraction with visual counters, counting backwards, and finding missing sequence numbers by steps of 1 and 2.
              </p>
            </div>

            {/* Option 4: Level 3 Wizard */}
            <div
              onClick={() => handleDifficultyModeChange('level3')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                profile.difficultyMode === 'level3'
                  ? 'bg-purple-50/60 border-purple-500 ring-2 ring-purple-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                  Ages 8+ (2nd – 3rd Grade)
                </span>
                {profile.difficultyMode === 'level3' && (
                  <CheckCircle className="w-5 h-5 text-purple-600 fill-purple-100" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                🧙‍♂️ Fixed Level 3: Math Wizards
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Challenges with missing addends (e.g., 4 + ? = 11), double-digit comparisons, equation evaluations, and skip counting patterns by 3s, 5s, and 10s.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Adaptation:</strong> In Auto-Adaptive mode, the difficulty score is updated seamlessly after every 3-question sequence. You can change this setting at any time without resetting earned stars or badges.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Session History */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 cartoon-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Learning Activity Logs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every practice game session is recorded for parent transparency.
              </p>
            </div>
            {profile.history.length === 0 && (
              <button
                onClick={handleSeedDemoData}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
              >
                + Load Sample Session Data
              </button>
            )}
          </div>

          {profile.history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No game sessions logged yet.</p>
              <p className="text-xs mt-1">Play a few rounds in Kid Mode to see detailed session reports!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Game Played</th>
                    <th className="py-3 px-3">Questions</th>
                    <th className="py-3 px-3">Score & Accuracy</th>
                    <th className="py-3 px-3">Stars Won</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.history.map((log) => {
                    const logAccuracy = Math.round((log.correctAnswers / Math.max(1, log.totalQuestions)) * 100);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-600">
                          {new Date(log.timestamp).toLocaleDateString()} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-slate-800">
                          {log.gameName}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {log.totalQuestions} questions
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800">{log.correctAnswers}/{log.totalQuestions}</span>
                          <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                            logAccuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {logAccuracy}%
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-600">
                          +{log.starsEarned} ⭐
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Child Profile Settings & Controls */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-100 cartoon-shadow space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Child Profile & Preferences
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Customize learner info, printable certificates, or reset history.
            </p>
          </div>

          <form onSubmit={handleSaveProfileSettings} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Child&apos;s Name (Appears on Certificate)
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Child&apos;s Age
              </label>
              <input
                type="number"
                min="3"
                max="12"
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm cartoon-button cursor-pointer"
              >
                Save Changes
              </button>
              {saveToast && (
                <span className="text-xs font-bold text-emerald-600 animate-pulse">
                  ✓ Profile updated!
                </span>
              )}
            </div>
          </form>

          {/* Seed and Danger Zone */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              onClick={handleSeedDemoData}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Progress Data</span>
            </button>

            <button
              onClick={handleResetProgress}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        profile={profile}
        onClose={() => setShowCertificate(false)}
      />
    </div>
  );
};
