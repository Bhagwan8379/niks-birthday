import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import CelebrationGate from './components/CelebrationGate';
import HeroSection from './components/HeroSection';
import WishCard from './components/WishCard';
import MemoryGallery from './components/MemoryGallery';
import BlessingsBoard from './components/BlessingsBoard';
import FortuneJar from './components/FortuneJar';
import AudioPlayer from './components/AudioPlayer';
import SeenSection from './components/SeenSection';
import { Heart, Stars } from 'lucide-react';

const App = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize smooth scroll (Lenis) and Audio Object
  useEffect(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Instantiate HTML Audio element
    audioRef.current = new Audio("/birthday.mp3");
    audioRef.current.loop = true;

    return () => {
      lenis.destroy();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Audio autoplay blocked by browser policies:", err);
        setIsPlaying(false);
      });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden font-sans select-none">
      
      {/* Celebration Gate Intro Screen */}
      <CelebrationGate onEnter={handleEnter} />

      {/* Main Website Content (Visible after entering) */}
      {hasEntered && (
        <>
          {/* Ambient Background Audio Controller */}
          <AudioPlayer 
            audioRef={audioRef} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
          />

          {/* Core Birthday Sections */}
          <main className="w-full">
            {/* Hero Banner with floating balloons */}
            <div id="home">
              <HeroSection 
                name="Nikita" 
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

            {/* Polaroid Gallery Grid */}
            <div id="gallery">
              <MemoryGallery />
            </div>

            {/* Envelope Interactive Wish Card */}
            <div id="wishes">
              <WishCard />
            </div>

            {/* Fortune Jar Mini-game */}
            <div id="surprise">
              <FortuneJar />
            </div>

            {/* Virtual Board for custom blessings */}
            <div id="blessings">
              <BlessingsBoard />
            </div>

            {/* Notification and Seen Indicator Section */}
            <SeenSection />
          </main>

          {/* Premium Animated Footer */}
          <footer className="relative py-12 px-4 border-t border-white/5 bg-slate-950/40 text-center backdrop-blur-sm select-none">
            {/* Decorative spark bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-10 w-24 h-24 bg-brand-pink/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-1/2 right-10 w-24 h-24 bg-brand-purple/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4">
              {/* Footer Logo/Aesthetic */}
              <div className="flex items-center gap-2 text-brand-pink animate-celebrate">
                <Stars className="w-5 h-5" />
                <Heart className="w-5 h-5 fill-current" />
                <Stars className="w-5 h-5" />
              </div>

              <h4 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide mb-1">
                Wishing you the happiest of birthdays, Nikita!
              </h4>
              <p className="font-handwritten text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400 font-bold drop-shadow-[0_0_12px_rgba(251,191,36,0.45)] mt-1.5 animate-pulse select-none">
                Wishes & Love from Unknown 🤫
              </p>

              <p className="text-slate-500 font-sans text-xs tracking-wider max-w-sm leading-relaxed">
                Made with love & magic. May this digital card serve as a tiny reminder of how special you are to everyone around you. ✨
              </p>

              <div className="mt-6 border-t border-white/5 pt-6 w-full text-[10px] text-slate-600 font-sans uppercase tracking-widest">
                &copy; {new Date().getFullYear()} All Rights Reserved. Celebrate Life!
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;