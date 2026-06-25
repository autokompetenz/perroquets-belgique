import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLangStore, useThemeStore } from '../store';
import { t } from '../utils/i18n';
import { formatEuro } from '../utils/helpers';
import { useBreakpoint } from '../hooks';

const STATUS_ICONS = {
  pending:          '📝',
  deposit_confirmed: '💳',
  preparing:        '💉',
  ready:            '🐶',
  delivered:        '🏠',
  cancelled:        '❌',
};

export default function Track() {
  const { lang } = useLangStore();
  const { theme } = useThemeStore();
  const { isMobile } = useBreakpoint();
  const isDark = theme === 'dark';
  const l = lang || 'fr';

  const { number } = useParams();
  const [searchNum, setSearchNum] = useState(number || '');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchNum.trim()) return;
    try {
      setLoading(true);
      setSearched(true);
      const { data } = await reservationAPI.track(searchNum.trim().toUpperCase());
      setReservation(data.reservation);
    } catch {
      setReservation(null);
    } finally { setLoading(false); }
  };

  const timelineSteps = [
    { key: 'pending', label: t('timeline_pending', l) },
    { key: 'deposit_confirmed', label: t('timeline_deposit', l) },
    { key: 'preparing', label: t('timeline_prep', l) },
    { key: 'ready', label: t('timeline_ready', l) },
    { key: 'delivered', label: t('timeline_done', l) },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 72 }}>
      <div style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', padding: isMobile ? '36px 4% 28px' : '52px 6% 36px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(30px,5vw,64px)', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            {t('track_order', l)}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-3)', maxWidth: 520 }}>
            {l==='fr'?'Entrez votre numéro de réservation pour suivre l\u2019état de votre futur compagnon.':
              l==='nl'?'Voer uw reserveringsnummer in om de status van uw toekomstige metgezel te volgen.':
              l==='en'?'Enter your reservation number to track the status of your future companion.':'Entrez votre num?ro de r?servation pour suivre l’?tat de votre futur compagnon.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '24px 4%' : '40px 6%' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <input value={searchNum} onChange={e => setSearchNum(e.target.value)}
            placeholder={t('track_ph', l)} className="input-luxury" style={{ flex: 1, fontSize: 16 }} />
          <button type="submit" className="btn-primary" style={{ padding: '13px 20px', fontSize: 13, whiteSpace: 'nowrap' }}>
            {t('track_order', l)}
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(201,118,46,0.15)', borderTopColor: '#C9762E', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto' }} />
          </div>
        )}

        {!loading && searched && !reservation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>
              {l==='fr'?'Réservation introuvable':l==='nl'?'Reservering niet gevonden':l==='en'?'Reservation not found':'Réservation introuvable'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              {l==='fr'?'Vérifiez le numéro et réessayez.':l==='nl'?'Controleer het nummer en probeer het opnieuw.':l==='en'?'Check the number and try again.':'V?rifiez le num?ro et r?essayez.'}
            </p>
          </motion.div>
        )}

        {reservation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 20 : 24, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
                    {l==='fr'?'Réservation':l==='nl'?'Reservering':l==='en'?'Reservation':'Réservation'}
                  </p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
                    {reservation.number}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
                    {t('total', l)}
                  </p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: 'var(--primary)' }}>
                    {formatEuro(reservation.puppy?.price || 0)}
                  </p>
                </div>
              </div>

              {reservation.puppy && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--bg-card2)', borderRadius: 10, marginBottom: 16 }}>
                  <img src={reservation.puppy.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&q=70'}
                    alt={reservation.puppy.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{reservation.puppy.name}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{reservation.puppy.breed}</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{t('deposit', l)}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text)' }}>{formatEuro(reservation.depositAmount)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{t('balance', l)}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text)' }}>{formatEuro((reservation.puppy?.price || 0) - (reservation.depositAmount || 0))}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{l==='fr'?'Client':l==='nl'?'Klant':l==='en'?'Client':'Client'}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text)' }}>{reservation.guestName}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 20 : 28, boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 20 }}>
                {l==='fr'?'Suivi de la réservation':l==='nl'?'Reserveringsstatus':l==='en'?'Reservation status':'Suivi de la réservation'}
              </p>

              <div className="reservation-timeline">
                {timelineSteps.map((step, i) => {
                  const isActive = reservation.status === step.key || (timelineSteps.findIndex(s => s.key === reservation.status) >= i);
                  const isCancelled = reservation.status === 'cancelled';
                  const isCurrentStep = reservation.status === step.key;

                  return (
                    <div key={step.key} className={`timeline-step ${isActive ? 'active' : ''} ${isCancelled && !isActive ? 'cancelled' : ''}`}
                      style={{ display: 'flex', gap: 14, padding: '0 0 24px', position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCurrentStep ? 'linear-gradient(135deg,#A8652A,#C9762E)' : isActive ? 'rgba(201,118,46,0.15)' : 'var(--bg-card2)',
                          border: `2px solid ${isCurrentStep ? '#C9762E' : isActive ? 'rgba(201,118,46,0.4)' : 'var(--border)'}`,
                          fontSize: 16, zIndex: 2, transition: 'all 0.3s',
                        }}>
                          <span style={{ fontSize: 14 }}>{STATUS_ICONS[step.key]}</span>
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div style={{
                            flex: 1, width: 2,
                            background: isActive ? 'linear-gradient(to bottom,#C9762E,rgba(201,118,46,0.2))' : 'var(--border)',
                          }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < timelineSteps.length - 1 ? 0 : 0 }}>
                        <p style={{ fontSize: 14, fontWeight: isCurrentStep ? 700 : 500, color: isActive ? 'var(--text)' : 'var(--text-3)', marginBottom: 2 }}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cancelled */}
              {reservation.status === 'cancelled' && (
                <div style={{ marginTop: 12, padding: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>{t('timeline_cancel', l)}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { reservationAPI } from '../services/api';
