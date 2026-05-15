import { useState } from 'react';
import { X, BookOpen, DollarSign, Tag, Users, Clock, BarChart2, Globe, Award, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Web Development','Data Science','Design','Business','Marketing','Photography','Music','Health & Fitness','Finance','Language'];
const LEVELS = ['Beginner','Intermediate','Advanced','All Levels'];
const LANGUAGES = ['English','Hindi','Tamil','Telugu','Marathi','Bengali'];

export default function AddCourseModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '',
    category: '', subcategory: '', level: 'Beginner',
    language: 'English', price: '', originalPrice: '',
    thumbnail: '', previewVideo: '', instructorName: '',
    instructorBio: '', certificate: true, isFree: false,
    isPublished: true, isFeatured: false,
    whatYouLearn: [''],
    requirements: [''],
    tags: '',
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [field]: val }));
  };

  const setList = (field, idx, val) => {
    setForm(p => {
      const arr = [...p[field]];
      arr[idx] = val;
      return { ...p, [field]: arr };
    });
  };

  const addListItem = (field) => setForm(p => ({ ...p, [field]: [...p[field], ''] }));
  const removeListItem = (field, idx) => setForm(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.price) {
      return toast.error('Title, description, category and price are required.');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        whatYouLearn: form.whatYouLearn.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
      };
      await api.post('/courses', payload);
      toast.success('Course created successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px 16px', overflowY: 'auto'
    }}>
      <div style={{
        background: '#0d1f3c', border: '1px solid #1a3a7a',
        borderRadius: 16, width: '100%', maxWidth: 780,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)', marginBottom: 24
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #1a3a7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#1a3a7a,#2a5aa8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Add New Course</h2>
              <p style={{ color: '#8899aa', fontSize: 13, margin: 0 }}>Fill in all details to publish a course</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#1a3a7a', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8899aa' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Title */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Course Title *</Label>
              <Input placeholder="e.g. Complete React Developer Bootcamp 2024" value={form.title} onChange={set('title')} />
            </div>

            {/* Short Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Short Description</Label>
              <Input placeholder="One-line summary shown on course cards" value={form.shortDescription} onChange={set('shortDescription')} />
            </div>

            {/* Full Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Full Description *</Label>
              <textarea
                placeholder="Detailed course description..."
                value={form.description}
                onChange={set('description')}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
              />
            </div>

            {/* Category */}
            <div>
              <Label icon={<Tag size={13} />}>Category *</Label>
              <select value={form.category} onChange={set('category')} style={inputStyle}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <Label>Subcategory</Label>
              <Input placeholder="e.g. React, Node.js" value={form.subcategory} onChange={set('subcategory')} />
            </div>

            {/* Level */}
            <div>
              <Label icon={<BarChart2 size={13} />}>Level</Label>
              <select value={form.level} onChange={set('level')} style={inputStyle}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Language */}
            <div>
              <Label icon={<Globe size={13} />}>Language</Label>
              <select value={form.language} onChange={set('language')} style={inputStyle}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Price */}
            <div>
              <Label icon={<DollarSign size={13} />}>Price (₹) *</Label>
              <Input type="number" placeholder="e.g. 1999" value={form.price} onChange={set('price')} disabled={form.isFree} />
            </div>

            {/* Original Price */}
            <div>
              <Label>Original Price (₹) — for discount display</Label>
              <Input type="number" placeholder="e.g. 4999" value={form.originalPrice} onChange={set('originalPrice')} disabled={form.isFree} />
            </div>

            {/* Instructor Name */}
            <div>
              <Label icon={<Users size={13} />}>Instructor Name</Label>
              <Input placeholder="e.g. John Smith" value={form.instructorName} onChange={set('instructorName')} />
            </div>

            {/* Tags */}
            <div>
              <Label icon={<Tag size={13} />}>Tags (comma separated)</Label>
              <Input placeholder="react, javascript, frontend" value={form.tags} onChange={set('tags')} />
            </div>

            {/* Instructor Bio */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Instructor Bio</Label>
              <textarea placeholder="Brief bio about the instructor..." value={form.instructorBio} onChange={set('instructorBio')} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Thumbnail */}
            <div>
              <Label>Thumbnail URL</Label>
              <Input placeholder="https://..." value={form.thumbnail} onChange={set('thumbnail')} />
            </div>

            {/* Preview Video */}
            <div>
              <Label>Preview Video URL</Label>
              <Input placeholder="https://youtube.com/..." value={form.previewVideo} onChange={set('previewVideo')} />
            </div>

            {/* What You'll Learn */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>What Students Will Learn</Label>
              {form.whatYouLearn.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Input placeholder={`Learning outcome ${i + 1}`} value={item} onChange={e => setList('whatYouLearn', i, e.target.value)} style={{ flex: 1 }} />
                  {form.whatYouLearn.length > 1 && (
                    <button type="button" onClick={() => removeListItem('whatYouLearn', i)} style={removeBtn}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem('whatYouLearn')} style={addBtn}>
                <Plus size={14} /> Add Point
              </button>
            </div>

            {/* Requirements */}
            <div style={{ gridColumn: '1/-1' }}>
              <Label>Requirements / Prerequisites</Label>
              {form.requirements.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Input placeholder={`Requirement ${i + 1}`} value={item} onChange={e => setList('requirements', i, e.target.value)} style={{ flex: 1 }} />
                  {form.requirements.length > 1 && (
                    <button type="button" onClick={() => removeListItem('requirements', i)} style={removeBtn}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem('requirements')} style={addBtn}>
                <Plus size={14} /> Add Requirement
              </button>
            </div>

            {/* Toggles */}
            <div style={{ gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <Toggle label="Free Course" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked, price: e.target.checked ? '0' : p.price }))} />
              <Toggle label="Publish Immediately" checked={form.isPublished} onChange={set('isPublished')} />
              <Toggle label="Mark as Featured" checked={form.isFeatured} onChange={set('isFeatured')} />
              <Toggle label={<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Award size={13} /> Include Certificate</span>} checked={form.certificate} onChange={set('certificate')} />
            </div>

          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28, paddingTop: 24, borderTop: '1px solid #1a3a7a' }}>
            <button type="button" onClick={onClose} style={{ padding: '11px 24px', background: 'transparent', border: '1px solid #1a3a7a', borderRadius: 10, color: '#8899aa', cursor: 'pointer', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '11px 28px', background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              border: 'none', borderRadius: 10, color: '#000', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 15
            }}>
              {loading ? 'Creating...' : <><BookOpen size={16} /> Create Course</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helpers
const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#061428', border: '1px solid #1a3a7a',
  borderRadius: 8, color: '#fff', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'DM Sans, sans-serif'
};

function Label({ children, icon }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>
      {icon}{children}
    </label>
  );
}

function Input({ style: s, ...props }) {
  return <input style={{ ...inputStyle, ...s }} {...props} />;
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#ccd6f6', fontSize: 14, fontWeight: 500 }}>
      <div style={{ position: 'relative', width: 40, height: 22 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
        <div onClick={() => onChange({ target: { checked: !checked } })} style={{
          position: 'absolute', inset: 0, borderRadius: 11,
          background: checked ? '#f59e0b' : '#1a3a7a',
          cursor: 'pointer', transition: 'background 0.2s'
        }}>
          <div style={{
            position: 'absolute', top: 3, left: checked ? 21 : 3,
            width: 16, height: 16, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s'
          }} />
        </div>
      </div>
      {label}
    </label>
  );
}

const removeBtn = {
  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 8, width: 36, height: 38, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#ef4444', flexShrink: 0
};

const addBtn = {
  display: 'flex', alignItems: 'center', gap: 6,
  background: 'rgba(245,158,11,0.1)', border: '1px dashed rgba(245,158,11,0.4)',
  borderRadius: 8, padding: '7px 14px', color: '#f59e0b',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, marginTop: 4
};
