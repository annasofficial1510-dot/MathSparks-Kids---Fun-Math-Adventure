import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/soundEffects';
import { ShieldCheck, X } from 'lucide-react';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(6);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const a = Math.floor(Math.random() * 5) + 6; // 6 to 10
      const b = Math.floor(Math.random() * 5) + 5; // 5 to 9
      setNumA(a);
      setNumB(b);
      setInputVal('');
      setErrorMsg(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const expectedAnswer = numA * numB;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(inputVal.trim(), 10) === expectedAnswer) {
      sound.playCorrect();
      onSuccess();
    } else {
      sound.playWrong();
      setErrorMsg(true);
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border-3 border-indigo-200 cartoon-shadow text-center relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-slate-800">Parents Zone</h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Please solve this quick problem to verify you are a grown-up:
        </p>

        <form onSubmit={handleVerify} className="mt-5">
          <div className="text-3xl font-black text-indigo-900 bg-indigo-50/80 py-3 rounded-2xl border border-indigo-200 mb-4 font-mono">
            {numA} × {numB} = ?
          </div>

          <input
            type="number"
            autoFocus
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setErrorMsg(false);
            }}
            placeholder="Answer"
            className="w-full text-center text-2xl font-black p-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-hidden mb-2"
          />

          {errorMsg && (
            <p className="text-xs font-bold text-rose-500 mb-2">
              Incorrect answer. Please try again!
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm cartoon-button cursor-pointer"
            >
              Enter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
