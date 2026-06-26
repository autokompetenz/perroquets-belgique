import { motion } from 'framer-motion';

function Parrot({ style, initial, animate, transition, children }) {
  return (
    <motion.div
      initial={initial || { opacity:0, scale:0 }}
      animate={animate || { opacity:1, scale:1 }}
      transition={transition || { duration:0.6, delay:0.5 }}
      style={{ position:'absolute', fontSize:40, lineHeight:1, zIndex:2, filter:'drop-shadow(0 4px 10px rgba(0,0,0,0.2))', ...style }}>
      🦜
    </motion.div>
  );
}

const DELAY = 0.7;

export default function ForetScene() {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden' }}>
      {/* Large tree on the right */}
      <motion.div
        initial={{ opacity:0, scale:0.3, x:100 }}
        animate={{ opacity:1, scale:1, x:0 }}
        transition={{ duration:1.2, delay:0.3, ease:[0.16,1,0.3,1] }}
        style={{
          position:'absolute',
          right:'-5%', bottom:'-10%',
          width:'55vmin', height:'55vmin',
          borderRadius:'50% 50% 20% 20%',
          background:'radial-gradient(ellipse at 40% 50%, #2D5A3E 0%, #1A3C26 60%, #0D2414 100%)',
          boxShadow:'inset -20px -10px 40px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.25)',
          zIndex:1,
        }}
      />

      {/* Tree trunk */}
      <motion.div
        initial={{ opacity:0, scaleY:0 }}
        animate={{ opacity:1, scaleY:1 }}
        transition={{ duration:0.8, delay:0.5 }}
        style={{
          position:'absolute',
          right:'18%', bottom:'-10%',
          width:'9%', height:'30%',
          background:'linear-gradient(90deg, #3E2723, #5D4037, #3E2723)',
          borderRadius:'0 0 30% 30%',
          zIndex:0,
        }}
      />

      {/* Branches */}
      <motion.div
        initial={{ opacity:0, scaleX:0 }}
        animate={{ opacity:1, scaleX:1 }}
        transition={{ duration:0.6, delay:0.6 }}
        style={{ position:'absolute', right:'38%', top:'38%', width:'18%', height:'6px', background:'#5D4037', borderRadius:4, transformOrigin:'right center', zIndex:0, transform:'rotate(-15deg)' }}
      />
      <motion.div
        initial={{ opacity:0, scaleX:0 }}
        animate={{ opacity:1, scaleX:1 }}
        transition={{ duration:0.6, delay:0.7 }}
        style={{ position:'absolute', right:'35%', top:'48%', width:'15%', height:'5px', background:'#5D4037', borderRadius:4, transformOrigin:'right center', zIndex:0, transform:'rotate(10deg)' }}
      />
      <motion.div
        initial={{ opacity:0, scaleX:0 }}
        animate={{ opacity:1, scaleX:1 }}
        transition={{ duration:0.6, delay:0.8 }}
        style={{ position:'absolute', right:'40%', top:'56%', width:'12%', height:'5px', background:'#5D4037', borderRadius:4, transformOrigin:'right center', zIndex:0, transform:'rotate(-5deg)' }}
      />

      {/* Perched parrots on branches */}
      <Parrot
        initial={{ opacity:0, x:-40, y:20 }}
        animate={{ opacity:1, x:0, y:0 }}
        transition={{ duration:0.8, delay:DELAY, ease:[0.16,1,0.3,1] }}
        style={{
          top:'34%', right:'34%', fontSize:40, zIndex:3, rotate:'-10deg',
          animation:'float 2.8s ease-in-out infinite',
          animationDelay:'1.5s',
        }}
      />
      <Parrot
        initial={{ opacity:0, x:-30, y:20 }}
        animate={{ opacity:1, x:0, y:0 }}
        transition={{ duration:0.8, delay:DELAY+0.3, ease:[0.16,1,0.3,1] }}
        style={{
          top:'44%', right:'30%', fontSize:34, zIndex:3, rotate:'8deg',
          animation:'float 3.2s ease-in-out infinite',
          animationDelay:'1.8s',
        }}
      />
      <Parrot
        initial={{ opacity:0, x:-25, y:20 }}
        animate={{ opacity:1, x:0, y:0 }}
        transition={{ duration:0.8, delay:DELAY+0.6, ease:[0.16,1,0.3,1] }}
        style={{
          top:'53%', right:'36%', fontSize:30, zIndex:3, rotate:'-6deg',
          animation:'float 3.6s ease-in-out infinite',
          animationDelay:'2s',
        }}
      />

      {/* Flying parrots */}
      <motion.div
        initial={{ opacity:0, x:-200, y:-30, rotate:-20, scale:0.3 }}
        animate={{ opacity:1, x:0, y:0, rotate:0, scale:1 }}
        transition={{ duration:1.5, delay:DELAY+0.2, ease:[0.16,1,0.3,1] }}
        style={{
          position:'absolute', top:'22%', left:'6%', fontSize:38, lineHeight:1, zIndex:2,
          filter:'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
          animation:'float 2.5s ease-in-out infinite',
          animationDelay:'2s',
        }}>
        🦜
      </motion.div>
      <motion.div
        initial={{ opacity:0, x:-150, y:40, rotate:15, scale:0.25 }}
        animate={{ opacity:1, x:0, y:0, rotate:0, scale:1 }}
        transition={{ duration:1.4, delay:DELAY+0.7, ease:[0.16,1,0.3,1] }}
        style={{
          position:'absolute', top:'50%', left:'10%', fontSize:30, lineHeight:1, zIndex:2,
          filter:'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
          animation:'float 3s ease-in-out infinite',
          animationDelay:'2.5s',
        }}>
        🦜
      </motion.div>
    </div>
  );
}
