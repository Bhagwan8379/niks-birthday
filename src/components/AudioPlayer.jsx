import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

const AudioPlayer = ({ audioRef, isPlaying, setIsPlaying }) => {
  const [volume, setVolume] = useState(0.4);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Sync volume state with HTML Audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio play failed:", err));
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Volume slider container (appears on hover) */}
      <motion.div
        initial={{ opacity: 0, x: 20, pointerEvents: 'none' }}
        animate={showVolumeSlider ? { opacity: 1, x: 0, pointerEvents: 'auto' } : {}}
        transition={{ duration: 0.2 }}
        className="glassmorphism-card px-3 py-2 rounded-xl border border-white/10 flex items-center justify-center"
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 accent-brand-pink h-1 rounded-lg cursor-pointer bg-slate-700"
        />
      </motion.div>

      {/* Main audio player control widget */}
      <motion.div
        onHoverStart={() => setShowVolumeSlider(true)}
        onHoverEnd={() => setShowVolumeSlider(false)}
        whileHover={{ scale: 1.05 }}
        className="glassmorphism-card p-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 cursor-pointer group pr-4"
        onClick={togglePlay}
      >
        {/* Rotating Vinyl Record / Music Disk */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : {}}
            className={`w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center relative overflow-hidden ${
              isPlaying ? "shadow-lg shadow-brand-pink/20" : ""
            }`}
          >
            {/* Grooves on vinyl */}
            <div className="absolute inset-1 rounded-full border border-slate-800"></div>
            <div className="absolute inset-2.5 rounded-full border border-slate-800"></div>
            {/* Center Label */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
          </motion.div>

          {/* Overlay Play/Pause indicator icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white fill-current" />
            ) : (
              <Play className="w-4 h-4 text-white fill-current translate-x-[1px]" />
            )}
          </div>
        </div>

        {/* Text info and sound waves */}
        <div className="flex flex-col select-none">
          <span className="text-[10px] font-sans font-bold tracking-widest text-brand-pink uppercase">
            {isPlaying ? "NOW PLAYING" : "MUSIC PAUSED"}
          </span>
          <span className="text-[11px] text-slate-300 font-sans font-semibold max-w-[100px] truncate">
            Aesthetic Guitar 🎸
          </span>
        </div>

        {/* Sound Waves Visualizer */}
        <div className="flex items-end gap-[2px] h-3 ml-1 select-none pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [3, 12, 4, 10, 3],
              } : { height: 3 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              className="w-[2px] bg-brand-pink rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AudioPlayer;
