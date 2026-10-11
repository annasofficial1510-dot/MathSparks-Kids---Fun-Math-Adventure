import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MathQuestion } from '../../types/math';
import { sound } from '../../utils/soundEffects';
import { fireStarBurst } from '../../utils/confetti';
import { Lightbulb } from 'lucide-react';

interface BalloonAdditionProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

const BALLOON_COLORS = [
  'from-pink-400 to-rose-500 text-white border-rose-300',
  'from-sky-400 to-blue-500 text-white border-blue-300',
  'from-amber-400 to-orange-500 text-white border-amber-300',
  'from-emerald-400 to-teal-500 text-white border-emerald-300',
];

export const BalloonAddition: React.FC<BalloonAdditionProps> = ({
  question,
  onAnswer,
  onNextQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const visual = question.visualData || {};
  const numA = visual.numA || 0;
  const numB = visual.numB || 0;
  const itemEmoji = visual.itemEmoji || '🍎';
  const isMissingAddend = visual.missing === 'b';

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

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-3 border-sky-200 cartoon-shadow">
        {/* Header Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-black tracking-widest uppercase text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            🎈 Balloon Pop Addition · Level {question.level}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2 font-mono tracking-tight">
            {question.prompt}
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {question.subPrompt}
          </p>
        </div>

        {/* Visual Grouping Stage */}
        <div className="bg-gradient-to-b from-sky-50 to-blue-50/40 rounded-2xl p-4 md:p-6 border-2 border-sky-200 flex flex-col sm:flex-row items-center justify-around gap-4">
          {/* Group A */}
          <div className="flex flex-col items-center bg-white/90 p-3 rounded-2xl shadow-xs border border-sky-100 min-w-[110px]">
            <span className="text-2xl font-black text-sky-700">{numA}</span>
            <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mt-1.5">
              {Array.from({ length: numA }).map((_, i) => (
                <span key={i} className="text-xl animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
                  {itemEmoji}
                </span>
              ))}
            </div>
          </div>

          <div className="text-3xl font-black text-sky-500">+</div>

          {/* Group B */}
          <div className="flex flex-col items-center bg-white/90 p-3 rounded-2xl shadow-xs border border-sky-100 min-w-[110px]">
            <span className="text-2xl font-black text-sky-700">{isMissingAddend ? '❓' : numB}</span>
            <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mt-1.5">
              {isMissingAddend ? (
                <div className="w-10 h-10 border-2 border-dashed border-sky-300 rounded-xl flex items-center justify-center text-sky-400 font-bold">
                  ?
                </div>
              ) : (
                Array.from({ length: numB }).map((_, i) => (
                  <span key={i} className="text-xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                    {itemEmoji}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="text-3xl font-black text-sky-500">=</div>

          {/* Target Sum preview */}
          <div className="flex flex-col items-center bg-white/90 p-3 rounded-2xl shadow-xs border-2 border-dashed border-sky-300 min-w-[110px]">
            <span className="text-2xl font-black text-sky-800">
              {isAnswered ? question.correctAnswer : '?'}
            </span>
            <span className="text-xs font-bold text-sky-600 mt-1">
              {isMissingAddend ? `Total: ${visual.sum}` : 'Total Sum'}
            </span>
          </div>
        </div>

        {/* Hint button & toggle */}
        <div className="flex justify-end mt-3 px-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 px-2.5 py-1 rounded-lg"
          >
            <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
            <span>Hint</span>
          </button>
        </div>

        {showHint && question.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs font-bold text-sky-900 flex items-center gap-2"
          >
            <span>💡</span>
            <span>{question.hint}</span>
          </motion.div>
        )}

        {/* Floating Balloon Answers */}
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase text-slate-600 mb-4 tracking-wider">
            Pop The Right Balloon!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = Number(opt) === Number(question.correctAnswer);
              const colorGradient = BALLOON_COLORS[idx % BALLOON_COLORS.length];

              let stateClass = '';
              if (isAnswered) {
                if (isCorrectOpt) {
                  stateClass = 'ring-4 ring-emerald-300 scale-108 !from-emerald-500 !to-teal-600 animate-pulse';
                } else if (isSelected) {
                  stateClass = 'opacity-40 scale-90 grayscale';
                } else {
                  stateClass = 'opacity-30 scale-90';
                }
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!isAnswered ? { scale: 1.08, y: -4 } : {}}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`relative h-24 rounded-full bg-gradient-to-b ${colorGradient} flex flex-col items-center justify-center font-black text-2xl shadow-md border-2 cartoon-button cursor-pointer select-none ${stateClass}`}
                >
                  <span className="drop-shadow-xs">{opt}</span>
                  {/* Balloon knot string decoration */}
                  <span className="text-[10px] opacity-80 mt-0.5">🎈</span>
                  <div className="absolute -bottom-2 w-1 h-3 bg-slate-300 rounded-full" />
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
                ? '🎈 POP! You got the right balloon! +1 Star ⭐'
                : `Good effort! The correct answer was ${question.correctAnswer} 🌟`}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black text-lg rounded-2xl shadow-md cartoon-button cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Balloon</span>
              <span>➔</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
