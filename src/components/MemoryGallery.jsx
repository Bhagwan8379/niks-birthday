import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Heart, Sparkles } from 'lucide-react';

const memories = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80",
    title: "Shine Bright ✨",
    desc: "A moment of pure joy. You light up every room with your warmth and beautiful smile.",
    rotation: -4,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    title: "Dreamer 🎈",
    desc: "Always looking forward, dreaming big, and spreading colorful positive vibes wherever you go.",
    rotation: 3,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&auto=format&fit=crop&q=80",
    title: "Make a Wish 🎂",
    desc: "A year older, wiser, and more beautiful. May every candle you blow out translate to a dream fulfilled.",
    rotation: -2,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    title: "Sparkle On 💖",
    desc: "Capturing the magic in everyday moments. Never let anyone dull your sparkle!",
    rotation: 5,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
    title: "Wrapped with Love 🎁",
    desc: "Celebrating the wonderful gift that you are to the world. You are deeply loved and appreciated.",
    rotation: -3,
  }
];

const MemoryGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const containerRef = useRef(null);

  return (
    <section className="relative min-h-fit md:min-h-screen py-12 md:py-24 px-4 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-brand-pink/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 text-brand-pink mb-3">
            <Camera className="w-5 h-5" />
            <span className="font-sans font-semibold tracking-wider text-xs uppercase">Memory Lane</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-glow-purple text-white mb-4">
            Captured Moments
          </h2>
          <p className="text-slate-400 font-sans max-w-md mx-auto text-sm md:text-base">
            Every picture tells a beautiful story of your life. Drag them around, explore your polaroids, or click to open the memories!
          </p>
        </div>

        {/* Draggable Polaroid Grid Area */}
        <div 
          ref={containerRef}
          className="relative min-h-[500px] md:min-h-[450px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 py-8 items-center justify-items-center"
        >
          {memories.map((photo) => (
            <motion.div
              key={photo.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
              whileDrag={{ scale: 1.08, zIndex: 40, cursor: 'grabbing' }}
              initial={{ opacity: 0, y: 50, rotate: photo.rotation * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05, 
                rotate: photo.rotation > 0 ? photo.rotation + 2 : photo.rotation - 2, 
                y: -10,
                zIndex: 30,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)" 
              }}
              onClick={() => setSelectedPhoto(photo)}
              className="w-full max-w-[210px] bg-white p-3.5 pb-6 rounded-md shadow-xl border border-slate-200 cursor-pointer flex flex-col justify-between transition-shadow duration-300 pointer-events-auto"
            >
              {/* Photo Area */}
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden rounded-sm select-none pointer-events-none">
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>

              {/* Polaroid Footer */}
              <div className="mt-4 text-center select-none pointer-events-none">
                <p className="font-handwritten text-2xl text-slate-800 font-bold tracking-wide">
                  {photo.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
              className="glassmorphism-card max-w-3xl w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row cursor-default"
            >
              {/* Left Column: Image */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[450px] relative overflow-hidden bg-slate-900">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Text Content */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between relative bg-slate-950/80">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-brand-pink mb-3">
                    <Heart className="w-4 h-4 fill-current animate-pulse" />
                    <span className="text-xs font-sans font-bold tracking-widest uppercase">Memory Details</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-extrabold text-white leading-tight mb-4">
                    {selectedPhoto.title}
                  </h3>
                  
                  <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed tracking-wide">
                    {selectedPhoto.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 text-slate-500 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    Captured with love
                  </span>
                  <span>July 2026</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MemoryGallery;
