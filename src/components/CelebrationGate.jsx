import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Headphones } from 'lucide-react';
import confetti from 'canvas-confetti';

const CelebrationGate = ({ onEnter }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    
    // Confetti explosion from sides
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff7597', '#8b5cf6', '#a78bfa', '#f59e0b']
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff7597', '#8b5cf6', '#a78bfa', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Delay calling parent enter trigger
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  // Generate background elements
  const stars = [...Array(25)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 95}%`,
    left: `${Math.random() * 95}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  }));

  const hearts = [...Array(5)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 80 + 10}%`,
    size: Math.random() * 14 + 10,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 4,
  }));

  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07040f] select-none px-4"
          exit={{ 
            opacity: 0,
            scale: 1.15,
            filter: 'blur(12px)',
            transition: { duration: 0.9, ease: 'easeInOut' } 
          }}
        >
          {/* Custom CSS for Butterflies, Flame and Sound Visualizer */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fly-path-1 {
              0% { transform: translate(-30px, 40px) rotate(0deg) scale(0.9); }
              50% { transform: translate(30px, -20px) rotate(20deg) scale(1.1); }
              100% { transform: translate(-30px, 40px) rotate(0deg) scale(0.9); }
            }
            @keyframes flap-l {
              0%, 100% { transform: rotateY(0deg); }
              50% { transform: rotateY(70deg); }
            }
            @keyframes flap-r {
              0%, 100% { transform: rotateY(0deg); }
              50% { transform: rotateY(-70deg); }
            }
            @keyframes bar-wave {
              0%, 100% { transform: scaleY(0.3); }
              50% { transform: scaleY(1); }
            }
          ` }} />

          {/* ==========================================
              BACKGROUND GRAPHICS (Stars, Auroras, Bokeh Boxes)
              ========================================== */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Stars */}
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.7, 0.1] }}
                transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
                style={{ top: star.top, left: star.left, width: star.size, height: star.size, boxShadow: '0 0 5px #fff' }}
                className="absolute bg-white rounded-full"
              />
            ))}

            {/* Glowing Auroras */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2.5s' }}></div>

            {/* Bokeh Out-of-focus Boxes (Floating) */}
            {/* Top Left Box */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [-8, -4, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[8%] left-[5%] w-24 h-24 filter blur-[2px] opacity-25"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_#8b5cf6]">
                <rect x="20" y="40" width="60" height="45" rx="3" fill="#6366f1" />
                <rect x="15" y="30" width="70" height="12" rx="2" fill="#818cf8" />
                <rect x="45" y="30" width="10" height="55" fill="#fde047" />
                <path d="M 50 30 Q 35 15 45 25 Z M 50 30 Q 65 15 55 25 Z" fill="#fde047" />
              </svg>
            </motion.div>

            {/* Bottom Left Box */}
            <motion.div 
              animate={{ y: [0, 15, 0], rotate: [5, 10, 5] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-[10%] left-[8%] w-28 h-28 filter blur-[3px] opacity-20"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_#ec4899]">
                <rect x="20" y="40" width="60" height="45" rx="3" fill="#db2777" />
                <rect x="15" y="30" width="70" height="12" rx="2" fill="#f472b6" />
                <rect x="45" y="30" width="10" height="55" fill="#a78bfa" />
                <path d="M 50 30 Q 35 15 45 25 Z M 50 30 Q 65 15 55 25 Z" fill="#a78bfa" />
              </svg>
            </motion.div>
          </div>

          {/* ==========================================
              FLOATING HEARTS & BUTTERFLIES
              ========================================== */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Hearts */}
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.45, 0.45, 0], scale: [0.8, 1.2, 0.9], y: [0, -100] }}
                transition={{ duration: heart.duration, repeat: Infinity, delay: heart.delay }}
                style={{ left: heart.left, top: heart.top, width: heart.size, height: heart.size }}
                className="absolute text-brand-pink/30 flex items-center justify-center"
              >
                <Heart className="w-full h-full fill-current" />
              </motion.div>
            ))}

            {/* Glowing Butterflies */}
            {/* Top Right Butterfly */}
            <div className="absolute top-[12%] right-[10%] w-10 h-10" style={{ animation: 'fly-path-1 15s ease-in-out infinite' }}>
              <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_10px_#a78bfa]">
                <div style={{ transformOrigin: 'right center', animation: 'flap-l 0.14s linear infinite' }} className="w-4 h-6 bg-gradient-to-l from-purple-400 to-indigo-500 rounded-l-full rotate-[-12deg] absolute right-[52%]" />
                <div className="w-1.2 h-4.5 bg-white/80 rounded-full" />
                <div style={{ transformOrigin: 'left center', animation: 'flap-r 0.14s linear infinite' }} className="w-4 h-6 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-r-full rotate-[12deg] absolute left-[52%]" />
              </div>
            </div>

            {/* Left/Middle Butterfly */}
            <div className="absolute top-[48%] left-[12%] w-8 h-8" style={{ animation: 'fly-path-1 12s ease-in-out infinite', animationDelay: '3s' }}>
              <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_8px_#f472b6]">
                <div style={{ transformOrigin: 'right center', animation: 'flap-l 0.16s linear infinite' }} className="w-3 h-5 bg-gradient-to-l from-pink-400 to-rose-500 rounded-l-full rotate-[-12deg] absolute right-[52%]" />
                <div className="w-1 h-3.5 bg-white/80 rounded-full" />
                <div style={{ transformOrigin: 'left center', animation: 'flap-r 0.16s linear infinite' }} className="w-3 h-5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-r-full rotate-[12deg] absolute left-[52%]" />
              </div>
            </div>
          </div>

          {/* ==========================================
              MAIN CORE GATE LAYOUT
              ========================================== */}
          <div className="text-center relative max-w-xl z-20 flex flex-col items-center">
            
            {/* Top Sparkle heart badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center justify-center gap-1.5 mb-6 text-brand-pink relative"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300 absolute -left-6" />
              <Heart className="w-7 h-7 fill-current drop-shadow-[0_0_10px_#ff7597] animate-pulse" />
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300 absolute -right-6" style={{ animationDelay: '0.6s' }} />
            </motion.div>

            {/* Split Styled Heading */}
            <div className="mb-4">
              <motion.h3
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-handwritten text-3xl md:text-4xl text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)] mb-1"
              >
                A Magical
              </motion.h3>

              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-glow select-none"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">Box Awaits</span>
                <span className="text-slate-100 block mt-2">You...</span>
              </motion.h1>
            </div>

            {/* Paragraph Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-sm md:text-base font-sans tracking-wide max-w-sm mx-auto mb-10 leading-relaxed"
            >
              Step into a digital celebration crafted just for your special day. Click the gift to <span className="text-brand-pink font-semibold">unlock the magic!</span>
            </motion.p>

            {/* ==========================================
                THE MAGIC BUBBLE & GIFT CENTERPIECE
                ========================================== */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative cursor-pointer group w-64 h-64 md:w-72 md:h-72 rounded-full border border-pink-500/25 flex items-center justify-center bg-gradient-to-br from-pink-500/5 to-purple-800/10 shadow-[0_0_40px_rgba(236,72,153,0.15)] select-none hover:shadow-[0_0_60px_rgba(236,72,153,0.3)] transition-all duration-500"
            >
              {/* Spherical Gloss overlay */}
              <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>

              {/* Glowing Ambient Bubble Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-pink/30 animate-pulse pointer-events-none"></div>

              {/* Vector Gift Box SVG (Purple & Gold wrapped) */}
              <svg className="w-36 h-36 drop-shadow-[0_0_18px_rgba(139,92,246,0.35)] animate-celebrate" viewBox="0 0 100 100">
                <rect x="20" y="45" width="60" height="45" rx="4" fill="url(#gate-box-g)" />
                <rect x="15" y="33" width="70" height="14" rx="3" fill="url(#gate-lid-g)" />
                <rect x="44" y="33" width="12" height="57" fill="#fbbf24" />
                <path d="M 50 33 Q 32 12 44 26 Z" fill="#fbbf24" style={{ transformOrigin: 'center bottom', animation: 'ribbon-wave 3s ease-in-out infinite' }} />
                <path d="M 50 33 Q 68 12 56 26 Z" fill="#fbbf24" style={{ transformOrigin: 'center bottom', animation: 'ribbon-wave 3s ease-in-out infinite', animationDelay: '1.5s' }} />
                
                <defs>
                  <linearGradient id="gate-box-g" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                  <linearGradient id="gate-lid-g" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Rounded Glowing OPEN GIFT Badge Overlay */}
              <div className="absolute w-32 h-20 bg-slate-950/80 border border-brand-pink/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-2xl shadow-pink-500/10 backdrop-blur-md group-hover:border-brand-pink transition-all duration-300">
                <Gift className="w-5 h-5 text-brand-pink group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] font-sans font-bold tracking-widest text-slate-200 group-hover:text-brand-pink transition-colors duration-300 uppercase">
                  Open Gift
                </span>
                {/* Micro underline border */}
                <div className="w-8 h-[1px] bg-brand-pink/40"></div>
              </div>
            </motion.div>

            {/* ==========================================
                HEADPHONES SOUND PILL INDICATOR
                ========================================== */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-950/60 border border-white/10 shadow-lg text-slate-300 text-xs font-sans mt-12 backdrop-blur-sm select-none"
            >
              {/* Headphones Icon */}
              <Headphones className="w-4 h-4 text-brand-pink" />
              
              {/* Text */}
              <span className="tracking-wide">
                Turn on your volume for the <span className="text-brand-pink font-semibold">best experience</span>
              </span>

              {/* Interactive Visualizer Graphic (5 animating bars) */}
              <div className="flex items-end gap-0.5 h-3.5 w-6 select-none pointer-events-none">
                {[
                  { delay: '0.1s', duration: '0.8s' },
                  { delay: '0.3s', duration: '0.5s' },
                  { delay: '0s', duration: '0.7s' },
                  { delay: '0.4s', duration: '0.6s' },
                  { delay: '0.2s', duration: '0.9s' },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    style={{
                      animation: `bar-wave ${bar.duration} ease-in-out infinite`,
                      animationDelay: bar.delay,
                      transformOrigin: 'bottom center',
                    }}
                    className="w-0.75 h-full bg-brand-pink rounded-t-sm"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationGate;
