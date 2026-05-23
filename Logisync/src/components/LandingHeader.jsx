import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2.5"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <Truck className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-tight">TransportHub</span>
            <span className="block text-[9px] text-amber-400/80 uppercase tracking-widest leading-none">Manufacturing</span>
          </div>
        </motion.div>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex items-center gap-6 text-xs text-slate-400"
        >
          {["Fleet Management", "Live Tracking", "Delivery Scheduling"].map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {item}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700 rounded-full px-3 py-1"
        >
          v2.0 Production
        </motion.div>
      </div>
    </motion.header>
  );
}