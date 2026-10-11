import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChildProfile, MathQuestion } from '../../types/math';
import { generateQuestionForGame } from '../../services/adaptiveEngine';
import { sound } from '../../utils/soundEffects';
import { fireConfetti, fireStarBurst } from '../../utils/confetti';
import { Timer, Zap, Trophy, Play } from 'lucide-react';

interface StarSprintProps {
  profile: ChildProfile;
  onFinishSprint: (correctCount: number, totalCount: number, starsEarned: number) => void;
  onExit: () => void;
}

export const StarSprint: React.FC<StarSprintProps> = ({
  profile,
  onFinishSprint,
  onExit,
}) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'summary'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(45); // 45 seconds sprint
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Generate initial question
  const nextQ = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    const q = generateQuestionForGame('sprint', profile.skillProficiency, profile.skillStreaks, profile.difficultyMode);
    setCurrentQuestion(q);
  };

  const startSprint = () => {
    sound.playFanfare();
    setScore(0);
    setTotalAnswered(0);
    setCombo(1);
    setTimeLeft(45);
    setGameState('playing');
    nextQ();
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      sound.playFanfare();
      fireConfetti('big');
      setGameState('summary');
      const earnedStars = score * 2;
      onFinishSprint(score, totalAnswered, earnedStars);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSelectOption = (opt: number | string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    const isCorrect = String(opt) === String(currentQuestion.correctAnswer);
    setTotalAnswered(prev => prev + 1);

    if (isCorrect) {
      sound.playCorrect();
      fireStarBurst();
      setScore(prev => prev + 1);
      setCombo(prev => Math.min(prev + 1, 4));
      // Fast transition to keep sprint fast and thrilling
      setTimeout(() => {
        nextQ();
      }, 400);
    } else {
      sound.playWrong();
      setCombo(1);
      setTimeout(() => {
        nextQ();
      }, 700);
    }
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 md:p-8 border-3 border-amber-300 text-center cartoon-shadow">
        <div className="w-20 h-20 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-4 shadow-sm">
          ⚡
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">Star Sprint!</h2>
        <p className="text-slate-600 font-semibold mt-2 text-sm">
          Answer as many fun math questions as you can in 45 seconds! Double star rewards for high combos!
        </p>

        <div className="flex items-center justify-center gap-4 my-6 text-sm font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-amber-600" />
            <span>45 Seconds</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-600" />
            <span>Combo Multiplier</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExit}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
          >
            Back to Games
          </button>
          <button
            onClick={startSprint}
            className="flex-2 py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Ready, GO!</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    const earnedStars = score * 2;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 md:p-8 border-3 border-amber-300 text-center cartoon-shadow">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-3 shadow-sm animate-bounce">
          🏆
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">Sprint Complete!</h2>
        <p className="text-emerald-700 font-black mt-1">Super Speedy Math Champion!</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 my-6">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-900">{score}</div>
            <div className="text-xs font-bold text-slate-600">Correct</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200">
            <div className="text-2xl font-black text-orange-700">{accuracy}%</div>
            <div className="text-xs font-bold text-slate-600">Accuracy</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-black text-emerald-700">+{earnedStars}</div>
            <div className="text-xs font-bold text-slate-600">Stars! ⭐</div>
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
            onClick={startSprint}
            className="flex-2 py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black rounded-2xl shadow-md cartoon-button cursor-pointer"
          >
            Play Again! ⚡
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Top Sprint HUD */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border-3 border-amber-300 cartoon-shadow mb-4">
        <div className="flex items-center justify-between gap-2">
          {/* Timer with color shift */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-black text-lg ${
              timeLeft <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-900'
            }`}>
              <Timer className="w-5 h-5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Combo Multiplier */}
          {combo > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs animate-bounce">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{combo}X COMBO!</span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-1 text-sm font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            <span>Score:</span>
            <span className="text-amber-700 text-lg">{score}</span>
          </div>
        </div>

        {/* Progress Bar of time */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}
            style={{ width: `${(timeLeft / 45) * 100}%` }}
          />
        </div>
      </div>

      {/* Sprint Question card */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-amber-200 cartoon-shadow text-center">
          <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Rapid Math
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-slate-800 my-5 font-mono">
            {currentQuestion.prompt}
          </h2>

          {/* Rapid Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = String(opt) === String(currentQuestion.correctAnswer);

              let buttonStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200';
              if (isAnswered) {
                if (isCorrectOpt) {
                  buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-400 text-white border-2 border-rose-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm cartoon-button ${buttonStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
