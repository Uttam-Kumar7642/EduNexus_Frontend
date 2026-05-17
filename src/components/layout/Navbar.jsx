import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, BarChart2, Code2, Brush, TrendingUp, DollarSign, LogOut, User, LayoutDashboard, BookMarked } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const categories = [
  { icon: <Code2 size={18} />, name: 'Technology', color: '#2dd4bf', desc: '120+ courses' },
  { icon: <TrendingUp size={18} />, name: 'Business', color: '#f59e0b', desc: '80+ courses' },
  { icon: <Brush size={18} />, name: 'Design', color: '#fb7185', desc: '60+ courses' },
  { icon: <BarChart2 size={18} />, name: 'Marketing', color: '#a78bfa', desc: '45+ courses' },
  { icon: <DollarSign size={18} />, name: 'Finance', color: '#34d399', desc: '35+ courses' },
  { icon: <BookOpen size={18} />, name: 'Language', color: '#38bdf8', desc: '50+ courses' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const megaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <span>Edu<span className={styles.logoAccent}>Nexus</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className={styles.desktopLinks}>
            <div
              className={styles.megaTrigger}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
              ref={megaRef}
            >
              <span className={styles.navLink}>
                Explore <ChevronDown size={14} className={megaOpen ? styles.chevronOpen : ''} />
              </span>
              {megaOpen && (
                <div className={styles.megaMenu}>
                  <div className={styles.megaHeader}>
                    <span>Browse by Category</span>
                    <Link to="/courses" className={styles.megaViewAll}>View all courses →</Link>
                  </div>
                  <div className={styles.megaGrid}>
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/courses?category=${cat.name}`}
                        className={styles.megaItem}
                      >
                        <span className={styles.megaIcon} style={{ color: cat.color, background: `${cat.color}15` }}>
                          {cat.icon}
                        </span>
                        <div>
                          <div className={styles.megaItemName}>{cat.name}</div>
                          <div className={styles.megaItemDesc}>{cat.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/courses" className={styles.navLink}>Courses</Link>
              <Link to="/colleges" className={styles.navLink}>Colleges</Link>

            <Link to="/compare-courses"  className={styles.navLink}>Compare</Link>
          </div>

          {/* Right actions */}
          <div className={styles.actions}>
            {user ? (
              <div className={styles.profileMenu}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className={styles.avatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownName}>{user.name}</div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/student-dashboard" className={styles.dropdownItem}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/my-courses" className={styles.dropdownItem}>
                      <BookMarked size={15} /> My Courses
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" className={styles.dropdownItem}>
                        <BarChart2 size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className={styles.dropdownDivider} />
                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.dropdownLogout}`}>
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={styles.btnGhost}>Log in</Link>
                <Link to="/register" className={styles.btnPrimary}>Get Started</Link>
              </>
            )}

            <button className={styles.mobileToggle} onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu}>
          <Link to="/courses" className={styles.mobileLink}>Courses</Link>
          <Link to="/compare-courses"  className={styles.mobileLink}>Compare Courses</Link>
          <div className={styles.mobileCats}>
            {categories.map((cat) => (
              <Link key={cat.name} to={`/courses?category=${cat.name}`} className={styles.mobileCat}>
                <span style={{ color: cat.color }}>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
          {!user ? (
            <div className={styles.mobileActions}>
              <Link to="/login" className={styles.btnGhost} style={{ flex: 1, textAlign: 'center' }}>Log in</Link>
              <Link to="/register" className={styles.btnPrimary} style={{ flex: 1, textAlign: 'center' }}>Get Started</Link>
            </div>
          ) : (
            <div className={styles.mobileActions}>
              <Link to="/student-dashboard" className={styles.btnGhost} style={{ flex: 1, textAlign: 'center' }}>Dashboard</Link>
              <button onClick={handleLogout} className={styles.btnPrimary} style={{ flex: 1 }}>Log out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
