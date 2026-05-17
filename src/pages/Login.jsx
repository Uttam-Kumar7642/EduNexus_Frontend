import EmailInput from '../components/EmailInput';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import styles from './Auth.module.css';

export default function Login() {
  const [tab, setTab] = useState('login'); // 'login' | 'admin-register'
  const [form, setForm] = useState({ email: '', password: '', name: '', adminSecret: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.adminSecret) {
      return toast.error('All fields required');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register-admin', {
        name: form.name,
        email: form.email,
        password: form.password,
        adminSecret: form.adminSecret,
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Admin account created! Redirecting...');
      navigate('/admin-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>⬡ Edu<span>Nexus</span></Link>
          <h2 className={styles.brandTitle}>Welcome back, learner.</h2>
          <p className={styles.brandText}>Continue your journey to mastery.</p>
          <div className={styles.featureList}>
            {['Access 1,200+ world-class courses', 'Track progress with AI insights', 'Earn industry-recognized certificates', 'Learn at your own pace'].map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: '#0d1f3c', borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 }}>
            <button
              onClick={() => setTab('login')}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: tab === 'login' ? '#1a3a7a' : 'transparent',
                color: tab === 'login' ? '#fff' : '#8899aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s'
              }}
            >
              <User size={15} /> Student / Login
            </button>
            <button
              onClick={() => setTab('admin-register')}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: tab === 'admin-register' ? '#1a3a7a' : 'transparent',
                color: tab === 'admin-register' ? '#f59e0b' : '#8899aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s'
              }}
            >
              <Shield size={15} /> Admin Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Sign in</h1>
                <p className={styles.formSubtitle}>Don't have an account? <Link to="/register" className={styles.authLink}>Create one free</Link></p>
              </div>
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <EmailInput className={styles.input} placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <label className={styles.label}></label> */}
                <Link to="/forgot-password" style={{ fontSize: 13, color: '#f59e0b', textDecoration: 'none' }}> Forgot password?</Link>
              </div>
                  </div>
                  <div className={styles.inputWrap}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input type={show ? 'text' : 'password'} className={styles.input} placeholder="Enter your password" value={form.password} onChange={set('password')} autoComplete="current-password" />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShow(!show)}>
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.btnLoader} /> : <>Sign in <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ADMIN REGISTER FORM */}
          {tab === 'admin-register' && (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle} style={{ color: '#f59e0b' }}>Admin Register</h1>
                <p className={styles.formSubtitle}>Create an admin account using the secret key</p>
              </div>
              <form onSubmit={handleAdminRegister} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.inputWrap}>
                    <User size={16} className={styles.inputIcon} />
                    <input type="text" className={styles.input} placeholder="Admin Name" value={form.name} onChange={set('name')} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input type="email" autoComplete="email" name="email" className={styles.input} placeholder="admin@example.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.inputWrap}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input type={show ? 'text' : 'password'} className={styles.input} placeholder="Create password" value={form.password} onChange={set('password')} />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShow(!show)}>
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Admin Secret Key</label>
                  <div className={styles.inputWrap}>
                    <Shield size={16} className={styles.inputIcon} />
                    <input type="password" className={styles.input} placeholder="Enter admin secret key" value={form.adminSecret} onChange={set('adminSecret')} />
                  </div>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  {loading ? <span className={styles.btnLoader} /> : <>Create Admin Account <Shield size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
