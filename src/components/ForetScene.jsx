import { motion } from 'framer-motion';

const parrots = [
  {
    id: 1, initial: { x: -100, y: 80, rotate: -15, scale: 0.3 },
    animate: { x: 0, y: 0, rotate: 5, scale: 1 },
    float: { y: [0, -6, 0] },
    delay: 0.2, duration: 1.6, size: 56, top: '28%', left: '28%',
  },
  {
    id: 2, initial: { x: -140, y: 50, rotate: -20, scale: 0.25 },
    animate: { x: 0, y: 0, rotate: 8, scale: 1 },
    float: { y: [0, 6, 0] },
    delay: 0.6, duration: 1.8, size: 44, top: '38%', left: '22%',
  },
  {
    id: 3, initial: { x: -80, y: -60, rotate: 10, scale: 0.3 },
    animate: { x: 0, y: 0, rotate: -3, scale: 1 },
    float: { y: [0, -8, 0] },
    delay: 0.9, duration: 1.5, size: 48, top: '18%', left: '35%',
  },
  {
    id: 4, initial: { x: -50, y: 120, rotate: -25, scale: 0.2 },
    animate: { x: 0, y: 0, rotate: 6, scale: 1 },
    float: { y: [0, 4, 0] },
    delay: 1.3, duration: 2.0, size: 38, top: '48%', left: '20%',
  },
];

export default function ForetScene() {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden' }}>
      {/* Tree */}
      <motion.div
        initial={{ opacity:0, scale:0.5 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:1, delay:0.5, ease:[0.16,1,0.3,1] }}
        style={{ position:'absolute', right:'3%', bottom:'-2%', fontSize:200, lineHeight:1, filter:'drop-shadow(0 10px 30px rgba(0,0,0,0.25))' }}>
        🌳
      </motion.div>

      {/* Flying parrots */}
      {parrots.map((p) => (
        <motion.div
          key={p.id}
          initial={p.initial}
          animate={{
            ...p.animate,
            ...p.float,
          }}
          transition={{
            ...Object.fromEntries(
              Object.keys(p.animate).map(k => [k, { duration: p.duration, delay: p.delay, ease: [0.16,1,0.3,1] }])
            ),
            y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay + p.duration },
          }}
          style={{
            position:'absolute', top:p.top, left:p.left,
            fontSize:p.size, lineHeight:1, zIndex:2,
            filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.2))',
          }}>
          🦜
        </motion.div>
      ))}
    </div>
  );
}
