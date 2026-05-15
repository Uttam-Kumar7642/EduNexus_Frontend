import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import styles from './Quiz.module.css';

const MOCK_QUIZ = {
  _id: 'q1', title: 'React Fundamentals Quiz', timeLimit: 10, passingScore: 70,
  questions: [
    { question: 'What is a React Hook?', options: ['A CSS utility', 'A function to use React state in functional components', 'A lifecycle method', 'A routing library'], correctAnswer: 1, explanation: 'Hooks let you use state and other React features in function components.' },
    { question: 'Which hook is used for side effects?', options: ['useState', 'useContext', 'useEffect', 'useReducer'], correctAnswer: 2, explanation: 'useEffect is designed for side effects like API calls, subscriptions, and DOM manipulation.' },
    { question: 'What does useState return?', options: ['Just the state value', 'Just the setter', 'A state value and a setter function', 'An object with methods'], correctAnswer: 2, explanation: 'useState returns an array: [currentState, setterFunction].' },
    { question: 'What is the Virtual DOM?', options: ['A real browser DOM', 'A lightweight copy of the real DOM', 'A CSS framework', 'A testing tool'], correctAnswer: 1, explanation: 'React maintains a virtual representation of the UI, using it to batch and optimize DOM updates.' },
    { question: 'Which method triggers a re-render?', options: ['render()', 'setState()', 'componentDidMount()', 'constructor()'], correctAnswer: 1, explanation: 'Calling setState (or the setter from useState) schedules a re-render with the new state.' },
  ],
};

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then(res => { setQuiz(res.data.quiz); setTimeLeft(res.data.quiz.timeLimit * 60); })
      .catch(() => { setQuiz(MOCK_QUIZ); setTimeLeft(MOCK_QUIZ.timeLimit * 60); })
      .finally(() => setLoading(false));
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (!quiz || submitted || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(id); handleSubmit(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [quiz, submitted]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    const finalAnswers = [...answers];
    if (selected !== null) finalAnswers[current] = selected;

    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers: finalAnswers });
      setResult(res.data);
    } catch {
      // Calc locally
      let correct = 0;
      MOCK_QUIZ.questions.forEach((q, i) => { if (q.correctAnswer === finalAnswers[i]) correct++; });
      const score = Math.round((correct / MOCK_QUIZ.questions.length) * 100);
      setResult({ score, passed: score >= MOCK_QUIZ.passingScore, correct, total: MOCK_QUIZ.questions.length });
    }
  }, [submitted, answers, current, selected, quizId]);

  const handleSelect = (idx) => { if (!submitted) setSelected(idx); };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);
    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <div style={{ paddingTop: 160, textAlign: 'center' }}><div className="spinner" /></div>;
  if (!quiz) return null;

  const q = quiz.questions[current];
  const progress = ((current) / quiz.questions.length) * 100;

  if (result) {
    return (
      <div className={styles.page}>
        <div className={styles.resultWrap}>
          <div className={styles.resultCard}>
            <div className={`${styles.resultIcon} ${result.passed ? styles.pass : styles.fail}`}>
              {result.passed ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>
            <h1 className={styles.resultTitle}>{result.passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
            <p className={styles.resultMsg}>{result.passed ? 'You passed the quiz!' : 'You didn\'t pass this time, but you can try again.'}</p>
            <div className={styles.scoreBig}>{result.score}%</div>
            <p className={styles.scoreDetail}>{result.correct} out of {result.total} correct</p>
            <div className={styles.scoreBar}>
              <div className={styles.scoreBarFill} style={{ width: `${result.score}%`, background: result.passed ? '#22c55e' : '#ef4444' }} />
            </div>
            <p className={styles.passingNote}>Passing score: {quiz.passingScore}%</p>
            <div className={styles.resultActions}>
              {result.passed ? (
                <button className={styles.btnPrimary} onClick={() => navigate('/my-courses')}>
                  <CheckCircle size={16} /> Go to My Courses
                </button>
              ) : (
                <button className={styles.btnPrimary} onClick={() => { setResult(null); setCurrent(0); setAnswers([]); setSelected(null); setSubmitted(false); setTimeLeft(quiz.timeLimit * 60); }}>
                  <RotateCcw size={16} /> Try Again
                </button>
              )}
              <button className={styles.btnOutline} onClick={() => navigate(-1)}>Back to Course</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.quizWrap}>
        {/* Header */}
        <div className={styles.quizHeader}>
          <div>
            <h1 className={styles.quizTitle}>{quiz.title}</h1>
            <p className={styles.quizSub}>Question {current + 1} of {quiz.questions.length}</p>
          </div>
          <div className={`${styles.timer} ${timeLeft < 60 ? styles.timerRed : ''}`}>
            <Clock size={16} />
            {fmt(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className={styles.quizProgress}>
          <div className={styles.quizProgressFill} style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className={styles.questionCard}>
          <div className={styles.questionNum}>Question {current + 1}</div>
          <h2 className={styles.questionText}>{q.question}</h2>
          <div className={styles.options}>
            {q.options.map((opt, i) => {
              let cls = styles.option;
              if (selected === i) cls += ` ${styles.optionSelected}`;
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className={styles.questionFooter}>
            <div className={styles.dotNav}>
              {quiz.questions.map((_, i) => (
                <div key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''} ${answers[i] !== undefined ? styles.dotAnswered : ''}`} />
              ))}
            </div>
            <button
              className={styles.nextBtn}
              disabled={selected === null}
              onClick={handleNext}
            >
              {current + 1 === quiz.questions.length ? 'Submit' : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
