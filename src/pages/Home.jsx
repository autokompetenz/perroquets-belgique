import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { parrotAPI } from '../services/api';
import { formatEuro } from '../utils/helpers';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';
import { useBreakpoint } from '../hooks';
import ParrotCard from '../components/ParrotCard';
import ForetScene from '../components/ForetScene';

const SERVICES = [
  { icon:'🦜', fr:'Perroquets de race', nl:'Papegaaien van ras', en:'Purebred parrots',
    descFr:'Pedigree, parents sélectionnés, santé garantie.', descNl:'Stamboom, geselecteerde ouders, gezondheid gegarandeerd.', descEn:'Pedigree, selected parents, guaranteed health.' },
  { icon:'📋', fr:'Bague & Certificat', nl:'Ring & Certificaat', en:'Ring & Certificate',
    descFr:'Bague fermée, certificat de santé vétérinaire, carnet de santé.', descNl:'Gesloten ring, veteraan gezondheidscertificaat, gezondheidsboekje.', descEn:'Closed ring, veterinary health certificate, health record.' },
  { icon:'🦜', fr:'Réservation simple', nl:'Eenvoudig reserveren', en:'Easy reservation',
    descFr:'Acompte de 50%, solde à la remise. Pas de compte nécessaire.', descNl:'50% aanbetaling, saldo bij levering. Geen account nodig.', descEn:'50% deposit, balance on delivery. No account needed.' },
  { icon:'💉', fr:'Suivi en ligne', nl:'Online volgen', en:'Online tracking',
    descFr:'Suivez votre réservation en temps réel avec votre numéro unique.', descNl:'Volg uw reservering in realtime met uw unieke nummer.', descEn:'Track your reservation in real time with your unique number.' },
  { icon:'💶', fr:'Garantie santé', nl:'Gezondheidsgarantie', en:'Health guarantee',
    descFr:'Tous nos perroquets partent avec un certificat de bonne santé vétérinaire.', descNl:'Al onze papegaaien krijgen een veterinair gezondheidscertificaat.', descEn:'All our parrots come with a veterinary health certificate.' },
  { icon:'📦', fr:'Livraison possible', nl:'Bezorging mogelijk', en:'Delivery possible',
    descFr:'Livraison sécurisée en France et pays limitrophes.', descNl:'Veilige levering in Frankrijk en buurlanden.', descEn:'Secure delivery in France and neighboring countries.' },
];

