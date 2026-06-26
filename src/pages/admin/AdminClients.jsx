import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatEuro, formatDate, getInitials } from '../../utils/helpers';
import { Loader } from '../../components/UI';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.clients().then(r => { setClients(r.data.clients); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}><Loader text="Chargement des clients..." /></div>;

  return (
    <div style={{ padding:'clamp(24px,5vw,48px) clamp(16px,4vw,44px) 60px', minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ marginBottom:32 }}>
        <div className="section-eyebrow">CRM</div>
        <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(28px,4vw,48px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
          Clients <span style={{ color:'var(--text-3)', fontSize:'0.55em', fontWeight:600 }}>({clients.length})</span>
        </h1>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 24px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12 }}>
          <p style={{ fontSize:48, marginBottom:16 }}>👥</p>
          <p style={{ fontWeight:700, color:'var(--text)', marginBottom:8 }}>Aucun client</p>
          <p style={{ color:'var(--text-3)' }}>Les clients apparaîtront après la première réservation.</p>
        </div>
      ) : (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Client','Contact','Réservations','Total dépensé','Première réservation'].map(h => (
                    <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-3)', padding:'14px 20px', background:'var(--bg-card2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(guest => (
                  <tr key={guest.id} style={{ borderBottom:'1px solid var(--border)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2A5E32,#3A7D44)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0 }}>
                          {getInitials(guest.name)}
                        </div>
                        <p style={{ fontWeight:800, color:'var(--text)', fontSize:15 }}>{guest.name}</p>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <p style={{ fontWeight:600, color:'var(--text)' }}>{guest.email}</p>
                      {guest.phone && <p style={{ fontSize:13, color:'var(--text-3)', marginTop:2 }}>{guest.phone}</p>}
                    </td>
                    <td style={{ padding:'14px 20px', color:'var(--text-2)', fontWeight:700, fontSize:16 }}>{guest._count?.reservations || 0}</td>
                    <td style={{ padding:'14px 20px', fontWeight:800, color:'var(--primary)', fontSize:16 }}>{formatEuro(guest.totalSpent || 0)}</td>
                    <td style={{ padding:'14px 20px', color:'var(--text-3)', fontSize:13 }}>{guest.firstReservation ? formatDate(guest.firstReservation) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
