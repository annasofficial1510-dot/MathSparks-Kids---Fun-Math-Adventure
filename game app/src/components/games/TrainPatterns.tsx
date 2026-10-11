import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MathQuestion } from '../../types/math';
import { sound } from '../../utils/soundEffects';
import { fireStarBurst } from '../../utils/confetti';
import { Lightbulb } from 'lucide-react';

interface TrainPatternsProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const TrainPatterns: React.FC<TrainPatternsProps> = ({
  question,
  onAnswer,
  onNextQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const visual = question.visualData || {};
  const sequence: (number | string)[] = visual.sequence || [1, 2, '?', 4];
  const missingIdx: number = visual.missingIndex ?? 2;

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [question.id]);

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

  const WAGON_COLORS = [
    'bg-rose-400 border-rose-500 text-white',
    'bg-amber-400 border-amber-500 text-white',
    'bg-emerald-400 border-emerald-500 text-white',
    'bg-sky-400 border-sky-500 text-white',
    'bg-purple-400 border-purple-500 text-white',
  ];

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-3 border-amber-200 cartoon-shadow">
        {/* Header Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            🚂 Mystery Train · Level {question.level}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            {question.prompt}
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Complete the number pattern on the train wagons!
          </p>
        </div>

        {/* Train Stage */}
        <div className="bg-gradient-to-b from-sky-50 to-amber-50/50 rounded-2xl p-4 md:p-6 border-2 border-amber-200 flex flex-col items-center justify-center overflow-x-auto min-h-[190px]">
          {/* Train cars */}
          <div className="flex items-center gap-1.5 md:gap-2 select-none">
            {/* Locomotive Engine */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-3xl flex items-center justify-center shadow-md border-2 border-slate-700 relative">
                🚂
                {/* Smoke puff */}
                <motion.span
                  animate={{ y: [-5, -18], opacity: [0.8, 0], scale: [0.6, 1.2] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute -top-3 left-2 text-xs"
                >
                  💨
                </motion.span>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-400" />
              </div>
            </div>

            {/* Wagon carriages */}
            {sequence.map((item, idx) => {
              const isMissingSlot = idx === missingIdx;
              const wagonColor = WAGON_COLORS[idx % WAGON_COLORS.length];

              return (
                <React.Fragment key={idx}>
                  {/* Hitch connection */}
                  <div className="w-2 md:w-3 h-1.5 bg-slate-400 rounded-full" />

                  {/* Carriage */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isMissingSlot && isAnswered ? { scale: [1, 1.15, 1] } : {}}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl shadow-sm border-2 ${
                        isMissingSlot
                          ? selectedAnswer !== null
                            ? isAnswered && Number(selectedAnswer) === Number(question.correctAnswer)
                              ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-200'
                              : 'bg-rose-400 border-rose-500 text-white'
                            : 'bg-white border-dashed border-amber-400 text-amber-500 animate-pulse'
                          : wagonColor
                      }`}
                    >
                      {isMissingSlot ? (selectedAnswer ?? '?') : item}
                    </motion.div>
                    {/* Carriage wheels */}
                    <div className="flex gap-2 mt-1">
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-400" />
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-400" />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Train Tracks */}
          <div className="w-full flex items-center justify-center gap-1.5 mt-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-2.5 h-1 bg-amber-900/60 rounded-xs" />
            ))}
          </div>
        </div>

        {/* Hint toggle */}
        <div className="flex justify-end mt-3 px-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Hint</span>
          </button>
        </div>

        {showHint && question.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2"
          >
            <span>💡</span>
            <span>{question.hint}</span>
          </motion.div>
        )}

        {/* Options */}
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase text-slate-600 mb-3 tracking-wider">
            Pick The Missing Carriage:
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
                ? '🚂 TOOT TOOT! All aboard the Math Express! ⭐'
                : `Good effort! The missing wagon was ${question.correctAnswer}! 🌟`}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Train</span>
              <span>➔</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
