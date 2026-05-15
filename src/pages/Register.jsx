import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, BookOpen, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import styles from './Auth.module.css';

const DEGREES = ['B.Tech','BCA','MCA','MBA','B.Sc','M.Sc','B.Com','M.Com','BA','MA','BBA','PhD','Diploma','Other'];
const YEARS = ['1st Year','2nd Year','3rd Year','4th Year','5th Year','Graduated'];

export default function Register() {
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', collegeName:'', yearOfStudy:'', degree:'' });
  const [otp, setOtp] = useState(['','','','','','']);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone, form.collegeName, form.yearOfStudy, form.degree);
      // Send OTP
      await api.post('/auth/send-otp', { email: form.email });
      toast.success('Account created! Check your email for OTP.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-${idx-1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter all 6 digits.');
    setOtpLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp: code });
      localStorage.setItem('token', res.data.token);
      toast.success('Email verified! Welcome to EduNexus 🎉');
      navigate('/student-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/send-otp', { email: form.email });
      toast.success('New OTP sent to your email!');
    } catch {
      toast.error('Failed to resend OTP.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>⬡ Edu<span>Nexus</span></Link>
          <h2 className={styles.brandTitle}>Start your learning journey.</h2>
          <p className={styles.brandText}>Join 50,000+ students mastering new skills every day.</p>
          <div className={styles.featureList}>
            {['Access 1,200+ world-class courses','Track progress with AI insights','Earn industry-recognized certificates','Learn at your own pace'].map(f => (
              <div key={f} className={styles.feature}><span className={styles.featureDot} />{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>

          {/* Step 1 — Register Form */}
          {step === 1 && (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Create account</h1>
                <p className={styles.formSubtitle}>Already have one? <Link to="/login" className={styles.authLink}>Sign in</Link></p>
              </div>
              <form onSubmit={handleRegister} className={styles.form}>
                {/* Name */}
                <div className={styles.field}>
                  <label className={styles.label}>Full Name *</label>
                  <div className={styles.inputWrap}>
                    <User size={16} className={styles.inputIcon} />
                    <input type="text" className={styles.input} placeholder="Your full name" value={form.name} onChange={set('name')} />
                  </div>
                </div>

                {/* Email */}
                <div className={styles.field}>
                  <label className={styles.label}>Email Address *</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input type="email" className={styles.input} placeholder="you@example.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>

                {/* Password */}
                <div className={styles.field}>
                  <label className={styles.label}>Password *</label>
                  <div className={styles.inputWrap}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input type={show ? 'text' : 'password'} className={styles.input} placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShow(!show)}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number</label>
                  <div className={styles.inputWrap}>
                    <Phone size={16} className={styles.inputIcon} />
                    <input type="tel" className={styles.input} placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>

                {/* College */}
                <div className={styles.field}>
                  <label className={styles.label}>College / University Name</label>
                  <div className={styles.inputWrap}>
                    <GraduationCap size={16} className={styles.inputIcon} />
                    <input type="text" className={styles.input} placeholder="e.g. IIT Delhi, VIT University" value={form.collegeName} onChange={set('collegeName')} />
                  </div>
                </div>

                {/* Degree + Year row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Degree / Course</label>
                    <select className={styles.input} value={form.degree} onChange={set('degree')} style={{ cursor: 'pointer' }}>
                      <option value="">Select degree</option>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Year of Study</label>
                    <select className={styles.input} value={form.yearOfStudy} onChange={set('yearOfStudy')} style={{ cursor: 'pointer' }}>
                      <option value="">Select year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.btnLoader} /> : <>Create Account <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* Step 2 — OTP Verification */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Mail size={28} color="#f59e0b" />
              </div>
              <h1 className={styles.formTitle}>Verify your email</h1>
              <p style={{ color: '#8899aa', marginBottom: 32, lineHeight: 1.6 }}>
                We sent a 6-digit OTP to <strong style={{ color: '#f59e0b' }}>{form.email}</strong>.<br />Enter it below to verify your account.
              </p>

              {/* OTP Input Boxes */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    style={{
                      width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                      background: digit ? 'rgba(245,158,11,0.15)' : '#061428',
                      border: `2px solid ${digit ? '#f59e0b' : '#1a3a7a'}`,
                      borderRadius: 10, color: '#fff', outline: 'none',
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                  />
                ))}
              </div>

              <button onClick={handleVerifyOtp} disabled={otpLoading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: otpLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, opacity: otpLoading ? 0.7 : 1 }}>
                {otpLoading ? 'Verifying...' : <><CheckCircle size={16} /> Verify OTP</>}
              </button>

              <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
                Didn't receive it? Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
