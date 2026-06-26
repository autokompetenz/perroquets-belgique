import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useToastStore } from '../../store';
import { useBreakpoint } from '../../hooks';
import { SPECIES } from '../../utils/helpers';

const EMPTY = {
  name:'', species:'Gris du Gabon', sex:'Male', birthDate:'', price:'',
  description:'', parentMotherName:'', parentFatherName:'', pedigreeDocUrl:'',
  ringNumber:'', handFed:true, talkingAbility:'', color:'',
  saleType:'solo', partnerName:'', partnerSex:'Female', partnerBirthDate:'', partnerColor:'', partnerPedigreeDocUrl:'',
  featured:false, isActive:true,
};

function Section({ title, children }) {
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:28, marginBottom:22, boxShadow:'var(--shadow-sm)' }}>
      <p style={{ fontSize:11, fontWeight:800, letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--primary)', marginBottom:20 }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, field, type='text', placeholder, opts, rows, value, onChange }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:10 }}>{label}</label>
      {opts ? (
        <select name={field} value={value} onChange={onChange} className="input-luxury" style={{ fontSize:15, borderRadius:10, padding:'14px 18px' }}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea name={field} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
          className="input-luxury" style={{ resize:'none', fontSize:15, borderRadius:10, padding:'14px 18px', lineHeight:1.6 }} />
      ) : (
        <input name={field} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="input-luxury" style={{ fontSize:15, borderRadius:10, padding:'14px 18px' }} />
      )}
    </div>
  );
}

