import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, TrendingUp, Award, Users, BookOpen, Code2, Brush, BarChart2, DollarSign, ChevronRight, Zap } from 'lucide-react';
import api from '../utils/api';
import CourseCard from '../components/common/CourseCard';
import styles from './Home.module.css';

const STATS = [
  { value: '50K+', label: 'Active Students', icon: <Users size={20} /> },
  { value: '1,200+', label: 'Courses Available', icon: <BookOpen size={20} /> },
  { value: '98%', label: 'Satisfaction Rate', icon: <Star size={20} /> },
  { value: '₹42Cr+', label: 'Scholarships Given', icon: <Award size={20} /> },
];

const CATEGORIES = [
  { name: 'Technology', icon: <Code2 size={24} />, color: '#2dd4bf', courses: 120 },
  { name: 'Business', icon: <TrendingUp size={24} />, color: '#f59e0b', courses: 80 },
  { name: 'Design', icon: <Brush size={24} />, color: '#fb7185', courses: 60 },
  { name: 'Marketing', icon: <BarChart2 size={24} />, color: '#a78bfa', courses: 45 },
  { name: 'Finance', icon: <DollarSign size={24} />, color: '#34d399', courses: 35 },
  { name: 'Language', icon: <BookOpen size={24} />, color: '#38bdf8', courses: 50 },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Full Stack Developer at Razorpay', text: 'EduNexus helped me transition from a non-tech background to landing my first dev role in 6 months. The curriculum is world-class.', avatar: 'P', rating: 5 },
  { name: 'Rohit Verma', role: 'Product Manager at Swiggy', text: 'The business courses are incredibly practical. I applied what I learned in my PM interviews and got offers from 3 top startups.', avatar: 'R', rating: 5 },
  { name: 'Ananya Patel', role: 'UX Designer at Flipkart', text: 'Best design courses I\'ve found online. The instructors are actual industry practitioners, not just educators.', avatar: 'A', rating: 5 },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/featured')
      .then(res => setFeatured(res.data.courses || []))
      .catch(() => setFeatured(MOCK_COURSES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={`${styles.hero} mesh-bg`}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={`badge badge-amber ${styles.heroBadge}`}>
              <Zap size={12} /> AI-Powered Learning Platform
            </div>
            <h1 className={styles.heroTitle}>
              Learn Without<br />
              <span className={styles.heroAccent}>Limits.</span> Grow<br />
              Without Boundaries.
            </h1>
            <p className={styles.heroSubtitle}>
              Discover 1,200+ courses from India's top instructors. Track your progress, earn certificates, and land your dream career — all in one place.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/courses" className={styles.ctaPrimary}>
                Explore Courses <ArrowRight size={16} />
              </Link>
              <button className={styles.ctaSecondary}>
                <Play size={16} fill="currentColor" /> Watch Demo
              </button>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.avatarStack}>
                {['P','R','S','A','M'].map((l, i) => (
                  <div key={i} className={styles.miniAvatar} style={{ zIndex: 5-i, background: ['#f59e0b','#2dd4bf','#fb7185','#a78bfa','#34d399'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <span className={styles.trustText}>
                <strong>50,000+</strong> students already enrolled
              </span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.floatingCard} style={{ top: '10%', right: '8%', animationDelay: '0s' }}>
              <div className={styles.fcIcon}><BookOpen size={16} /></div>
              <div><div className={styles.fcLabel}>New Course</div><div className={styles.fcValue}>React Mastery 2024</div></div>
            </div>
            <div className={styles.floatingCard} style={{ top: '45%', right: '-2%', animationDelay: '0.5s' }}>
              <div className={styles.fcIcon} style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}><Award size={16} /></div>
              <div><div className={styles.fcLabel}>Certificate Earned</div><div className={styles.fcValue}>Priya S. just got certified</div></div>
            </div>
            <div className={styles.floatingCard} style={{ bottom: '15%', right: '10%', animationDelay: '1s' }}>
              <div className={styles.fcIcon} style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}><TrendingUp size={16} /></div>
              <div><div className={styles.fcLabel}>Progress</div><div className={styles.fcValue}>68% course completed</div></div>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardThumb} />
              <div className={styles.heroCardBody}>
                <div className={styles.hcCat}>Technology</div>
                <div className={styles.hcTitle}>Advanced React & Next.js</div>
                <div className={styles.hcMeta}>
                  <Star size={12} fill="#f59e0b" stroke="none" />
                  <span>4.9 (2.1k reviews)</span>
                </div>
                <div className={styles.hcPrice}>₹2,499</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <div className="section-label">What do you want to learn?</div>
              <h2 className="section-title">Browse by <span>Category</span></h2>
            </div>
            <Link to="/courses" className={styles.viewAll}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/courses?category=${cat.name}`} className={styles.catCard}>
                <div className={styles.catIcon} style={{ color: cat.color, background: `${cat.color}15` }}>
                  {cat.icon}
                </div>
                <div className={styles.catName}>{cat.name}</div>
                <div className={styles.catCount}>{cat.courses}+ courses</div>
                <div className={styles.catArrow} style={{ color: cat.color }}>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <div className="section-label">Handpicked for you</div>
              <h2 className="section-title">Featured <span>Courses</span></h2>
            </div>
            <Link to="/courses" className={styles.viewAll}>
              All courses <ChevronRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className={styles.courseGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 340, borderRadius: 16 }} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className={styles.courseGrid}>
              {featured.slice(0, 8).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className={styles.courseGrid}>
              {MOCK_COURSES.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <div className="section-label">Success Stories</div>
              <h2 className="section-title">What Our <span>Students Say</span></h2>
            </div>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{t.avatar}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaContent}>
              <div className="section-label">Start today</div>
              <h2 className={styles.ctaTitle}>Ready to Transform<br />Your Career?</h2>
              <p className={styles.ctaText}>Join 50,000+ learners. Get access to all courses, quizzes, certificates, and more.</p>
              <div className={styles.ctaBtns}>
                <Link to="/register" className={styles.ctaPrimary}>
                  Create Free Account <ArrowRight size={16} />
                </Link>
                <Link to="/courses" className={styles.ctaOutline}>
                  Browse Courses
                </Link>
              </div>
            </div>
            <div className={styles.ctaDecor}>
              <div className={styles.decor1} />
              <div className={styles.decor2} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Mock data for when backend is not connected
const MOCK_COURSES = [
  { _id: '1', slug: 'react-nextjs-2024', title: 'Advanced React & Next.js 2024', instructor: 'Rahul Sharma', category: 'Technology', level: 'Intermediate', price: 4999, discountPrice: 2499, rating: 4.9, reviewCount: 2100, enrollmentCount: 12000, duration: 42, certificate: true, thumbnail: 'https://picsum.photos/seed/react/400/220' },
  { _id: '2', slug: 'product-management', title: 'Product Management Bootcamp', instructor: 'Sneha Gupta', category: 'Business', level: 'Beginner', price: 5999, discountPrice: 2999, rating: 4.7, reviewCount: 890, enrollmentCount: 5400, duration: 28, certificate: true, thumbnail: 'https://picsum.photos/seed/pm/400/220' },
  { _id: '3', slug: 'figma-ui-ux', title: 'Figma UI/UX Design Masterclass', instructor: 'Ananya Patel', category: 'Design', level: 'Beginner', price: 3999, discountPrice: 1999, rating: 4.8, reviewCount: 1450, enrollmentCount: 8900, duration: 36, certificate: true, thumbnail: 'https://picsum.photos/seed/design/400/220' },
  { _id: '4', slug: 'digital-marketing', title: 'Digital Marketing & SEO Complete Guide', instructor: 'Vikram Singh', category: 'Marketing', level: 'Beginner', price: 3499, discountPrice: 1499, rating: 4.6, reviewCount: 670, enrollmentCount: 4200, duration: 24, certificate: true, thumbnail: 'https://picsum.photos/seed/mkt/400/220' },
  { _id: '5', slug: 'python-data-science', title: 'Python for Data Science & ML', instructor: 'Dr. Amit Joshi', category: 'Technology', level: 'Intermediate', price: 5499, discountPrice: 2799, rating: 4.9, reviewCount: 3200, enrollmentCount: 18000, duration: 56, certificate: true, thumbnail: 'https://picsum.photos/seed/python/400/220' },
  { _id: '6', slug: 'stock-market-trading', title: 'Stock Market & F&O Trading', instructor: 'CA Ravi Kumar', category: 'Finance', level: 'Beginner', price: 4499, discountPrice: 1999, rating: 4.5, reviewCount: 540, enrollmentCount: 3100, duration: 20, certificate: true, thumbnail: 'https://picsum.photos/seed/stock/400/220' },
  { _id: '7', slug: 'node-backend', title: 'Node.js Backend Development', instructor: 'Karthik Nair', category: 'Technology', level: 'Intermediate', price: 4299, discountPrice: 2199, rating: 4.7, reviewCount: 1800, enrollmentCount: 9500, duration: 38, certificate: true, thumbnail: 'https://picsum.photos/seed/node/400/220' },
  { _id: '8', slug: 'spoken-english', title: 'Fluent Spoken English in 30 Days', instructor: 'Sarah Matthews', category: 'Language', level: 'Beginner', price: 1999, discountPrice: 799, rating: 4.8, reviewCount: 4500, enrollmentCount: 32000, duration: 15, certificate: true, thumbnail: 'https://picsum.photos/seed/english/400/220' },
];
