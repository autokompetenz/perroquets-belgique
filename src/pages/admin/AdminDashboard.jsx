import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { formatDate, formatEuro } from '../../utils/helpers';
import { Loader } from '../../components/UI';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}><Loader text="Chargement du tableau de bord..." /></div>;
  if (!data) return null;

  const { totalParrots = 0, totalReservations = 0, pendingReservations = 0, totalRevenue = 0, recentReservations = [] } = data;

  const statCards = [
    { icon:'🦜', label:'Perroquets', value: totalParrots, color:'#60A5FA', sub:'En catalogue' },
    { icon:'📈', label:'Réservations', value: totalReservations, color:'#C084FC', sub:'Total réservations' },
    { icon:'💵', label:'Chiffre d\'affaires', value: formatEuro(totalRevenue), color:'#C9762E', sub:'Hors annulées', wide: true },
    { icon:'?', label:'En attente', value: pendingReservations, color: pendingReservations > 0 ? '#FFAA00' : '#22C55E', sub: pendingReservations > 0 ? 'Action requise' : 'Aucune en attente' },
    { icon:'🐾', label:'Disponibles', value: data?.availableParrots || 0, color:'#22C55E', sub:'À l\'adoption' },
  ];

  return (
    <div style={{ padding:'clamp(24px,5vw,48px) clamp(16px,4vw,44px) 60px', minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-eyebrow">Administration</div>
        <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(28px,4vw,48px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
          Tableau de bord
        </h1>
      </div>

      <div className="admin-stats-grid">
        {statCards.map(({ icon, label, value, color, sub, wide }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            className={wide ? 'admin-stat-wide' : undefined}
            style={{ background:`linear-gradient(135deg, var(--bg-card) 0%, ${color}14 100%)`, border:'1px solid var(--border)', borderRadius:12, padding:'22px 20px', position:'relative', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, background:color, opacity:0.06, borderRadius:'50%', filter:'blur(40px)' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, position:'relative', zIndex:1 }}>
              <span style={{ fontSize:26 }}>{icon}</span>
            </div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(28px,3.5vw,40px)', color, lineHeight:1, letterSpacing:'-0.03em', position:'relative', zIndex:1 }}>{value}</div>
            <div style={{ fontSize:13, color:'var(--text-2)', marginTop:8, fontWeight:700, position:'relative', zIndex:1 }}>{label}</div>
            <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4, position:'relative', zIndex:1 }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-card2)' }}>
          <p style={{ fontSize:11, fontWeight:800, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--primary)' }}>Dernières réservations</p>
          <Link to="/admin/reservations" style={{ fontSize:13, color:'var(--text-3)', textDecoration:'none', fontWeight:600 }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-3)'}>
            Voir tout → 
          </Link>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['N° Réservation','Client','Date','Montant','Statut',''].map(h => (
                  <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-3)', padding:'14px 20px', background:'var(--bg-card2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentReservations || []).map(res => (
                <tr key={res.id} style={{ borderBottom:'1px solid var(--border)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ fontFamily:'monospace', color:'var(--primary)', fontSize:13, fontWeight:800, letterSpacing:'0.05em', background:'var(--primary-bg)', padding:'4px 10px', borderRadius:6, border:'1px solid var(--primary-border)' }}>{res.reservationNumber}</span>
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <p style={{ fontSize:14, color:'var(--text)', fontWeight:700 }}>{res.guestName}</p>
                    <p style={{ fontSize:12, color:'var(--text-3)', marginTop:3 }}>{res.guestEmail}</p>
                  </td>
                  <td style={{ padding:'14px 20px', color:'var(--text-2)', fontSize:13, fontWeight:500 }}>{formatDate(res.createdAt)}</td>
                  <td style={{ padding:'14px 20px', fontWeight:800, color:'var(--text)', fontSize:16 }}>{formatEuro(res.parrot?.price || 0)}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <span className={`badge badge-${res.status}`}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'currentColor', display:'inline-block' }} />
                      {res.status}
                    </span>
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <Link to={`/admin/reservations/${res.id}`} className="btn-primary" style={{ fontSize:12, padding:'10px 18px', letterSpacing:'0.05em' }}>Gérer</Link>
                  </td>
                </tr>
              ))}
              {(!recentReservations || recentReservations.length === 0) && (
                <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>Aucune réservation récente</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
