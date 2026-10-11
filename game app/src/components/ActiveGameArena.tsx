import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge, ChildProfile, GameSessionLog, GameType, MathQuestion } from '../types/math';
import { generateQuestionForGame } from '../services/adaptiveEngine';
import { CountingSafari } from './games/CountingSafari';
import { BalloonAddition } from './games/BalloonAddition';
import { HungryDinoSubtraction } from './games/HungryDinoSubtraction';
import { BalanceComparison } from './games/BalanceComparison';
import { TrainPatterns } from './games/TrainPatterns';
import { StarSprint } from './games/StarSprint';
import { checkAndUnlockBadges } from '../services/storage';
import { sound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { ArrowLeft, Star, Flame, Trophy, RotateCcw } from 'lucide-react';

interface ActiveGameArenaProps {
  gameType: GameType;
  profile: ChildProfile;
  onUpdateProfile: (updated: ChildProfile) => void;
  onExit: () => void;
}

const QUESTIONS_PER_ROUND = 8;

export const ActiveGameArena: React.FC<ActiveGameArenaProps> = ({
  gameType,
  profile,
  onUpdateProfile,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [roundCorrectCount, setRoundCorrectCount] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
  const [showBadgeUnlockModal, setShowBadgeUnlockModal] = useState<Badge | null>(null);
  const [roundStartTime] = useState(Date.now());

  // Load question
  const loadNextQuestion = () => {
    const q = generateQuestionForGame(
      gameType,
      profile.skillProficiency,
      profile.skillStreaks,
      profile.difficultyMode
    );
    setCurrentQuestion(q);
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setRoundCorrectCount(0);
    setIsRoundFinished(false);
    loadNextQuestion();
  }, [gameType]);

  const handleAnswer = (isCorrect: boolean) => {
    const skillKey = 
      gameType === 'counting' ? 'counting' :
      gameType === 'addition' ? 'addition' :
      gameType === 'subtraction' ? 'subtraction' :
      gameType === 'comparison' ? 'comparison' :
      gameType === 'patterns' ? 'patterns' : 'addition';

    // 1. Update streak & proficiency
    let nextStreak = isCorrect ? profile.currentStreak + 1 : 0;
    let nextBestStreak = Math.max(profile.bestStreak, nextStreak);
    let skillStreak = isCorrect ? (profile.skillStreaks[skillKey] || 0) + 1 : -1;

    // Adaptive skill proficiency adjustment
    let currentProficiency = profile.skillProficiency[skillKey] || 20;
    if (isCorrect) {
      currentProficiency = Math.min(100, currentProficiency + 5);
      setRoundCorrectCount(prev => prev + 1);
    } else {
      currentProficiency = Math.max(10, currentProficiency - 2);
    }

    const updatedProfile: ChildProfile = {
      ...profile,
      stars: isCorrect ? profile.stars + 1 : profile.stars,
      totalSolved: profile.totalSolved + 1,
      totalCorrect: isCorrect ? profile.totalCorrect + 1 : profile.totalCorrect,
      currentStreak: nextStreak,
      bestStreak: nextBestStreak,
      skillProficiency: {
        ...profile.skillProficiency,
        [skillKey]: currentProficiency,
      },
      skillStreaks: {
        ...profile.skillStreaks,
        [skillKey]: skillStreak,
      },
    };

    // Check badges
    const { updatedProfile: checkedProfile, newBadges } = checkAndUnlockBadges(updatedProfile);
    onUpdateProfile(checkedProfile);

    if (newBadges.length > 0) {
      sound.playFanfare();
      fireConfetti('medium');
      setShowBadgeUnlockModal(newBadges[0]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= QUESTIONS_PER_ROUND) {
      // Finish round!
      finishRound();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      loadNextQuestion();
    }
  };

  const finishRound = () => {
    sound.playFanfare();
    fireConfetti('big');
    setIsRoundFinished(true);

    const accuracy = Math.round((roundCorrectCount / QUESTIONS_PER_ROUND) * 100);
    const durationSeconds = Math.round((Date.now() - roundStartTime) / 1000);

    const gameNames: Record<GameType, string> = {
      counting: 'Safari Counting',
      addition: 'Balloon Addition',
      subtraction: 'Hungry Dino',
      comparison: 'Balance Scale',
      patterns: 'Mystery Train',
      sprint: 'Star Sprint',
    };

    const sessionLog: GameSessionLog = {
      id: 'session-' + Date.now(),
      timestamp: new Date().toISOString(),
      gameType,
      gameName: gameNames[gameType],
      totalQuestions: QUESTIONS_PER_ROUND,
      correctAnswers: roundCorrectCount,
      starsEarned: roundCorrectCount,
      durationSeconds,
      difficultyLevel: currentQuestion?.level || 1,
    };

    const updatedProfile: ChildProfile = {
      ...profile,
      history: [sessionLog, ...profile.history],
    };

    const { updatedProfile: finalProfile, newBadges } = checkAndUnlockBadges(updatedProfile, {
      type: 'round_complete',
      accuracy,
      gameType,
    });

    onUpdateProfile(finalProfile);

    if (newBadges.length > 0) {
      setShowBadgeUnlockModal(newBadges[0]);
    }
  };

  const handleRestartRound = () => {
    setCurrentQuestionIndex(0);
    setRoundCorrectCount(0);
    setIsRoundFinished(false);
    loadNextQuestion();
  };

  // If playing sprint mode
  if (gameType === 'sprint') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 max-w-xl mx-auto">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Game</span>
          </button>
        </div>
        <StarSprint
          profile={profile}
          onFinishSprint={(correct, total, stars) => {
            const sessionLog: GameSessionLog = {
              id: 'sprint-' + Date.now(),
              timestamp: new Date().toISOString(),
              gameType: 'sprint',
              gameName: 'Star Sprint ⚡',
              totalQuestions: total,
              correctAnswers: correct,
              starsEarned: stars,
              durationSeconds: 45,
              difficultyLevel: 2,
            };

            const updated: ChildProfile = {
              ...profile,
              stars: profile.stars + stars,
              totalSolved: profile.totalSolved + total,
              totalCorrect: profile.totalCorrect + correct,
              history: [sessionLog, ...profile.history],
            };

            const { updatedProfile: checked } = checkAndUnlockBadges(updated);
            onUpdateProfile(checked);
          }}
          onExit={onExit}
        />
      </div>
    );
  }

  // Summary at the end of 8 questions
  if (isRoundFinished) {
    const accuracy = Math.round((roundCorrectCount / QUESTIONS_PER_ROUND) * 100);

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 md:p-8 border-3 border-amber-300 text-center cartoon-shadow">
        <div className="w-20 h-20 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-3 shadow-sm animate-bounce">
          🎉
        </div>
        <h2 className="text-3xl font-black text-slate-800">Round Completed!</h2>
        <p className="text-amber-700 font-extrabold text-sm mt-1">
          Super job, {profile.name}! Look what you achieved!
        </p>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-2.5 my-6">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-900">{roundCorrectCount}/{QUESTIONS_PER_ROUND}</div>
            <div className="text-[11px] font-bold text-slate-600">Correct</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-black text-emerald-700">+{roundCorrectCount}</div>
            <div className="text-[11px] font-bold text-slate-600">Stars ⭐</div>
          </div>
          <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200">
            <div className="text-2xl font-black text-sky-700">{accuracy}%</div>
            <div className="text-[11px] font-bold text-slate-600">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExit}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
          >
            Game Menu
          </button>
          <button
            onClick={handleRestartRound}
            className="flex-2 py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Next Round</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Top Game Progress HUD */}
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3 mb-4 px-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        {/* Question Counter Pill */}
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-black text-slate-700">
          <span>Question</span>
          <span className="text-amber-600">{currentQuestionIndex + 1}</span>
          <span className="text-slate-400">/</span>
          <span>{QUESTIONS_PER_ROUND}</span>
        </div>

        {/* Streak & Stars */}
        <div className="flex items-center gap-2">
          {profile.currentStreak > 1 && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-xl text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.currentStreak}</span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-black">
            <span>⭐</span>
            <span>{profile.stars}</span>
          </div>
        </div>
      </div>

      {/* Render active mini-game */}
      {currentQuestion && (
        <>
          {gameType === 'counting' && (
            <CountingSafari
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
            />
          )}
          {gameType === 'addition' && (
            <BalloonAddition
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
            />
          )}
          {gameType === 'subtraction' && (
            <HungryDinoSubtraction
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
            />
          )}
          {gameType === 'comparison' && (
            <BalanceComparison
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
            />
          )}
          {gameType === 'patterns' && (
            <TrainPatterns
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
            />
          )}
        </>
      )}

      {/* New Badge Unlocked Modal celebration */}
      <AnimatePresence>
        {showBadgeUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-400 cartoon-shadow text-center relative"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-300 to-orange-400 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-3 shadow-md animate-bounce">
                {showBadgeUnlockModal.icon}
              </div>

              <div className="flex items-center justify-center gap-1 text-xs font-black uppercase text-amber-600 mb-1">
                <Trophy className="w-4 h-4" />
                <span>New Trophy Unlocked!</span>
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {showBadgeUnlockModal.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {showBadgeUnlockModal.description}
              </p>

              <button
                onClick={() => setShowBadgeUnlockModal(null)}
                className="mt-5 w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl cartoon-button cursor-pointer"
              >
                Collect Trophy! ⭐
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
