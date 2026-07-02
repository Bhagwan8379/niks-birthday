import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const fortunes = [
  "Wishing you a year ahead full of success, peace, and new milestones, Nik! 🌟",
  "May your heart be happy and your beautiful smile never fade, Nikita! 😊",
  "Wishing you healthy, joyful, and magical moments today and every single day! 🎂",
  "May every path you take lead to success, and may all your dreams come true! ✨",
  "Nik, may this birthday bring you double the laughter, cake, and sweet surprises! 🎁",
  "Wishing you endless happiness and pure positive energy in this new chapter! 💖",
  "May your year be filled with beautiful achievements and unforgettable memories! 🚀",
  "Nikita, may you keep shining bright and bringing joy to everyone around you! 🎉",
  "Always keep laughing and smiling—it brings so much light to the world! 😄",
  "Wishing you the strength and belief to achieve everything you set your mind to! 💫"
];

const FortuneJar = () => {
  const [currentFortune, setCurrentFortune] = useState(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const [pulledFortunes, setPulledFortunes] = useState([]);

  const pullFortune = () => {
    if (isWiggling) return;
    setIsWiggling(true);

    // Confetti spray inside
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 30,
      origin: { y: 0.7 },
      colors: ['#a78bfa', '#ff7597', '#f43f5e']
    });

    setTimeout(() => {
      // Pick a random fortune that wasn't the last one
      let idx;
      do {
        idx = Math.floor(Math.random() * fortunes.length);
      } while (fortunes[idx] === currentFortune && fortunes.length > 1);

      const fortuneText = fortunes[idx];
      setCurrentFortune(fortuneText);
      
      // Save to pulled list (preventing duplicates in list)
      if (!pulledFortunes.includes(fortuneText)) {
        setPulledFortunes(prev => [fortuneText, ...prev]);
      }

      setIsWiggling(false);
      
      // Giant confetti celebratory burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff7597', '#8b5cf6', '#3b82f6']
      });
    }, 1000);
  };

  return (
    <section className="relative min-h-fit md:min-h-screen py-12 md:py-24 px-4 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Glow circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-pink/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 text-brand-pink mb-3">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-sans font-semibold tracking-wider text-xs uppercase">Birthday Blessings</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-glow-purple text-white mb-4">
            Jar of Blessings
          </h2>
          <p className="text-slate-400 font-sans max-w-md mx-auto text-sm md:text-base">
            Reach inside the magic jar to pull a random birthday blessing, sweet wish, or beautiful compliment!
          </p>
        </div>

        {/* Jar Visual Representation */}
        <div className="relative w-full max-w-md flex flex-col items-center">
          
          {/* Glowing pedestal/glow backing */}
          <div className="absolute bottom-20 w-44 h-4 bg-brand-pink/30 rounded-full blur-xl animate-pulse-slow"></div>

          {/* Jar Container */}
          <motion.div
            animate={isWiggling ? {
              rotate: [0, -8, 8, -6, 6, -3, 3, 0],
              y: [0, -4, -4, -2, -2, 0],
              transition: { duration: 1, ease: 'easeInOut' }
            } : {}}
            onClick={pullFortune}
            className="relative cursor-pointer group w-52 h-64 flex flex-col items-center justify-end pb-8"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-brand-pink/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            {/* Glass Jar Body */}
            <div className="absolute inset-0 rounded-b-[40px] rounded-t-[30px] border-2 border-white/20 bg-white/5 backdrop-blur-md shadow-2xl flex flex-col items-center justify-between py-6 overflow-hidden">
              {/* Reflection Highlight */}
              <div className="absolute top-0 left-4 w-4 h-full bg-white/10 rounded-full blur-[1px]"></div>
              
              {/* Jar Neck and Rim */}
              <div className="absolute top-0 w-24 h-4 bg-white/10 border-b border-white/20 rounded-b-md"></div>
              
              {/* Inner glowing stars */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Star className="w-8 h-8 text-yellow-300 fill-current animate-ping opacity-60" />
                <Star className="absolute top-12 left-10 w-4 h-4 text-purple-300 fill-current animate-bounce opacity-50" />
                <Star className="absolute bottom-16 right-12 w-5 h-5 text-pink-300 fill-current animate-pulse opacity-50" />
              </div>

              {/* Magical Label */}
              <div className="z-10 py-1 px-4 bg-white/10 border border-white/20 rounded-full shadow-inner">
                <span className="font-handwritten text-xl font-bold text-pink-300 select-none">
                  Blessings Jar
                </span>
              </div>

              {/* Heart floating inside */}
              <Heart className="w-12 h-12 text-brand-pink fill-current animate-celebrate opacity-80 z-10" />
            </div>

            {/* Jar Lid */}
            <div className="absolute top-[-8px] w-28 h-6 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full shadow-lg border border-white/30 z-10"></div>
          </motion.div>

          {/* Action Instruction */}
          <button
            onClick={pullFortune}
            className="mt-8 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-pink/30 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isWiggling ? "animate-spin" : ""}`} />
            <span>Pull a Blessing</span>
          </button>
        </div>
      </div>

      {/* Fortune Overlay / Modal */}
      <AnimatePresence>
        {currentFortune && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentFortune(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glassmorphism-card max-w-md w-full p-8 rounded-3xl border border-brand-pink/30 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Background gradient spark */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-pink/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="inline-flex p-4 rounded-full bg-brand-pink/10 border border-brand-pink/25 text-brand-pink mb-6">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-4">
                Your Birthday Blessing ✨
              </h3>

              <p className="font-handwritten text-2xl text-pink-100 font-semibold leading-relaxed mb-8 px-2 select-text">
                "{currentFortune}"
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentFortune(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-pink to-brand-purple text-white text-xs font-semibold tracking-wider rounded-xl uppercase shadow border border-white/10 cursor-pointer"
                >
                  Receive Blessing 💖
                </motion.button>
                <button
                  onClick={() => {
                    setCurrentFortune(null);
                    pullFortune();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 font-sans tracking-wide py-1 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>🔄</span>
                  <span>Pull Another Blessing</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FortuneJar;
