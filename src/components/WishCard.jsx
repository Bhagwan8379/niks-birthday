import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Mail, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const wishesList = [
  {
    category: "From Unknown 🤫",
    content: "Sorry... me dusryachya haatun tula wish karto aahe, pn tu always special aahe mazya saathi. 💛"
  }
];

const WishCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWishIndex, setActiveWishIndex] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
    // Fire confetti on opening the card
    confetti({
      particleCount: 80,
      angle: 90,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff7597', '#8b5cf6', '#3b82f6', '#10b981']
    });
  };

  const nextWish = (e) => {
    e.stopPropagation();
    setActiveWishIndex((prev) => (prev + 1) % wishesList.length);
  };

  const prevWish = (e) => {
    e.stopPropagation();
    setActiveWishIndex((prev) => (prev - 1 + wishesList.length) % wishesList.length);
  };

  return (
    <section className="relative min-h-fit md:min-h-screen py-12 md:py-24 px-4 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Glow Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-brand-purple/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-brand-pink/10 rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 text-brand-pink mb-3">
            <Mail className="w-5 h-5" />
            <span className="font-sans font-semibold tracking-wider text-xs uppercase">Your Wishes</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-glow text-white mb-4">
            The Interactive Wish Card
          </h2>
          <p className="text-slate-400 font-sans max-w-md mx-auto text-sm md:text-base">
            Click on the envelope to open a personalized handwritten card containing heartfelt wishes just for you!
          </p>
        </div>

        {/* Envelope Container */}
        <div className="relative w-full max-w-lg aspect-[4/3] md:aspect-[3/2] flex items-center justify-center py-6">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Closed Envelope */
              <motion.div
                key="closed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={handleOpen}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer relative w-full h-[280px] md:h-[320px] rounded-2xl glassmorphism-card border-white/20 p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
              >
                {/* Envelope Flap visual representation in styling */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 via-transparent to-transparent pointer-events-none"></div>

                {/* Back flap lines */}
                <svg className="absolute inset-0 w-full h-full stroke-white/10 fill-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 0 L 250 150 L 500 0" strokeWidth="1.5" />
                  <path d="M 0 320 L 250 150 L 500 320" strokeWidth="1.5" />
                </svg>

                {/* Sender Title */}
                <div className="flex justify-between items-start z-10">
                  <div className="text-slate-400 font-sans text-xs tracking-widest uppercase">
                    From: Unknown
                  </div>
                  <Mail className="w-5 h-5 text-brand-pink/70" />
                </div>

                {/* Wax Seal Center button */}
                <div className="flex flex-col items-center justify-center z-10 self-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-rose-500 shadow-lg shadow-brand-pink/35 flex items-center justify-center relative border border-white/30"
                  >
                    <Heart className="w-7 h-7 text-white fill-current animate-pulse" />
                    {/* Ring animations */}
                    <div className="absolute inset-0 rounded-full border border-white/40 animate-ping"></div>
                  </motion.div>
                  <span className="text-xs text-slate-300 tracking-wider font-semibold uppercase mt-3 animate-pulse">
                    Click Seal to Open
                  </span>
                </div>

                {/* Stamp visual */}
                <div className="flex justify-between items-end z-10 text-slate-400 font-sans text-xs">
                  <span>To: Nik ❤️</span>
                  <div className="w-12 h-10 border border-dashed border-white/20 rounded flex items-center justify-center text-[10px] text-slate-500 tracking-widest font-bold font-sans uppercase">
                    July 6
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Opened Envelope with Slide-Out Letter Card */
              <motion.div
                key="open"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center"
              >
                {/* Envelope Backing */}
                <div className="absolute bottom-0 w-full h-[220px] bg-brand-dark/90 glassmorphism rounded-2xl border border-white/10 z-0"></div>

                {/* Sliding-Out Letter Paper */}
                <motion.div
                  initial={{ y: 150, scale: 0.85, opacity: 0 }}
                  animate={{ y: -30, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                  className="z-20 w-[94%] md:w-[96%] bg-gradient-to-b from-white to-slate-100 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-300/80 text-slate-800 flex flex-col justify-between h-[340px] md:h-[370px]"
                >
                  {/* Decorative Elements */}
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-200 pb-3">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      {wishesList[activeWishIndex].category}
                    </span>
                    <Sparkles className="w-4 h-4 text-brand-pink" />
                  </div>

                  {/* Letter body */}
                  <div className="my-auto py-4 overflow-hidden h-40 relative w-full flex items-center justify-center">
                    <motion.div
                      key={activeWishIndex}
                      initial={{ y: 110 }}
                      animate={{ y: -130 }}
                      style={{ willChange: "transform", transform: "translateZ(0)" }}
                      transition={{
                        ease: "linear",
                        duration: 22,
                        repeat: Infinity,
                      }}
                      className="absolute w-full px-2 text-center backface-hidden"
                    >
                      <p className="font-handwritten text-xl md:text-2xl font-bold leading-relaxed text-slate-800 tracking-wide select-text antialiased">
                        "{wishesList[activeWishIndex].content}"
                      </p>
                    </motion.div>
                  </div>

                  {/* Letter Footer Navigation */}
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-2 z-10">
                    <button
                      onClick={prevWish}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1.5">
                      {wishesList.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            i === activeWishIndex ? "bg-brand-pink" : "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="text-brand-pink font-bold text-xs select-none flex items-center gap-1"
                      >
                        <span>Click Next</span>
                        <span>👉</span>
                      </motion.span>
                      
                      <motion.button
                        onClick={nextWish}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="p-2 rounded-full bg-gradient-to-r from-brand-pink to-rose-500 hover:opacity-95 text-white transition-all duration-300 cursor-pointer shadow-md shadow-brand-pink/20"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Close Letter Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute bottom-[-50px] px-4 py-2 rounded-full glassmorphism border-brand-pink/20 hover:border-brand-pink/50 text-slate-300 hover:text-white transition-all duration-300 text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Close Card ✉️
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WishCard;
