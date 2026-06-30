import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useToastStore } from '../../store';
import { Loader } from '../../components/UI';

export default function AdminParrots() {
  const [parrots, setParrots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { addToast } = useToastStore();
  const location = useLocation();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setLoadError(false);
    adminAPI.parrots()
      .then(r => { setParrots(Array.isArray(r.data?.parrots) ? r.data.parrots : []); setLoading(false); })
      .catch(() => { setParrots([]); setLoadError(true); setLoading(false); });
  };

  useEffect(load, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      addToast(location.state.successMessage, 'success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleToggle = async (parrot) => {
    try {
      const { data } = await adminAPI.toggleParrot(parrot.id);
      setParrots(prev => prev.map(p => p.id === parrot.id ? data.parrot : p));
      addToast(data.message || 'Statut mis à jour', 'success');
    } catch { addToast('Erreur', 'error'); }
  };

  const handleDelete = async (parrot) => {
    if (!window.confirm(`Supprimer définitivement ${parrot.name} ? Cette action est irréversible.`)) return;
    try {
      await adminAPI.deleteParrot(parrot.id);
      setParrots(prev => prev.filter(p => p.id !== parrot.id));
      addToast('Perroquet supprimé', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Suppression impossible', 'error');
    }
  };

  if (loading) return <div style={{ padding: 40 }}><Loader text="Chargement des perroquets..." /></div>;

  return (
    <div style={{ padding: 'clamp(24px,5vw,48px) clamp(16px,4vw,44px) 60px', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        <div>
          <div className="section-eyebrow">Inventaire</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Perroquets <span style={{ color: 'var(--text-3)', fontSize: '0.55em', fontWeight: 600 }}>({parrots.length})</span>
          </h1>
        </div>
        <Link to="/admin/parrots/new" className="btn-primary" style={{ fontSize: 14, padding: '14px 24px', alignSelf: 'flex-end' }}>
          + Ajouter un perroquet
        </Link>
      </div>

      {loadError && (
        <div style={{ marginBottom: 24, padding: 20, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <p style={{ color: '#EF4444', fontWeight: 600, marginBottom: 12 }}>Impossible de charger les perroquets.</p>
          <button type="button" className="btn-ghost" onClick={load}>Réessayer</button>
        </div>
      )}

      {parrots.length === 0 && !loadError ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🦜</p>
          <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Aucun perroquet</p>
          <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Ajoutez votre premier perroquet au catalogue.</p>
          <Link to="/admin/parrots/new" className="btn-primary">+ Ajouter un perroquet</Link>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Photo', 'Nom', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '14px 20px', background: 'var(--bg-card2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parrots.map(parrot => (
                  <tr key={parrot.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s var(--ease)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px' }}>
                      {parrot.imageUrl ? (
                        <img src={parrot.imageUrl} alt="" style={{ width: 88, height: 64, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                      ) : (
                        <div style={{ width: 88, height: 64, borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)' }} />
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: 16 }}>{parrot.name}</p>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to={`/admin/parrots/${parrot.id}/edit`} className="admin-table-btn" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 800 }}>
                          Modifier
                        </Link>
                        <button type="button" onClick={() => handleToggle(parrot)}
                          className="admin-table-btn" style={{ fontSize: 13, color: parrot.isActive ? '#DC2626' : '#22C55E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>
                          {parrot.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button type="button" onClick={() => handleDelete(parrot)}
                          className="admin-table-btn-danger" style={{ fontSize: 13, color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 800 }}>
                          Supprimer
                        </button>
                      </div>
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