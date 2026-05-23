import { motion } from "framer-motion";
import { Truck, Shield, Zap, Globe } from "lucide-react";

const features = [
  { icon: Shield, label: "Secure & Reliable" },
  { icon: Zap, label: "Real-time Updates" },
  { icon: Globe, label: "Pan-India Coverage" },
];

export default function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-5">
            {features.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-1.5 text-[11px] text-slate-400"
              >
                <Icon className="w-3 h-3 text-amber-400" />
                {label}
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[11px] text-slate-500"
          >
            &copy; {new Date().getFullYear()} TransportHub &mdash; Manufacturing Logistics Platform
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}