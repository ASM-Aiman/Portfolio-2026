// components/sections/Contact.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/mykdjnbp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transmission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-mono text-[var(--gold)] text-xs tracking-[0.3em] uppercase block mb-4"
          >
            Establish Connection
          </motion.span>
          <h2 className="text-4xl md:text-5xl text-[var(--parchment)] mb-4">
            Send a Signal
          </h2>
          <p className="font-serif italic text-[var(--parchment)]/60">
            "Messages travel far in the digital ether. Where shall we meet?"
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black/20 backdrop-blur-xl border border-[var(--gold)]/20 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Animated background decoration */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ translateY: '-50%', translateX: '50%' }}
          />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl text-[var(--parchment)] mb-2">Message Transmitted</h3>
                <p className="text-[var(--parchment)]/60">I'll respond through the void shortly.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="relative space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-12 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-12 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[var(--gold)]/50 group-focus-within:text-[var(--gold)] transition-colors duration-300" />
                  <textarea
                    name="message"
                    placeholder="Your message across the void..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full bg-black/30 border border-[var(--gold)]/20 rounded-lg py-4 pl-12 pr-4 text-[var(--parchment)] placeholder-[var(--parchment)]/30 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300 resize-none"
                    required
                  />
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-3 px-4"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(var(--gold-rgb), 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[var(--gold)] to-amber-600 text-[var(--void)] font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[var(--gold)]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={isSubmitting ? { x: '100%' } : { x: '-100%' }}
                    transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0, ease: "linear" }}
                  />
                  
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[var(--void)] border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};