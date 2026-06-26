import { motion } from 'framer-motion';

const perched = [
  {
    id: 'p1', top: '18%', right: '9%', size: 44, rotate: -8, delay: 0.8,
    bob: { y: [0, -4, 0] },
  },
  {
    id: 'p2', top: '28%', right: '13%', size: 38, rotate: 6, delay: 1.0,
    bob: { y: [0, 5, 0] },
  },
  {
    id: 'p3', top: '38%', right: '10%', size: 40, rotate: -12, delay: 1.2,
    bob: { y: [0, -3, 0] },
  },
  {
    id: 'p4', top: '48%', right: '6%', size: 36, rotate: 15, delay: 1.4,
    bob: { y: [0, 4, 0] },
  },
  {
    id: 'p5', top: '12%', right: '14%', size: 34, rotate: -5, delay: 1.6,
    bob: { y: [0, -3, 0] },
  },
];

const flying = [
  {
    id: 'f1', initial: { x: -200, y: 60, rotate: -15, scale: 0.3 },
    animate: { x: 0, y: 0, rotate: 5, scale: 1 },
    float: { y: [0, -6, 0] },
    delay: 0.3, duration: 1.8, size: 48, top: '24%', left: '8%',
  },
  {
    id: 'f2', initial: { x: -180, y: -50, rotate: 10, scale: 0.25 },
    animate: { x: 0, y: 0, rotate: -3, scale: 1 },
    float: { y: [0, 5, 0] },
    delay: 0.8, duration: 2.0, size: 36, top: '14%', left: '5%',
  },
  {
    id: 'f3', initial: { x: -250, y: 30, rotate: -20, scale: 0.2 },
    animate: { x: 0, y: 0, rotate: 8, scale: 1 },
    float: { y: [0, -4, 0] },
    delay: 1.2, duration: 2.2, size: 32, top: '42%', left: '3%',
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
        style={{ position:'absolute', right:'-2%', bottom:'-6%', fontSize:280, lineHeight:1, filter:'drop-shadow(0 15px 40px rgba(0,0,0,0.3))' }}>
        🌳
      </motion.div>

      {/* Perched parrots on the tree */}
      {perched.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity:0, scale:0.3 }}
          animate={{
            opacity:1, scale:1, rotate: p.rotate,
            ...p.bob,
          }}
          transition={{
            opacity: { duration:0.5, delay: p.delay },
            scale: { duration:0.5, delay: p.delay },
            rotate: { duration:0.5, delay: p.delay },
            y: { duration:2.5, repeat:Infinity, ease:'easeInOut', delay: p.delay + 0.5 },
          }}
          style={{
            position:'absolute', top:p.top, right:p.right,
            fontSize:p.size, lineHeight:1, zIndex:3,
            filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
          }}>
          🦜
        </motion.div>
      ))}

      {/* Flying parrots approaching */}
      {flying.map((p) => (
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
