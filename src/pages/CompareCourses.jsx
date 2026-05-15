import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, CheckCircle, XCircle, Award, BookOpen, ArrowRight, X } from 'lucide-react';
import styles from './CompareCourses.module.css';

const ALL_COURSES = [
  { _id: '1', slug: 'react-nextjs-2024', title: 'Advanced React & Next.js', instructor: 'Rahul Sharma', category: 'Technology', level: 'Intermediate', price: 4999, discountPrice: 2499, rating: 4.9, reviewCount: 2100, enrollmentCount: 12000, duration: 42, certificate: true, liveClasses: true, emiAvailable: true, placementSupport: true },
  { _id: '2', slug: 'python-data-science', title: 'Python for Data Science & ML', instructor: 'Dr. Amit Joshi', category: 'Technology', level: 'Intermediate', price: 5499, discountPrice: 2799, rating: 4.9, reviewCount: 3200, enrollmentCount: 18000, duration: 56, certificate: true, liveClasses: true, emiAvailable: true, placementSupport: true },
  { _id: '3', slug: 'node-backend', title: 'Node.js Backend Development', instructor: 'Karthik Nair', category: 'Technology', level: 'Intermediate', price: 4299, discountPrice: 2199, rating: 4.7, reviewCount: 1800, enrollmentCount: 9500, duration: 38, certificate: true, liveClasses: false, emiAvailable: true, placementSupport: false },
  { _id: '4', slug: 'aws-devops', title: 'AWS & DevOps Complete Bootcamp', instructor: 'Arjun Menon', category: 'Technology', level: 'Advanced', price: 6999, discountPrice: 3499, rating: 4.8, reviewCount: 980, enrollmentCount: 6700, duration: 60, certificate: true, liveClasses: true, emiAvailable: true, placementSupport: true },
];

const FEATURES = [
  { key: 'rating', label: 'Rating', format: (v) => <span style={{ color: '#f59e0b', fontWeight: 700 }}>{v?.toFixed(1)} ⭐</span> },
  { key: 'price', label: 'Price', format: (v, c) => (
    <div>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>₹{c.discountPrice?.toLocaleString()}</span>
      {c.discountPrice && <span style={{ fontSize: 12, color: '#64748b', textDecoration: 'line-through', marginLeft: 6 }}>₹{v?.toLocaleString()}</span>}
    </div>
  )},
  { key: 'duration', label: 'Duration', format: (v) => `${v} hours` },
  { key: 'level', label: 'Level', format: (v) => v },
  { key: 'enrollmentCount', label: 'Students', format: (v) => v?.toLocaleString() },
  { key: 'certificate', label: 'Certificate', bool: true },
  { key: 'liveClasses', label: 'Live Classes', bool: true },
  { key: 'emiAvailable', label: 'EMI Available', bool: true },
  { key: 'placementSupport', label: 'Placement Support', bool: true },
];

export default function CompareCourses() {
  const [selected, setSelected] = useState([ALL_COURSES[0], ALL_COURSES[1]]);

  const addCourse = (course) => {
    if (selected.length >= 4) return;
    if (!selected.find(c => c._id === course._id)) setSelected([...selected, course]);
  };

  const removeCourse = (id) => setSelected(selected.filter(c => c._id !== id));

  const available = ALL_COURSES.filter(c => !selected.find(s => s._id === c._id));

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className="section-label">Side by side</div>
            <h1 className={styles.pageTitle}>Compare <span>Courses</span></h1>
            <p className={styles.pageSubtitle}>Compare up to 4 courses to find the best fit for your goals.</p>
          </div>
        </div>

        {/* Add courses */}
        {available.length > 0 && selected.length < 4 && (
          <div className={styles.addBar}>
            <span className={styles.addLabel}>Add to compare:</span>
            <div className={styles.addList}>
              {available.map(c => (
                <button key={c._id} className={styles.addBtn} onClick={() => addCourse(c)}>
                  + {c.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Compare table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.featureCol}>Feature</th>
                {selected.map(course => (
                  <th key={course._id} className={styles.courseCol}>
                    <div className={styles.courseHeader}>
                      <button className={styles.removeBtn} onClick={() => removeCourse(course._id)} title="Remove">
                        <X size={13} />
                      </button>
                      <div className={styles.courseHeaderCat}>{course.category}</div>
                      <div className={styles.courseHeaderTitle}>{course.title}</div>
                      <div className={styles.courseHeaderInst}>by {course.instructor}</div>
                      <div className={styles.courseHeaderRating}>
                        <Star size={13} fill="#f59e0b" stroke="none" />
                        {course.rating?.toFixed(1)} ({course.reviewCount?.toLocaleString()})
                      </div>
                      <Link to={`/course-details/${course.slug}`} className={styles.viewBtn}>
                        View Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </th>
                ))}
                {selected.length < 4 && (
                  <th className={styles.courseCol}>
                    <div className={styles.addSlot}>
                      <div className={styles.addSlotIcon}>+</div>
                      <div className={styles.addSlotText}>Add Course</div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(feat => (
                <tr key={feat.key} className={styles.row}>
                  <td className={styles.featureCell}>{feat.label}</td>
                  {selected.map(course => (
                    <td key={course._id} className={styles.valueCell}>
                      {feat.bool ? (
                        course[feat.key]
                          ? <CheckCircle size={18} className={styles.yes} />
                          : <XCircle size={18} className={styles.no} />
                      ) : (
                        feat.format(course[feat.key], course)
                      )}
                    </td>
                  ))}
                  {selected.length < 4 && <td className={styles.valueCell} />}
                </tr>
              ))}
              <tr>
                <td className={styles.featureCell} />
                {selected.map(course => (
                  <td key={course._id} className={styles.valueCell}>
                    <Link to={`/course-details/${course.slug}`} className={styles.enrollBtn}>
                      Enroll Now <ArrowRight size={14} />
                    </Link>
                  </td>
                ))}
                {selected.length < 4 && <td className={styles.valueCell} />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