function CookieBanner({ lang }) {
  const [visible, setVisible] = useState(!localStorage.getItem('sp_cookies'));
  if (!visible) return null;
  const accept  = () => { localStorage.setItem('sp_cookies', '1'); setVisible(false); };
  const decline = () => { localStorage.setItem('sp_cookies', '0'); setVisible(false); };
  const msg = { fr:'Nous utilisons des cookies pour améliorer votre expérience.', nl:'We gebruiken cookies om uw ervaring te verbeteren.', en:'We use cookies to improve your experience.' };
  return (
    <div className="cookie-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
      <p style={{ fontSize:14, color:'var(--text-2)', flex:1 }}>🦜 {msg[lang] || msg.fr}</p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={decline} style={{ padding:'9px 18px', background:'var(--bg-card2)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-3)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>{lang==='nl'?'Weigeren':lang==='en'?'Decline':'Refuser'}</button>
        <button onClick={accept} className="btn-primary" style={{ fontSize:13, padding:'9px 20px' }}>{lang==='nl'?'Accepteren':lang==='en'?'Accept':'Accepter'}</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackNum, setTrackNum] = useState('');
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const l = lang || 'fr';
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroY = useTransform(scrollYProgress, [0,1], ['0%','25%']);
  const heroO = useTransform(scrollYProgress, [0,0.7], [1,0]);

  useEffect(() => {
    setLoading(true);
    parrotAPI.getAll({ featured:'true', limit:8 })
      .then(r => { setFeatured(r.data.parrots||[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackNum.trim()) navigate(`/track/${trackNum.trim().toUpperCase()}`);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <section ref={heroRef} style={{ position:'relative', height: isMobile ? '100svh' : '100vh', minHeight:580, display:'flex', alignItems:'center', overflow:'hidden', background:'linear-gradient(160deg, #0D2414 0%, #1A3C26 30%, #2D5A3E 60%, #3A7D44 100%)' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.15 }}>
          <div style={{ position:'absolute', width:'120%', height:'120%', top:'-10%', left:'-10%', background:'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
          <div style={{ position:'absolute', width:'100%', height:'100%', background:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.3\'/%3E%3C/svg%3E")' }} />
        </div>

        <ForetScene />

        <motion.div style={{ position:'relative', zIndex:3, padding: isMobile ? '0 5%' : '0 7%', maxWidth:780, opacity:heroO }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(58,125,68,0.3)', border:'1px solid rgba(58,125,68,0.5)', borderRadius:4, padding:'7px 16px', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4CAF50', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.8)' }}>
                {t('hero_badge', l)}
              </span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.2 }}
            style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 'clamp(38px,10vw,56px)' : 'clamp(52px,6vw,88px)', color:'#fff', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:22 }}>
            LE PARC<br/><span style={{ color:'#66BB6A' }}>DES PERROQUETS</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.35 }}
            style={{ fontSize: isMobile ? 15 : 18, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:36, maxWidth:520 }}>
            {t('hero_subtitle', l)}
          </motion.p>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}
            style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link to="/catalog" className="btn-primary" style={{ fontSize: isMobile ? 13 : 14 }}>
              {t('hero_cta1', l)} →
            </Link>
            <Link to="/catalog" className="btn-ghost" style={{ fontSize: isMobile ? 13 : 14, borderColor:'rgba(255,255,255,0.3)', color:'rgba(255,255,255,0.85)' }}>
              {t('hero_cta2', l)}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1.8, duration:0.6 }}
          style={{ position:'absolute', bottom: isMobile ? 60 : 70, left:'50%', transform:'translateX(-50%)', zIndex:3, display:'flex', flexDirection:'column', alignItems:'center', gap:4, pointerEvents:'none' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>
            {l==='fr'?'Défiler':l==='nl'?'Scrollen':l==='en'?'Scroll':'Défiler'}
          </span>
          <motion.div
            animate={{ y:[0,6,0] }}
            transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:20, height:20, borderRight:'2px solid rgba(255,255,255,0.35)', borderBottom:'2px solid rgba(255,255,255,0.35)', transform:'rotate(45deg)' }} />
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.6 }}
          style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(10,25,15,0.85)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.08)', padding: isMobile ? '16px 5%' : '22px 7%', display:'flex', justifyContent:'space-around', gap:16, flexWrap:'wrap' }}>
          {[
            { value:'8+', label:t('hero_stat1', l) },
            { value:'4.9 ★', label:t('hero_stat2', l) },
            { value:'150+', label:t('hero_stat3', l) },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 22 : 30, color:'#66BB6A', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize: isMobile ? 10 : 12, color:'rgba(255,255,255,0.45)', marginTop:4, fontWeight:600, letterSpacing:'0.05em' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <div style={{ background:'var(--bg-card2)', borderBottom:'1px solid var(--border)', padding: isMobile ? '20px 5%' : '24px 7%' }}>
        <form onSubmit={handleTrack} style={{ maxWidth:640, margin:'0 auto', display:'flex', gap:10 }}>
          <input value={trackNum} onChange={e => setTrackNum(e.target.value)}
            placeholder={t('track_ph', l)}
            className="input-luxury"
            style={{ flex:1, fontSize: isMobile ? 14 : 15 }} />
          <button type="submit" className="btn-primary" style={{ padding:'13px 20px', fontSize:13, whiteSpace:'nowrap', flexShrink:0 }}>
            {t('track_order', l)}
          </button>
        </form>
      </div>

      {/* Featured parrots */}
      <section style={{ background:'var(--bg)', borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 52 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>
              {l==='fr'?'Nos perroquets disponibles':l==='nl'?'Onze beschikbare papegaaien':l==='en'?'Our available parrots':'Nos perroquets disponibles'}
            </div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,52px)', color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:12 }}>
              {l==='fr'?'Disponibles\nà la réservation':l==='nl'?'Beschikbaar\nvoor reservering':l==='en'?'Available\nfor reservation':'Disponibles à la réservation'}
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(270px,1fr))', gap: isMobile ? 14 : 22 }}>
            {featured.map((p, i) => <ParrotCard key={p.id} parrot={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ background:'var(--bg-card2)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('services_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              {l==='fr'?'Une adoption en toute confiance':l==='nl'?'Een adoptie met vertrouwen':l==='en'?'Adoption with confidence':'Une adoption en toute confiance'}
            </h2>
            <p style={{ fontSize:16, color:'var(--text-3)', marginTop:12, maxWidth:560, margin:'12px auto 0' }}>{t('services_sub', l)}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 20 }}>
            {SERVICES.map((s, i) => {
              const title = s[l] || s.fr;
              const desc = s[`desc${l.charAt(0).toUpperCase()+l.slice(1)}`] || s.descFr;
              return (
                <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:8 }}>{title}</h3>
                  <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.65 }}>{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ background:'var(--bg)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('reviews_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              {l==='fr'?'Ce que disent nos familles':l==='nl'?'Wat onze families zeggen':l==='en'?'What our families say':'Ce que disent nos familles'}
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 14 : 22 }}>
            {[
              { stars:5, text:{fr:'Un accueil chaleureux et professionnel. Notre petit Coco est en pleine forme !',nl:'Een warm en professioneel onthaal. Onze kleine Coco is in topvorm!',en:'A warm and professional welcome. Our little Coco is in great shape!'}, author:'Sophie M.', city:'Arlon' },
              { stars:5, text:{fr:'Éleveur sérieux, perroquets en parfaite santé. Les conseils étaient très utiles. Je recommande.',nl:'Serieuze fokker, papegaaien in perfecte gezondheid. Het advies was erg nuttig.',en:'Serious breeder, parrots in perfect health. The advice was very useful.'}, author:'Thomas D.', city:'Luxembourg' },
              { stars:5, text:{fr:'Réservation facile et livraison impeccable. Notre Bella est arrivée en pleine forme.',nl:'Eenvoudig reserveren en een vlekkeloze levering. Onze Bella arriveerde in topvorm.',en:'Easy reservation and flawless delivery. Our Bella arrived in great shape.'}, author:'Maria L.', city:'Namur' },
              { stars:5, text:{fr:'Tout s\'est déroulé comme convenu. Le suivi avant la livraison était très rassurant.',nl:'Alles verliep zoals afgesproken. De opvolging voor de levering was geruststellend.',en:'Everything went as agreed. The follow-up before delivery was very reassuring.'}, author:'Pierre H.', city:'Liège' },
              { stars:5, text:{fr:'Nous avons réservé à distance sans aucun souci. Les photos et vidéos nous ont permis de choisir en toute confiance.',nl:'We hebben op afstand gereserveerd zonder problemen. De foto\'s en video\'s gaven ons vertrouwen.',en:'We reserved remotely without any issue. The photos and videos let us choose confidently.'}, author:'Carine V.', city:'Bruxelles' },
              { stars:5, text:{fr:'Service de livraison au top ! Notre perroquet est arrivé en parfaite santé avec tous ses documents.',nl:'Top leveringsservice! Onze papegaai arriveerde in perfecte gezondheid met alle documenten.',en:'Top delivery service! Our parrot arrived in perfect health with all documents.'}, author:'Jean-Pierre R.', city:'Mons' },
              { stars:5, text:{fr:'Un grand merci pour votre professionnalisme. La réservation en ligne était simple et la communication claire.',nl:'Hartelijk dank voor uw professionaliteit. De online reservering was eenvoudig en de communicatie duidelijk.',en:'Thank you for your professionalism. The online reservation was simple and communication was clear.'}, author:'Anne-Sophie K.', city:'Bren' },
              { stars:5, text:{fr:'Notre petit Kiwi est un amour. Tout était prêt pour son arrivée grâce aux conseils reçus.',nl:'Onze kleine Kiwi is een schat. Alles was klaar voor zijn komst dankzij het advies.',en:'Our little Kiwi is a sweetheart. Everything was ready for his arrival thanks to the advice.'}, author:'Marc D.', city:'Marche-en-Famenne' },
              { stars:5, text:{fr:'Très satisfaits de notre expérience. Le prix était clair, sans surprise.',nl:'Zeer tevreden met onze ervaring. De prijs was duidelijk, zonder verrassingen.',en:'Very satisfied with our experience. The price was clear, no surprises.'}, author:'Laura B.', city:'Arlon' },
              { stars:5, text:{fr:'La livraison a été organisée rapidement après la réservation.',nl:'De levering werd snel georganiseerd na de reservering.',en:'Delivery was organized quickly after reservation.'}, author:'Cédric T.', city:'Libramont' },
              { stars:4, text:{fr:'Très bon contact avec l\'éleveur. Le perroquet était en pleine forme.',nl:'Goed contact met de fokker. De papegaai was in topvorm.',en:'Good contact with the breeder. The parrot was healthy.'}, author:'Nathalie F.', city:'Liège' },
              { stars:4, text:{fr:'Réservation facile et rapide. Petits soucis de communication mais tout bien arrangé.',nl:'Eenvoudig en snel reserveren. Communicatieprobleem maar alles opgelost.',en:'Easy and quick reservation. Small communication issue but resolved.'}, author:'Jonathan W.', city:'Bruxelles' },
              { stars:4, text:{fr:'Perroquet conforme aux photos. Je retire une étoile car le transport était stressant.',nl:'Papegaai zoals op foto\'s. Transport was stressvol.',en:'Parrot matches photos. Transport was stressful.'}, author:'Sébastien G.', city:'Namur' },
              { stars:4, text:{fr:'Bonne expérience globale. La réservation s\'est bien passée.',nl:'Goede ervaring. Reservering verliep goed.',en:'Good overall experience. Reservation went well.'}, author:'Valérie M.', city:'Virton' },
              { stars:4, text:{fr:'Contact agréable et perroquet en bonne santé.',nl:'Aangenaam contact en gezonde papegaai.',en:'Pleasant contact and healthy parrot.'}, author:'Damien P.', city:'Neufchâteau' },
              { stars:4, text:{fr:'Livraison soignée et perroquet bien socialisé.',nl:'Zorgvuldige levering en goed gesocialiseerde papegaai.',en:'Careful delivery and well-socialized parrot.'}, author:'Catherine L.', city:'Bren' },
              { stars:4, text:{fr:'Tout s\'est bien passé dans l\'ensemble.',nl:'Alles is goed verlopen.',en:'Everything went well overall.'}, author:'François X.', city:'Arlon' },
              { stars:3, text:{fr:'Perroquet conforme. Livraison compliquée mais bien finie.',nl:'Papegaai zoals beloofd. Levering moeilijk maar goed afgelopen.',en:'Parrot as promised. Delivery complicated but ended well.'}, author:'Isabelle R.', city:'Luxembourg' },
              { stars:3, text:{fr:'Satisfait du perroquet, communication à améliorer.',nl:'Tevreden over papegaai, communicatie kan beter.',en:'Satisfied with parrot, communication could improve.'}, author:'Luc B.', city:'Liège' },
              { stars:3, text:{fr:'Perroquet en bonne santé, processus correct.',nl:'Papegaai gezond, proces oké.',en:'Parrot healthy, process fine.'}, author:'Patrick S.', city:'Bouillon' },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {Array.from({length:5}).map((_,j)=><span key={j} style={{ color:j<r.stars?'#FFAA00':'var(--border-2)', fontSize:18 }}>★ </span>)}
                </div>
                <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.7, marginBottom:16 }}>"{r.text[l] || r.text.fr}"</p>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{r.author}</p>
                <p style={{ fontSize:11, color:'var(--text-3)' }}>{r.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <CookieBanner lang={l} />
    </div>
  );
}
