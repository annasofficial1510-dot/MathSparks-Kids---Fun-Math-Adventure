import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MathQuestion } from '../../types/math';
import { sound } from '../../utils/soundEffects';
import { fireStarBurst } from '../../utils/confetti';
import { Lightbulb } from 'lucide-react';

interface BalanceComparisonProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const BalanceComparison: React.FC<BalanceComparisonProps> = ({
  question,
  onAnswer,
  onNextQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const visual = question.visualData || {};
  const valLeft = visual.valLeft ?? 5;
  const valRight = visual.valRight ?? 8;
  const exprLeft = visual.exprLeft ?? `${valLeft}`;
  const exprRight = visual.exprRight ?? `${valRight}`;

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [question.id]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    const isCorrect = opt === question.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      fireStarBurst();
    } else {
      sound.playWrong();
    }

    onAnswer(isCorrect);
  };

  // Seesaw tilt calculation
  let tiltDeg = 0;
  if (valLeft > valRight) tiltDeg = -8;
  else if (valLeft < valRight) tiltDeg = 8;

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-3 border-purple-200 cartoon-shadow">
        {/* Header Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-black tracking-widest uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            ⚖️ Balance Scale · Level {question.level}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            Which sign fits in the middle?
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Compare both sides: Greater (&gt;), Equal (=), or Less (&lt;)
          </p>
        </div>

        {/* Seesaw / Balance scale animation */}
        <div className="bg-gradient-to-b from-purple-50 to-indigo-50/40 rounded-2xl p-6 border-2 border-purple-200 flex flex-col items-center min-h-[220px] justify-between relative overflow-hidden">
          {/* Main comparison cards floating on seesaw */}
          <motion.div
            animate={{ rotate: isAnswered ? tiltDeg : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="w-full flex items-center justify-between px-4 md:px-10 z-10 py-4"
          >
            {/* Left Pan */}
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border-2 border-purple-200 min-w-[100px]">
              <span className="text-3xl font-black text-purple-700">{exprLeft}</span>
              {visual.itemLeftEmoji && (
                <div className="flex gap-1 text-base mt-1">
                  <span>{visual.itemLeftEmoji}</span>
                </div>
              )}
            </div>

            {/* Middle Slot for Sign */}
            <div className="w-16 h-16 rounded-2xl bg-white/90 border-3 border-dashed border-purple-400 flex items-center justify-center text-3xl font-black shadow-inner">
              {selectedAnswer ? (
                <span className={isAnswered && selectedAnswer === question.correctAnswer ? 'text-emerald-600' : 'text-purple-700'}>
                  {selectedAnswer}
                </span>
              ) : (
                <span className="text-purple-300">?</span>
              )}
            </div>

            {/* Right Pan */}
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border-2 border-purple-200 min-w-[100px]">
              <span className="text-3xl font-black text-purple-700">{exprRight}</span>
              {visual.itemRightEmoji && (
                <div className="flex gap-1 text-base mt-1">
                  <span>{visual.itemRightEmoji}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Seesaw Plank & Fulcrum */}
          <div className="w-full relative flex flex-col items-center">
            {/* The seesaw plank */}
            <motion.div
              animate={{ rotate: isAnswered ? tiltDeg : 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="w-4/5 h-3 bg-purple-400 rounded-full shadow-xs"
            />
            {/* The triangle fulcrum */}
            <div className="w-0 h-0 border-x-12 border-x-transparent border-b-16 border-b-purple-600" />
            <div className="w-24 h-2 bg-purple-300 rounded-full mt-0.5" />
          </div>
        </div>

        {/* Hint toggle */}
        <div className="flex justify-end mt-3 px-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-lg"
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
            <span>Hint</span>
          </button>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-2"
          >
            <span>🐊</span>
            <span>Alligator trick: The hungry alligator mouth open wide towards the bigger number!</span>
          </motion.div>
        )}

        {/* Comparison Symbol Options */}
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase text-slate-600 mb-3 tracking-wider">
            Choose The Symbol:
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { sign: '>', label: 'Greater Than (>)' },
              { sign: '=', label: 'Equal To (=)' },
              { sign: '<', label: 'Less Than (<)' },
            ].map((item, idx) => {
              const isSelected = selectedAnswer === item.sign;
              const isCorrectOpt = item.sign === question.correctAnswer;

              let buttonStyle = 'bg-slate-50 hover:bg-purple-50 text-purple-900 border-2 border-slate-200';
              if (isAnswered) {
                if (isCorrectOpt) {
                  buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 animate-pulse';
                } else if (isSelected && !isCorrectOpt) {
                  buttonStyle = 'bg-rose-400 text-white border-2 border-rose-500 opacity-80';
                } else {
                  buttonStyle = 'bg-slate-100 text-slate-400 border border-slate-200 opacity-50';
                }
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!isAnswered ? { scale: 1.05 } : {}}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(item.sign)}
                  className={`h-20 rounded-2xl font-black flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm cartoon-button ${buttonStyle}`}
                >
                  <span className="text-3xl">{item.sign}</span>
                  <span className="text-[11px] font-bold opacity-80 mt-1">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Feedback / Next Button */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className={`text-base font-black mb-3 ${
              selectedAnswer === question.correctAnswer
                ? 'text-emerald-600'
                : 'text-amber-700'
            }`}>
              {selectedAnswer === question.correctAnswer
                ? `⚖️ Perfect! ${exprLeft} ${question.correctAnswer} ${exprRight} is correct! ⭐`
                : `Good try! The true sign was "${question.correctAnswer}"! 🌟`}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Scale</span>
              <span>➔</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
