import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, MessageSquare, Briefcase, FileText, User as UserIcon, Calendar, Clock, Star } from 'lucide-react';
import api from '../api';

export default function CaseStudyDetail({ user }) {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [responseContent, setResponseContent] = useState('');
  const [feedbackMap, setFeedbackMap] = useState({}); // Stores new feedback being written
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const cs = await api.get(`/case-studies/${id}`);
      setCaseStudy(cs.data);
      const subs = await api.get(`/case-studies/${id}/submissions/`);
      
      // If user is student, only show their submission. If instructor, show all.
      if (user.role === 'student') {
        setSubmissions(subs.data.filter(s => s.student_id === user.id));
      } else {
        setSubmissions(subs.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate slight delay for premium feel
      setTimeout(async () => {
        await api.post('/submissions/', {
          content: responseContent,
          case_study_id: parseInt(id),
          student_id: user.id
        });
        setResponseContent('');
        setIsSubmitting(false);
        fetchData();
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (submissionId) => {
    try {
      await api.post(`/submissions/${submissionId}/feedback`, {
        feedback: feedbackMap[submissionId]
      });
      setFeedbackMap({ ...feedbackMap, [submissionId]: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!caseStudy) return (
    <div className="container flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="float-element">
        <Briefcase size={48} color="var(--primary)" style={{ opacity: 0.5 }} />
        <p className="mt-4" style={{ fontSize: '1.2rem' }}>Loading scenario...</p>
      </div>
    </div>
  );

  const hasSubmitted = submissions.length > 0;
  const wordCount = caseStudy.content.split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '99px' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        {caseStudy.is_archived && <span className="badge badge-warning">Archived</span>}
      </div>

      {/* Hero Banner for Case Study */}
      <div className="hero-banner" style={{ padding: '3rem', marginBottom: '2rem', borderRadius: '24px' }}>
        <div className="hero-content">
          <div className="flex items-center gap-4 mb-4">
            <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Briefcase size={28} color="#a5b4fc" />
            </div>
            <span style={{ color: '#a5b4fc', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Business Scenario</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fff 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {caseStudy.title}
          </h1>
          
          <div className="flex gap-6 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={16} /> <span style={{ fontSize: '0.9rem' }}>{new Date(caseStudy.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Clock size={16} /> <span style={{ fontSize: '0.9rem' }}>~{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Content */}
      <div className="glass-panel mb-8" style={{ padding: '3rem' }}>
        <h2 className="mb-6 flex items-center gap-3" style={{ fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <FileText size={24} color="var(--primary)" /> Scenario Details
        </h2>
        <div style={{ 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.9', 
          fontSize: '1.1rem',
          color: '#e2e8f0',
          letterSpacing: '0.01em'
        }}>
          {caseStudy.content}
        </div>
      </div>

      {/* ------------- STUDENT VIEW ------------- */}
      {user.role === 'student' && !hasSubmitted && !caseStudy.is_archived && (
        <div className="glass-panel" style={{ border: '1px solid rgba(99, 102, 241, 0.4)', background: 'linear-gradient(180deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
          <h3 className="flex items-center gap-3 mb-4" style={{ color: '#a5b4fc' }}>
            <Sparkles size={24} /> Submit Your Analysis
          </h3>
          <p className="mb-4">Carefully review the scenario above and provide your strategic analysis or solution.</p>
          <form onSubmit={handleResponseSubmit}>
            <textarea 
              rows="8" 
              placeholder="Start typing your response here..." 
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              required
              style={{ fontSize: '1.05rem', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)' }}
            />
            <div className="flex justify-end mt-4">
              <button type="submit" className="btn" disabled={isSubmitting} style={{ padding: '14px 32px' }}>
                {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Analysis</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {user.role === 'student' && hasSubmitted && (
         <div className="glass-panel" style={{ borderLeft: '4px solid var(--success)', padding: '3rem' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '50%' }}>
                <CheckCircle size={24} color="var(--success)" />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Analysis Submitted</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date(submissions[0].submitted_at).toLocaleString()}</span>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', margin: 0, fontSize: '1.05rem' }}>{submissions[0].content}</p>
            </div>
            
            <div className="mt-8 pt-8" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
              {submissions[0].feedback ? (
                 <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '2rem' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                        <Star size={20} color="white" />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Instructor Feedback</h4>
                    </div>
                    <p style={{ color: '#e2e8f0', marginBottom: 0, fontSize: '1.1rem', lineHeight: '1.7' }}>{submissions[0].feedback}</p>
                 </div>
              ) : (
                  <div className="flex items-center gap-3 p-4" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px' }}>
                    <Clock size={20} color="#fbbf24" />
                    <span style={{ color: '#fcd34d', fontWeight: '500' }}>Your analysis is currently being reviewed by an instructor. Feedback will appear here.</span>
                  </div>
              )}
            </div>
         </div>
      )}

      {/* ------------- INSTRUCTOR VIEW ------------- */}
      {user.role === 'instructor' && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-3 m-0">
              <Users size={28} color="var(--primary)" /> 
              Student Submissions
            </h2>
            <span className="badge badge-success">{submissions.length} Total</span>
          </div>
          
          {submissions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} className="float-element" />
              <h3>No Submissions Yet</h3>
              <p>Students have not yet submitted their analysis for this case study.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {submissions.map(sub => (
                <div key={sub.id} className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                  {sub.feedback && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--success)' }} />}
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'rgba(255,255,255,0.1)' }}>
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Student ID: #{sub.student_id}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(sub.submitted_at).toLocaleString()}</span>
                      </div>
                    </div>
                    {sub.feedback ? <span className="badge badge-success">Reviewed</span> : <span className="badge badge-warning pulse-badge">Needs Review</span>}
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', margin: 0 }}>{sub.content}</p>
                  </div>
                  
                  <div className="pt-4" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    {sub.feedback ? (
                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h4 style={{ color: '#34d399', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={16} /> Your Feedback:
                        </h4>
                        <p style={{ fontSize: '1rem', marginBottom: 0, color: '#e2e8f0' }}>{sub.feedback}</p>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageSquare size={18} color="var(--primary)" /> Write Feedback
                        </h4>
                        <textarea 
                          rows="4" 
                          placeholder="Provide constructive feedback for this student's analysis..." 
                          value={feedbackMap[sub.id] || ''}
                          onChange={(e) => setFeedbackMap({...feedbackMap, [sub.id]: e.target.value})}
                          style={{ fontSize: '0.95rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <div className="flex justify-end mt-3">
                          <button 
                            className="btn" 
                            onClick={() => handleFeedbackSubmit(sub.id)} 
                            disabled={!feedbackMap[sub.id]}
                          >
                            <Send size={16} /> Submit Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
