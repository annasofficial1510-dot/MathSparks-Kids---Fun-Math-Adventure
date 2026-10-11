import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MathQuestion } from '../../types/math';
import { sound } from '../../utils/soundEffects';
import { fireStarBurst } from '../../utils/confetti';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface CountingSafariProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const CountingSafari: React.FC<CountingSafariProps> = ({
  question,
  onAnswer,
  onNextQuestion,
}) => {
  const [countedSet, setCountedSet] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const visual = question.visualData || { items: [] };
  const items = visual.items || [];

  useEffect(() => {
    setCountedSet(new Set());
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [question.id]);

  const handleTapItem = (index: number) => {
    if (isAnswered) return;
    const nextSet = new Set(countedSet);
    if (nextSet.has(index)) {
      nextSet.delete(index);
      sound.playPop();
    } else {
      nextSet.add(index);
      sound.playCount(nextSet.size);
    }
    setCountedSet(nextSet);
  };

  const handleSelectOption = (opt: number | string) => {
    if (isAnswered) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    const isCorrect = Number(opt) === Number(question.correctAnswer);
    if (isCorrect) {
      sound.playCorrect();
      fireStarBurst();
    } else {
      sound.playWrong();
    }

    onAnswer(isCorrect);
  };

  const handleResetCount = () => {
    sound.playClick();
    setCountedSet(new Set());
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      {/* Game Card */}
      <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-3 border-amber-200 cartoon-shadow">
        {/* Header Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🦁 Counting Safari · Level {question.level}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            {question.prompt}
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {question.subPrompt}
          </p>
        </div>

        {/* Counter items stage */}
        <div className="relative min-h-[160px] md:min-h-[200px] bg-gradient-to-b from-amber-50/70 to-emerald-50/40 rounded-2xl p-4 md:p-6 border-2 border-dashed border-amber-300 flex flex-wrap items-center justify-center gap-3 md:gap-4 select-none">
          {items.map((item: any, idx: number) => {
            const isCounted = countedSet.has(idx);
            // Get order number in which it was counted
            const countedArray = Array.from(countedSet);
            const countNum = countedArray.indexOf(idx) + 1;

            return (
              <motion.button
                key={item.id || idx}
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTapItem(idx)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all cursor-pointer ${
                  isCounted
                    ? 'bg-amber-200 ring-4 ring-amber-400 scale-105 shadow-md'
                    : 'bg-white hover:bg-amber-50 shadow-xs border border-amber-200'
                }`}
              >
                {item.emoji}
                {isCounted && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    {countNum}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tapped Count helper */}
        <div className="flex items-center justify-between mt-3 px-2 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>You tapped:</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-sm">
              {countedSet.size}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {countedSet.size > 0 && !isAnswered && (
              <button
                onClick={handleResetCount}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 underline text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Count</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1 text-amber-700 bg-amber-100/80 hover:bg-amber-200 px-2 py-1 rounded-lg"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Hint</span>
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && question.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2"
          >
            <span>💡</span>
            <span>{question.hint}</span>
          </motion.div>
        )}

        {/* Answer Options */}
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase text-slate-600 mb-3 tracking-wider">
            Choose Your Answer:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = Number(opt) === Number(question.correctAnswer);

              let buttonStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200';
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
                  onClick={() => handleSelectOption(opt)}
                  className={`h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm cartoon-button ${buttonStyle}`}
                >
                  {opt}
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
              Number(selectedAnswer) === Number(question.correctAnswer)
                ? 'text-emerald-600'
                : 'text-amber-700'
            }`}>
              {Number(selectedAnswer) === Number(question.correctAnswer)
                ? '🎉 Super Job! That is totally right! ⭐'
                : `Nice try! The correct count was ${question.correctAnswer}! 🌟`}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Challenge</span>
              <span>➔</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
