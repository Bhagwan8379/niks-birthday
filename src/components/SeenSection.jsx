import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Send, Eye, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const SeenSection = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendEmail = async (textToSend) => {
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('');
        
        // Success celebration confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#ff7597', '#8b5cf6', '#3b82f6', '#10b981']
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to dispatch email. Please try again later.');
      }
    } catch (err) {
      console.error('Email sending request failed:', err);
      setStatus('error');
      setErrorMessage('Network error. Make sure the server is running and try again.');
    }
  };

  return (
    <section className="relative py-20 px-4 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-pink/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glassmorphism-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Sparkle corner */}
          <div className="absolute top-4 right-4 w-8 h-8 text-brand-pink/30 animate-pulse">
            <Sparkles className="w-full h-full" />
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              /* Success Message screen */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 flex flex-col items-center gap-4"
              >
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                  <CheckCircle2 className="w-12 h-12 animate-bounce" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-slate-400 font-sans text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                  Thank you, Nik! Your response has been dispatched. The creator has been notified. 💖
                </p>
              </motion.div>
            ) : (
              /* Email dispatching Form */
              <motion.div key="form" exit={{ opacity: 0 }}>
                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2.5">
                    Did you see the wishes? ✨
                  </h2>
                  <p className="text-slate-400 font-sans text-sm md:text-base leading-relaxed">
                    Nikita, if you saw this website, click the button below to let me know! If you'd like to reply, write your message in the box and send it.
                  </p>
                </div>

                {/* Form fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-sans font-bold tracking-widest text-slate-500 uppercase mb-2">
                      Write a reply back (Optional)
                    </label>
                    <textarea
                      disabled={status === 'sending'}
                      rows={4}
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-2xl glassmorphism-input text-white placeholder-slate-600 text-sm font-sans focus:outline-none transition-all duration-300 resize-none disabled:opacity-50"
                    />
                    <div className="text-right text-[10px] text-slate-500 mt-1">
                      {message.length}/300 characters
                    </div>
                  </div>

                  {/* Error Notification banner */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-sans flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Sending & Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Send Message Button (Active when message is NOT empty) */}
                    <button
                      type="button"
                      disabled={status === 'sending' || message.trim() === ''}
                      onClick={() => handleSendEmail(message)}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-sans font-semibold tracking-wider text-sm shadow-lg border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-brand-pink/15 hover:opacity-95"
                    >
                      {status === 'sending' && message.trim() !== '' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message 💌</span>
                        </>
                      )}
                    </button>

                    {/* Just Seen Button (Active when message IS empty) */}
                    <button
                      type="button"
                      disabled={status === 'sending' || message.trim() !== ''}
                      onClick={() => handleSendEmail('')}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-sans font-semibold tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' && message.trim() === '' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Marking...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4.5 h-4.5" />
                          <span>Just Mark as Seen 👀</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SeenSection;
