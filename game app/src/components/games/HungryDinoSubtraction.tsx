import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathQuestion } from '../../types/math';
import { sound } from '../../utils/soundEffects';
import { fireStarBurst } from '../../utils/confetti';
import { Lightbulb } from 'lucide-react';

interface HungryDinoSubtractionProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const HungryDinoSubtraction: React.FC<HungryDinoSubtractionProps> = ({
  question,
  onAnswer,
  onNextQuestion,
}) => {
  const [eatenCount, setEatenCount] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [dinoMunch, setDinoMunch] = useState<boolean>(false);

  const visual = question.visualData || {};
  const total = visual.total || 5;
  const targetEaten = visual.eaten || 2;
  const itemEmoji = visual.itemEmoji || '🍪';
  const itemName = visual.itemName || 'Cookies';

  useEffect(() => {
    setEatenCount(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setDinoMunch(false);
  }, [question.id]);

  const handleFeedSnack = (idx: number) => {
    if (isAnswered) return;
    if (eatenCount < total) {
      sound.playPop();
      setEatenCount(prev => prev + 1);
      setDinoMunch(true);
      setTimeout(() => setDinoMunch(false), 400);
    }
  };

  const handleAutoFeedTarget = () => {
    sound.playClick();
    setEatenCount(targetEaten);
    setDinoMunch(true);
    setTimeout(() => setDinoMunch(false), 400);
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

  const remainingOnPlate = Math.max(0, total - eatenCount);

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-3 border-emerald-200 cartoon-shadow">
        {/* Header Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🦕 Hungry Dino Subtraction · Level {question.level}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            {question.prompt}
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Tap snacks to feed Dino {targetEaten} {itemName.toLowerCase()}!
          </p>
        </div>

        {/* Dino & Plate Stage */}
        <div className="bg-gradient-to-b from-emerald-50 to-teal-50/40 rounded-2xl p-4 md:p-6 border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-around gap-4">
          {/* Dino Character */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={dinoMunch ? { scale: [1, 1.25, 0.95, 1], rotate: [0, -8, 8, 0] } : {}}
              className="w-24 h-24 rounded-3xl bg-emerald-100 border-3 border-emerald-300 flex items-center justify-center text-5xl shadow-sm relative"
            >
              🦕
              {dinoMunch && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: -20 }}
                  className="absolute -top-4 font-black text-emerald-700 text-xs bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow-xs"
                >
                  CHOMP! 😋
                </motion.span>
              )}
            </motion.div>
            <span className="text-xs font-bold text-emerald-800 mt-1.5">
              Fed: {eatenCount} / {targetEaten}
            </span>
          </div>

          {/* Snack Plate */}
          <div className="flex-1 w-full flex flex-col items-center bg-white/95 p-4 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between w-full">
              <span>Plate ({remainingOnPlate} left)</span>
              {eatenCount !== targetEaten && (
                <button
                  onClick={handleAutoFeedTarget}
                  className="text-[11px] text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-2 py-0.5 rounded-md font-bold"
                >
                  Feed Dino {targetEaten}
                </button>
              )}
            </div>

            {/* Grid of snacks */}
            <div className="flex flex-wrap justify-center gap-2 min-h-[70px]">
              {Array.from({ length: total }).map((_, i) => {
                const isEaten = i < eatenCount;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleFeedSnack(i)}
                    disabled={isEaten || isAnswered}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border transition-all cursor-pointer ${
                      isEaten
                        ? 'opacity-20 bg-slate-100 border-dashed border-slate-300 line-through scale-75'
                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-2xs'
                    }`}
                  >
                    {isEaten ? '💨' : itemEmoji}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hint toggle */}
        <div className="flex justify-end mt-3 px-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg"
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hint</span>
          </button>
        </div>

        {showHint && question.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2"
          >
            <span>💡</span>
            <span>{question.hint}</span>
          </motion.div>
        )}

        {/* Options */}
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase text-slate-600 mb-3 tracking-wider">
            How many are left?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = Number(opt) === Number(question.correctAnswer);

              let buttonStyle = 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-2 border-slate-200';
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
                ? '🦕 Yummy! Dino is full and you solved it! +1 Star ⭐'
                : `Nice attempt! ${total} - ${targetEaten} leaves ${question.correctAnswer}! 🌟`}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Dino Snack</span>
              <span>➔</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
