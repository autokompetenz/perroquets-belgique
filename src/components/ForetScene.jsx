import { motion } from 'framer-motion';

export default function ForetScene() {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden' }}>
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ duration:1.5 }}
        style={{
          position:'absolute', inset:0,
          background:'linear-gradient(180deg, #1A3C26 0%, #2D5A3E 30%, #3A7D44 60%, #4CAF50 100%)',
          zIndex:0,
        }}
      />
    </div>
  );
}
