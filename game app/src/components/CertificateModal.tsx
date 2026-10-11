import React from 'react';
import { motion } from 'motion/react';
import { ChildProfile } from '../types/math';
import { MASCOTS_INFO } from '../services/storage';
import { sound } from '../utils/soundEffects';
import { Printer, X, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  if (!isOpen) return null;

  const mascot = MASCOTS_INFO[profile.mascot];
  const unlockedBadges = profile.badges.filter(b => b.unlocked).length;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border-4 border-amber-300 shadow-2xl relative my-auto print:border-none print:shadow-none print:p-0"
      >
        {/* Controls - Hidden during print */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Official MathSparks Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="border-8 border-double border-amber-300 rounded-2xl p-6 md:p-10 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 text-center relative overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-2xl text-amber-400">⭐</div>
          <div className="absolute top-2 right-2 text-2xl text-amber-400">⭐</div>
          <div className="absolute bottom-2 left-2 text-2xl text-amber-400">⭐</div>
          <div className="absolute bottom-2 right-2 text-2xl text-amber-400">⭐</div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="font-extrabold text-xs uppercase tracking-widest text-amber-800">
              MathSparks Academy of Learning
            </span>
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-serif mt-2">
            Certificate of Excellence
          </h2>

          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-4">
            This certificate is proudly awarded to
          </p>

          {/* Child's Name */}
          <div className="text-4xl md:text-5xl font-extrabold text-amber-600 my-4 border-b-2 border-amber-300 inline-block px-8 pb-2">
            {profile.name}
          </div>

          <p className="text-sm md:text-base text-slate-700 max-w-lg mx-auto font-medium leading-relaxed">
            For outstanding dedication, mathematical curiosity, and wonderful effort in mastering basic math skills, counting, addition, and patterns!
          </p>

          {/* Achievement Badges & Stats in Certificate */}
          <div className="flex items-center justify-center gap-6 my-6 text-xs md:text-sm font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-amber-100/70 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="text-lg">⭐</span>
              <span>{profile.stars} Stars Earned</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{profile.totalCorrect} Math Problems Solved</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-100/70 px-3 py-1.5 rounded-xl border border-purple-200">
              <span className="text-lg">🏆</span>
              <span>{unlockedBadges} Badges Won</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-amber-200 flex items-end justify-around text-center">
            <div>
              <div className="font-serif italic text-lg text-slate-800 font-bold">
                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1 border-t border-slate-300 pt-1">
                Date Awarded
              </div>
            </div>

            {/* Mascot Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-3xl shadow-md border-2 border-white ring-2 ring-amber-300">
                {profile.mascot === 'lion' ? '🦁' : profile.mascot === 'bunny' ? '🐰' : profile.mascot === 'robot' ? '🤖' : profile.mascot === 'unicorn' ? '🦄' : '🐻'}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1 border-t border-slate-300 pt-1">
                Signed by {mascot.name}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
