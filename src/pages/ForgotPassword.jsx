import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email is required.');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('OTP sent to your email!');
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) document.getElementById(`fotp-${idx+1}`)?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`fotp-${idx-1}`)?.focus();
  };

  const handleReset = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter all 6 digits.');
    if (!newPassword || newPassword.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp: code, newPassword });
      if (res.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>⬡ Edu<span>Nexus</span></Link>
          <h2 className={styles.brandTitle}>Reset your password.</h2>
          <p className={styles.brandText}>We'll send a 6-digit OTP to your registered email address to verify your identity.</p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>

          {step === 1 && (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Forgot Password</h1>
                <p className={styles.formSubtitle}>Enter your email to receive a reset OTP</p>
              </div>
              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input type="email" autoComplete="email" name="email" className={styles.input} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.btnLoader} /> : <>Send OTP <ArrowRight size={16} /></>}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link to="/login" style={{ color: '#f59e0b', fontSize: 14 }}>← Back to Login</Link>
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Lock size={28} color="#f59e0b" />
              </div>
              <h1 className={styles.formTitle}>Reset Password</h1>
              <p style={{ color: '#8899aa', marginBottom: 28, lineHeight: 1.6 }}>
                Enter the 6-digit OTP sent to <strong style={{ color: '#f59e0b' }}>{email}</strong>
              </p>

              {/* OTP boxes */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`fotp-${idx}`}
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
                      borderRadius: 10, color: '#fff', outline: 'none', transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>

              {/* New password */}
              <div className={styles.field} style={{ textAlign: 'left', marginBottom: 20 }}>
                <label className={styles.label}>New Password</label>
                <div className={styles.inputWrap}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button onClick={handleReset} disabled={loading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Resetting...' : <><CheckCircle size={16} /> Reset Password</>}
              </button>

              <button onClick={() => { handleSendOtp({ preventDefault: () => {} }); }} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