export default function AdminParrotForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { isMobile } = useBreakpoint();
  const isEdit = !!id && id !== 'new';
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => () => { previews.forEach(p => { if (!p.isExisting && p.url?.startsWith('blob:')) URL.revokeObjectURL(p.url); }); }, [previews]);

  useEffect(() => {
    if (isEdit) {
      adminAPI.getParrotById(id).then(r => {
        const c = r.data.parrot;
        const birthDate = c.birthDate ? new Date(c.birthDate).toISOString().split('T')[0] : '';
        const partnerBirthDate = c.partnerBirthDate ? new Date(c.partnerBirthDate).toISOString().split('T')[0] : '';
        setForm({ ...EMPTY, ...c, price: String(c.price || ''), birthDate, partnerBirthDate });
        const existing = [];
        ['imageUrl', 'imageUrl2', 'imageUrl3', 'imageUrl4', 'imageUrl5'].forEach((field, idx) => {
          if (c[field]) existing.push({ url: c[field], id: `existing-${idx + 1}`, isExisting: true, field });
        });
        setExistingImages(existing);
      });
    }
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const { type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [field]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleImageChange = (e) => {
    if (!e.target?.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => { const url = URL.createObjectURL(file); setPreviews(prev => [...prev, { file, url, id: crypto.randomUUID(), isExisting: false }]); });
    }
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    const previewToRemove = previews.find(p => p.id === imageId);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      setImageFiles(prev => prev.filter(file => file !== previewToRemove.file));
      setPreviews(prev => prev.filter(p => p.id !== imageId));
      return;
    }
    const existingToRemove = existingImages.find(img => img.id === imageId);
    if (existingToRemove) {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      if (existingToRemove.field) setForm(prev => ({ ...prev, [existingToRemove.field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, v); });
      imageFiles.forEach(file => formData.append('images', file));
      existingImages.forEach(img => formData.append('existingImages', img.url));
      if (isEdit) { await adminAPI.updateParrot(id, formData); navigate('/admin/parrots', { replace: true, state: { successMessage: 'Perroquet mis à jour' } }); }
      else { await adminAPI.createParrot(formData); navigate('/admin/parrots', { replace: true, state: { successMessage: 'Perroquet créé' } }); }
    } catch (err) { addToast(err.response?.data?.error || err.message || 'Erreur', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'clamp(24px,5vw,48px) clamp(16px,4vw,44px) 60px', minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ marginBottom:32 }}>
        <div className="section-eyebrow">{isEdit ? 'Modifier' : 'Ajouter'}</div>
        <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(28px,4vw,44px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
          {isEdit ? 'Modifier le perroquet' : 'Nouveau perroquet'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 780 }}>
        <Section title="Informations principales">
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16, marginBottom:16 }}>
            <Field label="Nom *" field="name" placeholder="Kiwi" value={form.name} onChange={set("name")} />
            <Field label="Espèce *" field="species" opts={SPECIES} value={form.species} onChange={set("species")} />
            <Field label="Sexe" field="sex" opts={['Male','Female']} value={form.sex} onChange={set("sex")} />
            <Field label="Date de naissance" field="birthDate" type="date" value={form.birthDate} onChange={set("birthDate")} />
            <Field label="Prix (€) *" field="price" type="number" placeholder="1500" value={form.price} onChange={set("price")} />
            <Field label="Couleur" field="color" placeholder="Vert, bleu..." value={form.color} onChange={set("color")} />
            <Field label="Bague fermée" field="ringNumber" placeholder="FR123456" value={form.ringNumber} onChange={set("ringNumber")} />
            <Field label="Capacité à parler" field="talkingAbility" placeholder="Quelques mots, phrases..." value={form.talkingAbility} onChange={set("talkingAbility")} />
          </div>
          <Field label="Description" field="description" rows={4} placeholder="Description détaillée du perroquet..." value={form.description} onChange={set("description")} />

          <div style={{ marginTop:16, display:'flex', gap:20, flexWrap:'wrap' }}>
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'10px 14px', borderRadius:8, background:'var(--bg-card2)', border: form.handFed ? '1px solid var(--primary-border)' : '1px solid var(--border)' }}>
              <input type="checkbox" checked={form.handFed} onChange={set("handFed")} style={{ accentColor:'#C9762E', width:18, height:18 }} />
              <span style={{ fontSize:14, color:'var(--text-2)', fontWeight:600 }}>Nourri(e) à la main</span>
            </label>
          </div>
        </Section>

        <Section title="Type de vente">
          <div style={{ display:'flex', gap:16, marginBottom:16 }}>
            <label style={{ flex:1, display:'flex', alignItems:'center', gap:12, cursor:'pointer', padding:'14px 18px', borderRadius:10, background: form.saleType === 'solo' ? 'var(--primary-bg)' : 'var(--bg-card2)', border: form.saleType === 'solo' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <input type="radio" name="saleType" value="solo" checked={form.saleType === 'solo'} onChange={set("saleType")} style={{ accentColor:'#C9762E', width:18, height:18 }} />
              <div>
                <span style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>🦜 Seul</span>
                <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>Vente d'un perroquet individuel</p>
              </div>
            </label>
            <label style={{ flex:1, display:'flex', alignItems:'center', gap:12, cursor:'pointer', padding:'14px 18px', borderRadius:10, background: form.saleType === 'couple' ? 'var(--primary-bg)' : 'var(--bg-card2)', border: form.saleType === 'couple' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <input type="radio" name="saleType" value="couple" checked={form.saleType === 'couple'} onChange={set("saleType")} style={{ accentColor:'#C9762E', width:18, height:18 }} />
              <div>
                <span style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>💑 En couple</span>
                <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>Vente d'un couple de perroquets</p>
              </div>
            </label>
          </div>
        </Section>

        {form.saleType === 'couple' && (
          <Section title="Informations du partenaire">
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16 }}>
              <Field label="Nom du partenaire *" field="partnerName" placeholder="Luna" value={form.partnerName} onChange={set("partnerName")} />
              <Field label="Sexe" field="partnerSex" opts={['Male','Female']} value={form.partnerSex} onChange={set("partnerSex")} />
              <Field label="Date de naissance" field="partnerBirthDate" type="date" value={form.partnerBirthDate} onChange={set("partnerBirthDate")} />
              <Field label="Couleur" field="partnerColor" placeholder="Vert, bleu..." value={form.partnerColor} onChange={set("partnerColor")} />
              <Field label="Pedigree" field="partnerPedigreeDocUrl" placeholder="URL du pedigree" value={form.partnerPedigreeDocUrl} onChange={set("partnerPedigreeDocUrl")} />
            </div>
          </Section>
        )}

        <Section title="Parents">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Nom de la mère" field="parentMotherName" placeholder="Bella" value={form.parentMotherName} onChange={set("parentMotherName")} />
            <Field label="Nom du père" field="parentFatherName" placeholder="Max" value={form.parentFatherName} onChange={set("parentFatherName")} />
          </div>
        </Section>

        <Section title="Pedigree & Santé">
          <Field label="Pedigree (URL)" field="pedigreeDocUrl" placeholder="https://..." value={form.pedigreeDocUrl} onChange={set("pedigreeDocUrl")} />
        </Section>

        <Section title="Images">
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display:'none' }} id="images-input" />
          <label htmlFor="images-input"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'16px 20px', background:'var(--primary-bg)', border:'2px dashed var(--border-2)', borderRadius:12, cursor:'pointer', fontSize:14, color:'var(--text-2)', fontWeight:600, transition:'all 0.25s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.background='var(--bg-card2)'; e.currentTarget.style.color='var(--text)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.background='var(--primary-bg)'; e.currentTarget.style.color='var(--text-2)'; }}>
            📷 {previews.length + existingImages.length > 0 ? `${previews.length + existingImages.length} / 5 images` : 'Choisir des images'}
          </label>
        </Section>

        {(previews.length > 0 || existingImages.length > 0) && (
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:12 }}>Aperçu ({previews.length + existingImages.length})</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
              {[...existingImages, ...previews].map((img, index) => (
                <div key={img.id} style={{ position:'relative', borderRadius:12, overflow:'hidden', aspectRatio:'4/3' }}>
                  <img src={img.url} alt={`Aperçu ${index + 1}`} style={{ width:'100%', height:'100%', objectFit:'cover', border:'1px solid var(--border)' }} />
                  <button type="button" onClick={() => removeImage(img.id)}
                    style={{ position:'absolute', top:4, right:4, background:'rgba(0,0,0,0.8)', color:'#fff', border:'none', borderRadius:'50%', width: isMobile ? 32 : 24, height: isMobile ? 32 : 24, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize: isMobile ? 12 : 10 }}>
                    ✕
                  </button>
                  {index === 0 && <span style={{ position:'absolute', bottom:4, left:4, fontSize:9, fontWeight:800, background:'var(--primary)', color:'#fff', padding:'2px 6px', borderRadius:3 }}>Principale</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <Section title="Options">
          <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
            {[['featured','Perroquet mis en avant (★ Nouveau)'],['isActive','Actif (visible en catalogue)']].map(([f,l]) => (
              <label key={f} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', padding:'12px 16px', borderRadius:10, background:'var(--bg-card2)', border:'1px solid var(--border)' }}>
                <input type="checkbox" checked={Boolean(form[f])} onChange={set(f)} style={{ accentColor:'#C9762E', width:20, height:20 }} />
                <span style={{ fontSize:14, color:'var(--text-2)', fontWeight:600 }}>{l}</span>
              </label>
            ))}
          </div>
        </Section>

        <div style={{ display:'flex', gap:16, marginTop:8 }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize:15, padding:'18px 36px', borderRadius:10 }}>
            {saving ? 'Enregistrement...' : isEdit ? '✓ Mettre à jour' : '+ Créer le perroquet'}
          </button>
          <button type="button" onClick={() => navigate('/admin/parrots')} className="btn-ghost" style={{ fontSize:15, padding:'18px 36px', borderRadius:10 }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}