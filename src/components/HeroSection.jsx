import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ChevronDown, Music, Star, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const bgImages = [
  '/img3.png',
  '/img4.png',
  '/img5.png',
  '/img1.png',
  '/img2.png',
];

const HeroSection = ({ name = "Nikita", audioRef, isPlaying, setIsPlaying }) => {
  const containerRef = useRef(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [cursorClicks, setCursorClicks] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Scroll Progress tracking for cinematic clip-path collapse
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth scroll transformations for parallax depth
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.9]);
  const bgZoom = useTransform(scrollYProgress, [0, 1], ["100%", "108%"]);

  // Mouse Parallax Springs
  const springConfig = { stiffness: 60, damping: 25 };
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseXSpring.set(x);
      mouseYSpring.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseXSpring, mouseYSpring]);

  // Parallax bindings
  const bgX = useTransform(mouseXSpring, (x) => x * -25);
  const bgY = useTransform(mouseYSpring, (y) => y * -25);
  const contentX = useTransform(mouseXSpring, (x) => x * 15);
  const contentY = useTransform(mouseYSpring, (y) => y * 15);
  const particleX = useTransform(mouseXSpring, (x) => x * 45);
  const particleY = useTransform(mouseYSpring, (y) => y * 45);
  const leftBalloonsX = useTransform(mouseXSpring, (x) => x * -35);
  const leftBalloonsY = useTransform(mouseYSpring, (y) => y * -35);
  const rightBalloonsX = useTransform(mouseXSpring, (x) => x * -50);
  const rightBalloonsY = useTransform(mouseYSpring, (y) => y * -50);
  const flowersX = useTransform(mouseXSpring, (x) => x * 30);
  const flowersY = useTransform(mouseYSpring, (y) => y * 30);
  const giftX = useTransform(mouseXSpring, (x) => x * -30);
  const giftY = useTransform(mouseYSpring, (y) => y * -30);
  const candleX = useTransform(mouseXSpring, (x) => x * 20);
  const candleY = useTransform(mouseYSpring, (y) => y * 20);

  // Custom Cursor Spring Physics - smooth & snappy
  const cursorX = useSpring(0, { stiffness: 800, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 800, damping: 40 });
  const trailX = useSpring(0, { stiffness: 180, damping: 30 });
  const trailY = useSpring(0, { stiffness: 180, damping: 30 });

  useEffect(() => {
    const updateCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, [cursorX, cursorY, trailX, trailY]);

  // Click Ripple Trigger
  useEffect(() => {
    const clickHandler = (e) => {
      const id = Date.now();
      setCursorClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setCursorClicks(prev => prev.filter(c => c.id !== id));
      }, 800);
    };
    window.addEventListener('click', clickHandler);
    return () => window.removeEventListener('click', clickHandler);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff7597', '#8b5cf6', '#a78bfa', '#f472b6', '#f59e0b', '#10b981']
    });
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (!audioRef || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio failure:", err));
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate background elements - memoized to prevent layout thrashing on mouse movement
  const stars = React.useMemo(() => [...Array(40)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 95}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  })), []);

  const petals = React.useMemo(() => [...Array(18)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 12 + 6,
    delay: Math.random() * 8,
    duration: Math.random() * 15 + 10,
    rotate: Math.random() * 360,
  })), []);

  const hearts = React.useMemo(() => [...Array(8)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 70 + 15}%`,
    size: Math.random() * 16 + 10,
    delay: Math.random() * 6 + 1,
    duration: Math.random() * 5 + 4,
  })), []);

  const words = React.useMemo(() => "Wishing a beautiful".split(" "), []);
  const letters = React.useMemo(() => "Happy Birthday".split(""), []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#03010a]">
      {/* Hero Section - Full screen, no sticky tricks */}
      <motion.section
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
        className={`relative w-full flex flex-col items-center justify-between overflow-hidden bg-[#05030e] select-none cursor-none min-h-screen ${isDesktop ? "pt-24 pb-8 px-4" : "pt-24 pb-12 px-4"
          }`}
      >

        {/* CSS Custom Keyframe Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .cursor-none *, .cursor-none {
            cursor: none !important;
          }
          
          @keyframes aurora-flow-1 {
            0% { transform: translate(-20%, -20%) rotate(0deg) scale(1); }
            50% { transform: translate(10%, 10%) rotate(180deg) scale(1.2); }
            100% { transform: translate(-20%, -20%) rotate(360deg) scale(1); }
          }
          @keyframes aurora-flow-2 {
            0% { transform: translate(10%, 10%) rotate(360deg) scale(1.1); }
            50% { transform: translate(-15%, -15%) rotate(180deg) scale(0.9); }
            100% { transform: translate(10%, 10%) rotate(0deg) scale(1.1); }
          }
          @keyframes ray-rotate {
            0% { transform: rotate(0deg); opacity: 0.2; }
            50% { opacity: 0.35; }
            100% { transform: rotate(360deg); opacity: 0.2; }
          }
          @keyframes noise-jitter {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-1%, -1%); }
            20% { transform: translate(-2%, 1%); }
            30% { transform: translate(1%, -2%); }
            40% { transform: translate(-1%, 3%); }
            50% { transform: translate(-2%, 1%); }
            60% { transform: translate(1%, 2%); }
            70% { transform: translate(2%, 1%); }
            80% { transform: translate(-1%, -1%); }
            90% { transform: translate(2%, -2%); }
            100% { transform: translate(1%, 2%); }
          }
          @keyframes flap-left {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(70deg); }
          }
          @keyframes flap-right {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(-70deg); }
          }
          @keyframes flame-wiggle {
            0%, 100% { transform: scale(1) rotate(-2deg); }
            50% { transform: scale(1.1) rotate(3deg); }
          }
          @keyframes ribbon-wave {
            0%, 100% { transform: rotate(0deg) skewX(0deg); }
            50% { transform: rotate(3deg) skewX(2deg); }
          }
          
          /* Ambient glow keyframe */
          .glow-pulse {
            animation: text-glow-pulse 4s ease-in-out infinite;
          }
          @keyframes text-glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 117, 151, 0.2)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.1)); }
            50% { filter: drop-shadow(0 0 25px rgba(255, 117, 151, 0.45)) drop-shadow(0 0 45px rgba(139, 92, 246, 0.35)); }
          }

          /* Noise overlay */
          .noise-overlay {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          }
        ` }} />

        {/* ==========================================
            CUSTOM LUXURY CURSOR
            ========================================== */}
        <div className="hidden lg:block pointer-events-none fixed inset-0 z-50">
          {/* Main fast Dot */}
          <motion.div
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            className="absolute w-2 h-2 rounded-full bg-brand-pink shadow-[0_0_10px_#ff7597]"
          />
          {/* Trailing Outer Ring */}
          <motion.div
            style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: isHoveringInteractive ? 2 : 1,
              borderColor: isHoveringInteractive ? "rgba(255, 117, 151, 0.6)" : "rgba(255, 255, 255, 0.25)"
            }}
            transition={{ duration: 0.2 }}
            className="absolute w-8 h-8 rounded-full border-1.5 pointer-events-none flex items-center justify-center bg-transparent"
          >
            {isHoveringInteractive && (
              <span className="w-1.5 h-1.5 bg-brand-pink/40 rounded-full animate-ping" />
            )}
          </motion.div>
          {/* Clicks Ripples */}
          <AnimatePresence>
            {cursorClicks.map(click => (
              <motion.div
                key={click.id}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 2.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ left: click.x, top: click.y, x: "-50%", y: "-50%" }}
                className="absolute w-12 h-12 rounded-full border border-brand-pink/50 pointer-events-none"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ==========================================
            STARRING & BACKGROUND ELEMENTS (Twinkles & Auroras)
            ========================================== */}
        <motion.div style={{ x: bgX, y: bgY, scale: bgZoom }} className="absolute inset-0 pointer-events-none z-0">
          {/* Background Image Slideshow with Crossfade */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImgIndex}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 0.55, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImages[currentImgIndex]})` }}
              />
            </AnimatePresence>
            {/* Elegant dark overlay vignette */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050212]/80 via-transparent to-[#1a0110]/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05030e]/75 via-transparent to-[#03010a]/85" />
            <div className="absolute inset-0 bg-[#05030e]/15" />
          </div>
          {/* Noise Jitter layer */}
          <div className="absolute inset-[-5%] noise-overlay opacity-[0.035] pointer-events-none z-10" style={{ animation: 'noise-jitter 0.4s steps(4) infinite' }}></div>

          {/* Twinkling Stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.8, 0.1] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut'
              }}
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                boxShadow: '0 0 6px #fff',
                willChange: 'opacity'
              }}
              className="absolute bg-white rounded-full"
            />
          ))}

          {/* Giant Aurora flow 1 */}
          <div
            className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[140px] opacity-[0.25]"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(236,72,153,0.15) 60%, rgba(0,0,0,0) 100%)',
              animation: 'aurora-flow-1 25s ease-in-out infinite',
              willChange: 'transform'
            }}
          />

          {/* Giant Aurora flow 2 */}
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] rounded-full blur-[160px] opacity-[0.22]"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(59,130,246,0.15) 70%, rgba(0,0,0,0) 100%)',
              animation: 'aurora-flow-2 30s ease-in-out infinite',
              willChange: 'transform'
            }}
          />

          {/* Golden Ambient Rays */}
          <div
            className="absolute top-[-40%] left-[10%] w-[120vw] h-[120vh] pointer-events-none z-0"
            style={{
              backgroundImage: 'repeating-conic-gradient(from 0deg, rgba(251,191,36,0.015) 0deg 15deg, transparent 15deg 30deg)',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              animation: 'ray-rotate 120s linear infinite'
            }}
          />

          {/* Ambient fog overlays */}
          <motion.div
            animate={{ x: ['-20%', '20%'] }}
            transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-slate-950/70 to-transparent blur-3xl opacity-60"
          />
        </motion.div>

        {/* ==========================================
            STATIONARY CELEBRATION HEADER
            ========================================== */}
        <header className="fixed top-6 left-0 right-0 z-40 mx-auto w-[92%] max-w-5xl flex justify-between items-center px-6 py-3 rounded-full glassmorphism border border-white/10 shadow-lg backdrop-blur-md">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('home')}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            className="flex items-center gap-1.5 cursor-pointer text-white font-sans font-bold tracking-wide"
          >
            <span className="font-handwritten text-2xl text-pink-300">For You</span>
            <Heart className="w-4.5 h-4.5 fill-current text-brand-pink" />
          </motion.div>

          <nav className="hidden md:flex items-center gap-6 text-slate-300 text-xs font-sans tracking-widest font-semibold uppercase">
            {['Home', 'Memories', 'Gallery', 'Surprise', 'Wishes'].map((link) => (
              <button
                key={link}
                onMouseEnter={() => setIsHoveringInteractive(true)}
                onMouseLeave={() => setIsHoveringInteractive(false)}
                onClick={() => {
                  if (link === 'Home') scrollToSection('home');
                  else if (link === 'Memories' || link === 'Gallery') scrollToSection('gallery');
                  else if (link === 'Surprise') scrollToSection('surprise');
                  else if (link === 'Wishes') scrollToSection('wishes');
                }}
                className="hover:text-brand-pink transition-colors duration-200 cursor-pointer py-1 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-pink group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            onClick={toggleMusic}
            className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center cursor-pointer shadow transition-all duration-300 ${isPlaying ? "bg-brand-pink/20 border-brand-pink/40 text-brand-pink shadow-brand-pink/10" : "bg-white/5 text-slate-300"
              }`}
          >
            <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
          </motion.button>
        </header>

        {/* ==========================================
            DRIFTING FLOWER PETALS (100% GPU loop)
            ========================================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ y: -50, x: petal.left, rotate: petal.rotate, opacity: 0 }}
              animate={{
                y: '105vh',
                x: `calc(${petal.left} + ${Math.sin(petal.id) * 110}px)`,
                rotate: petal.rotate + 360,
                opacity: [0, 0.75, 0.75, 0]
              }}
              transition={{
                duration: petal.duration,
                repeat: Infinity,
                delay: petal.delay,
                ease: 'linear'
              }}
              style={{
                width: petal.size,
                height: petal.size * 1.25,
                background: 'radial-gradient(circle, #ff8da1 0%, #e11d48 100%)',
                borderRadius: '50% 0 50% 50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                filter: 'blur(0.4px)',
                willChange: 'transform, opacity'
              }}
              className="absolute"
            />
          ))}
        </div>

        {/* ==========================================
            RANDOM GLOWING HEARTS
            ========================================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 0.45, 0.45, 0],
                scale: [0.6, 1.2, 0.8],
                y: [0, -120]
              }}
              transition={{
                duration: heart.duration,
                repeat: Infinity,
                delay: heart.delay,
                ease: 'easeInOut'
              }}
              style={{
                left: heart.left,
                top: heart.top,
                width: heart.size,
                height: heart.size,
                willChange: 'transform, opacity'
              }}
              className="absolute text-brand-pink/35 blur-[1px] flex items-center justify-center"
            >
              <Heart className="w-full h-full fill-current" />
            </motion.div>
          ))}
        </div>

        {/* ==========================================
            2 MAGICAL BUTTERFLIES
            ========================================== */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Butterfly 1 */}
          <motion.div
            animate={{
              x: ["-5vw", "40vw", "20vw", "75vw", "10vw", "95vw"],
              y: ["80vh", "35vh", "65vh", "25vh", "55vh", "-10vh"],
              rotate: [0, 35, -25, 45, -35, 0]
            }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
            className="absolute w-8 h-8 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_10px_#a78bfa]">
              {/* Left Wing */}
              <div
                style={{ transformOrigin: 'right center', animation: 'flap-left 0.15s linear infinite' }}
                className="w-3.5 h-6 bg-gradient-to-l from-purple-400 to-indigo-500 rounded-l-full rotate-[-15deg] absolute right-[52%]"
              />
              {/* Center Body */}
              <div className="w-1.5 h-5 bg-white/80 rounded-full z-10" />
              {/* Right Wing */}
              <div
                style={{ transformOrigin: 'left center', animation: 'flap-right 0.15s linear infinite' }}
                className="w-3.5 h-6 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-r-full rotate-[15deg] absolute left-[52%]"
              />
            </div>
          </motion.div>

          {/* Butterfly 2 */}
          <motion.div
            animate={{
              x: ["105vw", "60vw", "80vw", "25vw", "85vw", "-5vw"],
              y: ["70vh", "20vh", "50vh", "15vh", "40vh", "90vh"],
              rotate: [0, -45, 30, -60, 45, 0]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{ willChange: "transform" }}
            className="absolute w-7 h-7 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_8px_#f472b6]">
              {/* Left Wing */}
              <div
                style={{ transformOrigin: 'right center', animation: 'flap-left 0.13s linear infinite' }}
                className="w-3 h-5.5 bg-gradient-to-l from-pink-400 to-rose-500 rounded-l-full rotate-[-15deg] absolute right-[52%]"
              />
              {/* Center Body */}
              <div className="w-1 h-4.5 bg-white/80 rounded-full z-10" />
              {/* Right Wing */}
              <div
                style={{ transformOrigin: 'left center', animation: 'flap-right 0.13s linear infinite' }}
                className="w-3 h-5.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-r-full rotate-[15deg] absolute left-[52%]"
              />
            </div>
          </motion.div>
        </div>

        {/* ==========================================
            LUXURY FLOATING BALLOONS
            ========================================== */}
        {/* Left Side: 3 Balloons */}
        <motion.div style={{ x: leftBalloonsX, y: leftBalloonsY }} className="absolute bottom-16 left-[4%] w-48 h-64 pointer-events-none z-10 hidden lg:block">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [-6, -2, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 left-0"
          >
            <div className="bg-gradient-to-tr from-pink-500/25 via-rose-600/30 to-purple-800/20 w-24 h-32 rounded-full border border-white/5 shadow-2xl relative">
              <div className="absolute top-[8%] left-[10%] w-6 h-8 bg-white/20 rounded-full blur-[2px] rotate-[-25deg]"></div>
            </div>
            <div className="w-[1.2px] h-36 bg-slate-500/20 mx-auto" />
          </motion.div>

          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [4, 8, 4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 left-16"
          >
            <div className="bg-gradient-to-tr from-purple-500/20 via-purple-700/25 to-indigo-900/10 w-20 h-28 rounded-full border border-white/5 shadow-2xl relative">
              <div className="absolute top-[8%] left-[10%] w-5 h-7 bg-white/20 rounded-full blur-[2px] rotate-[-25deg]"></div>
            </div>
            <div className="w-[1.2px] h-36 bg-slate-500/20 mx-auto" />
          </motion.div>

          <motion.div
            animate={{ y: [5, -15, 5], rotate: [-2, 4, -2] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
            className="absolute bottom-20 left-24"
          >
            <div className="bg-gradient-to-tr from-rose-500/15 via-pink-600/25 to-indigo-950/5 w-18 h-26 rounded-full border border-white/5 shadow-2xl relative">
              <div className="absolute top-[8%] left-[10%] w-4 h-6 bg-white/10 rounded-full blur-[1.5px] rotate-[-25deg]"></div>
            </div>
            <div className="w-[1.2px] h-36 bg-slate-500/20 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Right Side: 2 Balloons */}
        <motion.div style={{ x: rightBalloonsX, y: rightBalloonsY }} className="absolute bottom-28 right-[6%] w-48 h-64 pointer-events-none z-10 hidden lg:block">
          <motion.div
            animate={{ y: [-15, 5, -15], rotate: [5, 1, 5] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-10 right-0"
          >
            <div className="bg-gradient-to-tr from-brand-pink/20 via-purple-600/25 to-slate-900/20 w-22 h-30 rounded-full border border-white/5 shadow-2xl relative">
              <div className="absolute top-[8%] left-[10%] w-5 h-7 bg-white/10 rounded-full blur-[2px] rotate-[-25deg]"></div>
            </div>
            <div className="w-[1.2px] h-36 bg-slate-500/20 mx-auto" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-4, 2, -4] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            className="absolute bottom-2 right-16"
          >
            <div className="bg-gradient-to-tr from-purple-500/15 via-indigo-600/25 to-slate-950/10 w-18 h-26 rounded-full border border-white/5 shadow-2xl relative">
              <div className="absolute top-[8%] left-[10%] w-4 h-6 bg-white/10 rounded-full blur-[2px] rotate-[-25deg]"></div>
            </div>
            <div className="w-[1.2px] h-36 bg-slate-500/20 mx-auto" />
          </motion.div>
        </motion.div>

        {/* ==========================================
            MAIN HERO CENTRAL CONTENT
            ========================================== */}
        <motion.div style={{ x: contentX, y: contentY }} className="relative z-20 text-center max-w-4xl mx-auto flex-grow flex flex-col justify-center items-center py-6 mt-10">

          {/* A. Top Celebration Badge (0.4s Timeline) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} // power4.out equivalent
            style={{ willChange: "transform, opacity" }}
            onClick={triggerConfetti}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            className="inline-flex items-center gap-2.5 px-6 py-1.5 rounded-full border border-brand-pink/30 bg-brand-pink/5 hover:bg-brand-pink/15 cursor-pointer text-xs md:text-sm font-serif tracking-widest text-brand-pink mb-6 transition-all duration-300 shadow shadow-brand-pink/5"
          >
            <span>✦</span>
            <span className="font-handwritten text-base tracking-normal">Celebrating Her Special Day</span>
            <span>✦</span>
          </motion.div>

          {/* B. Sub Heading (0.8s Timeline - Word-by-word) */}
          <h2 className="font-sans text-xs sm:text-sm md:text-base text-brand-pink font-semibold tracking-[0.25em] uppercase mb-4 flex flex-wrap gap-x-2 justify-center">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.08, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          {/* C. Centered & Glowing Title & Name */}
          <div className="flex flex-col items-center select-none w-full relative z-30">
            {/* Happy Birthday Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] pt-2 pb-1 relative group overflow-visible flex justify-center flex-nowrap whitespace-nowrap">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 60,
                    rotateX: 30,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 9,
                    delay: 1.2 + index * 0.04,
                  }}
                  style={{
                    display: "inline-block",
                    transformOrigin: "bottom center",
                    willChange: "transform, opacity",
                  }}
                  className="bg-gradient-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}

              {/* Light Sweep */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "250%" }}
                transition={{
                  duration: 2.2,
                  delay: 2.2,
                  repeat: Infinity,
                  repeatDelay: 12,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none mix-blend-overlay"
              />
            </h1>

            {/* Glowing Calligraphy Name - Centered & Magnified */}
            <div className="relative mt-2 md:mt-3">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 10,
                  delay: 2.0,
                }}
                style={{ willChange: "transform, opacity" }}
                className="font-handwritten text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-rose-300 drop-shadow-[0_0_35px_rgba(244,114,182,0.65)] flex items-center justify-center gap-4 rotate-[-3deg] origin-center py-2"
              >
                <span>{name}!</span>
                <span className="text-rose-400 text-5xl sm:text-7xl md:text-8xl animate-pulse">
                  ❤️
                </span>
              </motion.div>

              {/* Magical sparkles orbiting/flying around the name */}
              <motion.div
                initial={{ left: "0%", opacity: 0 }}
                animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.0,
                  delay: 2.2,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 -translate-y-1/2 text-yellow-300 pointer-events-none"
              >
                <Sparkles
                  className="w-6 h-6 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </motion.div>
            </div>
          </div>

          {/* E. Description Paragraph (2.6s Timeline - Line-by-line) */}
          <div className="mt-14 mb-8 max-w-2xl mx-auto px-2 flex flex-col items-center gap-1 text-center">
            {[
              <span key={1}>May your day be filled with endless laughter, magical</span>,
              <span key={2}>moments, and the realization of all your beautiful</span>,
              <span key={3}>dreams. <span className="text-pink-300 font-semibold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">You deserve the world! ✨</span></span>
            ].map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, filter: "blur(3px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.7, delay: 2.6 + idx * 0.15, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className="text-slate-400 text-sm sm:text-base md:text-lg font-sans tracking-wide leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* F. CTA Button (3.0s Timeline - Magnetic, Breathing, Ripple Burst) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 3.0, type: "spring" }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-20 mb-8"
          >
            {/* Pulsing Breathing Background Glow */}
            <div className="absolute inset-0 bg-brand-pink/20 rounded-full blur-xl scale-95 animate-ping opacity-30" style={{ animationDuration: '3s' }}></div>

            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 28px rgba(255, 117, 151, 0.55)"
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => {
                setIsHoveringInteractive(true);
              }}
              onMouseLeave={() => {
                setIsHoveringInteractive(false);
              }}
              onClick={() => {
                triggerConfetti();
                // Custom magnetic ripple burst
                confetti({
                  particleCount: 30,
                  spread: 40,
                  origin: { y: 0.65 },
                  colors: ['#ff7597', '#8b5cf6']
                });
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-brand-pink to-brand-purple text-white font-sans font-bold rounded-full shadow-lg border border-white/10 cursor-pointer text-sm md:text-base tracking-wider uppercase relative overflow-hidden group"
            >
              <span className="relative z-10">Shower Confetti 🌸</span>

              {/* Inner Button Shine Overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ==========================================
            G. BASE ROW DECORATIVES (Candle, Scroll Indicator, Gift Box, Flowers)
            ========================================== */}
        <div className="w-full max-w-5xl mx-auto flex justify-between items-end relative z-20 px-4 md:px-12 mt-6">

          {/* 1. Candle (Left Corner) */}
          <motion.div
            style={{ x: candleX, y: candleY, willChange: "transform, opacity" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="w-20 h-28 hidden lg:flex flex-col items-center justify-end relative select-none"
          >
            {/* Flickering Flame Glow */}
            <div className="absolute top-1 w-8 h-8 bg-yellow-400/35 rounded-full blur animate-pulse" style={{ animationDuration: '0.8s' }}></div>
            {/* Candle body */}
            <svg className="w-12 h-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.35)]" viewBox="0 0 100 150">
              <rect x="25" y="40" width="50" height="110" rx="6" fill="url(#candle-body-grad)" />
              <path d="M 25 40 Q 35 48 45 40 Q 55 46 65 40 Q 75 48 75 40" fill="url(#candle-body-grad)" />
              <line x1="50" y1="40" x2="50" y2="24" stroke="#7c2d12" strokeWidth="3" />
              {/* Flickering Flame path */}
              <path
                d="M 50 24 Q 38 10 50 0 Q 62 10 50 24 Z"
                fill="url(#flame-grad)"
                style={{ transformOrigin: 'center bottom', animation: 'flame-wiggle 0.3s ease-in-out infinite' }}
              />
              <defs>
                <linearGradient id="candle-body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#9d174d" />
                </linearGradient>
                <linearGradient id="flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* 2. Scroll Indicator (3.3s Timeline - Particles + Bounce) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.8 }}
            style={{ willChange: "transform, opacity" }}
            onClick={() => scrollToSection('gallery')}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            className="flex flex-col items-center gap-2 cursor-pointer mx-auto text-slate-500 font-sans text-[10px] tracking-widest uppercase font-semibold relative group"
          >
            {/* Hover Floating Sparkle */}
            <span className="absolute -top-3 w-1.5 h-1.5 bg-brand-pink/50 rounded-full blur-[0.5px] animate-ping" />
            <span className="group-hover:text-brand-pink transition-colors duration-300">Scroll to begin</span>

            <div className="w-6 h-10 rounded-full border-2 border-slate-600/60 p-1 flex justify-center relative group-hover:border-brand-pink transition-colors duration-300">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1 h-2 rounded-full bg-brand-pink"
              />
            </div>
            <ChevronDown className="w-4 h-4 animate-bounce text-slate-500 mt-1 group-hover:text-brand-pink transition-colors duration-300" />
          </motion.div>

          {/* 3. 3D Gift Box (Parallax + Hover 3D rotation) */}
          <motion.div
            style={{ x: giftX, y: giftY, willChange: "transform, opacity" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            className="w-20 h-24 hidden lg:flex flex-col items-center justify-end z-10"
          >
            <motion.svg
              whileHover={{ rotateY: 30, rotateX: -15, scale: 1.15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-14 h-14 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
              viewBox="0 0 100 100"
            >
              <rect x="15" y="40" width="70" height="50" rx="4" fill="url(#box-grad)" />
              <rect x="10" y="30" width="80" height="15" rx="3" fill="url(#lid-grad)" />
              <rect x="44" y="30" width="12" height="60" fill="#fde047" />
              {/* Wave Ribbon Bow */}
              <path
                d="M 50 30 Q 30 10 44 24 Z"
                fill="#fde047"
                style={{ animation: 'ribbon-wave 3s ease-in-out infinite' }}
              />
              <path
                d="M 50 30 Q 70 10 56 24 Z"
                fill="#fde047"
                style={{ animation: 'ribbon-wave 3s ease-in-out infinite', animationDelay: '1.5s' }}
              />
              <defs>
                <linearGradient id="box-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="lid-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </motion.svg>
          </motion.div>

          {/* 4. Luxury Flower Bouquet (Right Corner) */}
          <motion.div
            style={{ x: flowersX, y: flowersY, willChange: "transform, opacity" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="w-24 h-28 hidden lg:flex flex-col items-center justify-end z-10 select-none pointer-events-none"
          >
            <motion.svg
              animate={{ rotate: [-2, 2, -2], y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-18 h-18 drop-shadow-[0_0_15px_rgba(244,63,94,0.25)]"
              viewBox="0 0 100 100"
            >
              {/* Green stems */}
              <path d="M 40 85 L 50 40 M 50 85 L 50 40 M 60 85 L 50 40" stroke="#10b981" strokeWidth="2.5" />
              {/* Left Flower */}
              <circle cx="35" cy="40" r="10" fill="#f43f5e" />
              <circle cx="35" cy="40" r="4" fill="#fbbf24" />
              {/* Center Flower */}
              <circle cx="50" cy="28" r="11" fill="#ec4899" />
              <circle cx="50" cy="28" r="4.5" fill="#fef08a" />
              {/* Right Flower */}
              <circle cx="65" cy="40" r="10" fill="#d946ef" />
              <circle cx="65" cy="40" r="4" fill="#fbbf24" />
              {/* Bow wrapping stems */}
              <path d="M 44 68 C 44 64, 56 64, 56 68 C 56 72, 44 72, 44 68 Z" fill="#ffedd5" />
            </motion.svg>
          </motion.div>
        </div>


      </motion.section>
    </div>
  );
};

export default HeroSection;
