import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Trash2, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_BLESSINGS = [
  {
    id: 'preset-1',
    from: 'Unknown 🤫',
    message: "Sorry, I am wishing you through someone else, but you will always be special to me. 💖",
    color: 'bg-gradient-to-br from-pink-500/25 to-rose-600/20 border-pink-400/40',
    rotation: -2,
    isPreset: true,
  },
];


const COLORS = [
  { id: 'pink', value: 'bg-gradient-to-br from-pink-500/25 to-rose-600/20 border-pink-400/40', dot: 'bg-pink-400' },
  { id: 'purple', value: 'bg-gradient-to-br from-purple-500/25 to-indigo-600/20 border-purple-400/40', dot: 'bg-purple-400' },
  { id: 'yellow', value: 'bg-gradient-to-br from-amber-500/20 to-orange-600/15 border-amber-400/40', dot: 'bg-amber-400' },
  { id: 'green', value: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/15 border-emerald-400/40', dot: 'bg-emerald-400' },
];

const BlessingsBoard = () => {
  const [blessings, setBlessings] = useState([]);
  const [fromName, setFromName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  // Load from LocalStorage + merge presets
  useEffect(() => {
    const saved = localStorage.getItem('birthday_blessings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBlessings([...PRESET_BLESSINGS, ...parsed]);
      } catch (e) {
        setBlessings(PRESET_BLESSINGS);
      }
    } else {
      setBlessings(PRESET_BLESSINGS);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromName.trim() || !message.trim()) return;

    const newBlessing = {
      id: 'user-' + Date.now(),
      from: fromName.trim(),
      message: message.trim(),
      color: selectedColor,
      rotation: Math.random() * 6 - 3, // Random tilt
      isPreset: false,
    };

    const updatedUserBlessings = [
      ...blessings.filter(b => !b.isPreset),
      newBlessing
    ];
    
    // Save only user ones to LocalStorage
    localStorage.setItem('birthday_blessings', JSON.stringify(updatedUserBlessings));
    
    // Show in UI
    setBlessings([...PRESET_BLESSINGS, ...updatedUserBlessings]);

    // Reset Form
    setFromName('');
    setMessage('');
    
    // Show feedback
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#ff7597', '#8b5cf6', '#3b82f6']
    });
  };

  const handleDelete = (id) => {
    const updatedUserBlessings = blessings
      .filter(b => !b.isPreset && b.id !== id);
    
    localStorage.setItem('birthday_blessings', JSON.stringify(updatedUserBlessings));
    setBlessings([...PRESET_BLESSINGS, ...updatedUserBlessings]);
  };

  return (
    <section className="relative min-h-fit md:min-h-screen py-12 md:py-24 px-4 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-brand-purple/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-pink/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 text-brand-pink mb-3">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
            <span className="font-sans font-semibold tracking-wider text-xs uppercase">Blessings Wall</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-glow text-white mb-4">
            The Digital Blessings Board
          </h2>
          <p className="text-slate-400 font-sans max-w-md mx-auto text-sm md:text-base">
            Leave a beautiful blessing, a sweet message, or a funny memory. Your card will float onto the board instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Form Panel */}
          <div className="glassmorphism-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl lg:sticky lg:top-24">
            <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquarePlus className="w-6 h-6 text-brand-pink" />
              Write a Blessing
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-sans font-bold tracking-widest text-slate-400 uppercase mb-2">
                  Your Name / Relation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya (Cousin)"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold tracking-widest text-slate-400 uppercase mb-2">
                  Your Blessing Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="May you have an incredible year ahead..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={180}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition-all duration-300 resize-none"
                />
                <div className="text-right text-[10px] text-slate-500 mt-1">
                  {message.length}/180 characters
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                  Select Card Theme
                </label>
                <div className="flex gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.value)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        selectedColor === c.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${c.dot}`} />
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-brand-purple text-white font-sans font-semibold rounded-xl shadow-lg border border-white/10 cursor-pointer text-sm tracking-wider hover:opacity-95 transition-all duration-300"
              >
                Post onto Wall ✨
              </motion.button>
            </form>
          </div>

          {/* Right Board Grid (2/3 columns) */}
          <div className="lg:col-span-2 min-h-[400px] border border-white/5 bg-slate-950/20 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#251b47_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence initial={false}>
                {blessings.map((b) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 30, rotate: b.rotation }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: b.rotation }}
                    exit={{ opacity: 0, scale: 0.8, y: -30 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className={`p-5 pb-6 rounded-2xl border backdrop-blur-md shadow-lg relative flex flex-col justify-between min-h-[160px] ${b.color}`}
                  >
                    {/* Note Pin */}
                    <div className="absolute top-[-8px] left-[48%] w-3 h-3 bg-red-400 border border-white rounded-full shadow"></div>

                    {/* Message content */}
                    <p className="font-handwritten text-lg font-semibold text-slate-100 tracking-wide leading-relaxed pb-4 select-text">
                      "{b.message}"
                    </p>

                    {/* Sender & Controls */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                      <span className="font-sans text-xs font-bold text-slate-300 tracking-wide">
                        — {b.from}
                      </span>
                      
                      {!b.isPreset && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1 rounded-full text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                          title="Delete Blessing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {blessings.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500 font-sans text-sm">
                  The blessings board is currently empty. Be the first to add a note!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlessingsBoard;
