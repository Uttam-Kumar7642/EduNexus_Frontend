import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const discount = course.discountPrice && course.discountPrice < course.price;
  const savings = discount ? Math.round((1 - course.discountPrice / course.price) * 100) : 0;

  return (
    <Link to={`/course-details/${course.slug}`} className={styles.card}>
      <div className={styles.thumb}>
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/400/220`}
          alt={course.title}
          className={styles.img}
          loading="lazy"
        />
        <div className={styles.overlay} />
        {discount && <span className={styles.discountBadge}>-{savings}%</span>}
        <span className={`${styles.levelBadge} ${styles[course.level?.toLowerCase()]}`}>
          {course.level}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.category}>{course.category}</div>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.instructor}>by {course.instructor}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Star size={13} fill="#f59e0b" stroke="none" />
            <span className={styles.rating}>{course.rating?.toFixed(1) || '4.5'}</span>
            <span className={styles.reviews}>({course.reviewCount || 0})</span>
          </span>
          <span className={styles.metaItem}>
            <Users size={13} />
            {course.enrollmentCount?.toLocaleString() || 0}
          </span>
          <span className={styles.metaItem}>
            <Clock size={13} />
            {course.duration || 0}h
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.pricing}>
            {discount ? (
              <>
                <span className={styles.currentPrice}>₹{course.discountPrice?.toLocaleString()}</span>
                <span className={styles.originalPrice}>₹{course.price?.toLocaleString()}</span>
              </>
            ) : (
              <span className={styles.currentPrice}>
                {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
              </span>
            )}
          </div>
          {course.certificate && (
            <span className={styles.cert}>
              <BookOpen size={11} /> Certificate
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
