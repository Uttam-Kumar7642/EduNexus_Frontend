import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>⬡</span>
              Edu<span className={styles.accent}>Nexus</span>
            </Link>
            <p className={styles.tagline}>
              AI-powered learning marketplace. Discover world-class courses, track your progress, and transform your career.
            </p>
            <div className={styles.socials}>
              {['𝕏', 'in', 'yt', 'gh'].map((s) => (
                <a key={s} href="#" className={styles.social}>{s}</a>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Platform</div>
            <div className={styles.links}>
              <Link to="/courses">Browse Courses</Link>
              <Link to="/compare-courses">Compare Courses</Link>
              <Link to="/register">Get Started</Link>
              <Link to="/login">Sign In</Link>
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Categories</div>
            <div className={styles.links}>
              {['Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Language'].map((c) => (
                <Link key={c} to={`/courses?category=${c}`}>{c}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Company</div>
            <div className={styles.links}>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2026 EduNexus. All rights reserved.</span>
          <span>Powered by <span className={styles.accent}>N!tt@m</span></span>
        </div>
      </div>
    </footer>
  );
}
