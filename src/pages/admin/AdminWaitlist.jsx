import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatEuro, formatDate, getInitials } from '../../utils/helpers';
import { Loader } from '../../components/UI';
import { useToastStore } from '../../store';

export default function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToastStore();

  const load = () => {
    setLoading(true);
    adminAPI.waitlist()
      .then(r => { setEntries(Array.isArray(r.data?.waitlist) ? r.data.waitlist : []); setLoading(false); })
      .catch(() => { setEntries([]); setLoading(false); });
  };
  useEffect(load, []);

  const handleDelete = async (entry) => {
    if (!window.confirm(`Supprimer l'entrée de ${entry.name || entry.email} ?`)) return;
    try {
      await adminAPI.deleteWaitlist?.(entry.id);
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      addToast('Entrée supprimée', 'success');
    } catch { addToast('Erreur', 'error'); }
  };

  if (loading) return <div style={{ padding: 40 }}><Loader text="Chargement de la liste d'attente..." /></div>;

  return (
    <div style={{ padding: 'clamp(24px,5vw,48px) clamp(16px,4vw,44px) 60px', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Marketing</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Liste d'attente <span style={{ color: 'var(--text-3)', fontSize: '0.55em', fontWeight: 600 }}>({entries.length})</span>
        </h1>
      </div>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>⏳</p>
          <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Aucune inscription</p>
          <p style={{ color: 'var(--text-3)' }}>La liste d'attente est vide.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nom', 'Email', 'Race souhaitée', 'Inscrit le', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '14px 20px', background: 'var(--bg-card2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontWeight: 700, color: 'var(--text)' }}>{entry.name || '—'}</p>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-2)' }}>{entry.email}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-2)' }}>{entry.breed || '—'}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-3)', fontSize: 13 }}>{formatDate(entry.createdAt)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button type="button" onClick={() => handleDelete(entry)}
                        className="admin-table-btn-danger" style={{ fontSize: 13, color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 800 }}>
                        Supprimer
                      </button>
                    </td>
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
