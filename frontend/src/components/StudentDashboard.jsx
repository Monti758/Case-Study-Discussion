import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Sparkles, Search } from 'lucide-react';
import api from '../api';

export default function StudentDashboard({ user }) {
  const [caseStudies, setCaseStudies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/case-studies/').then(res => setCaseStudies(res.data));
  }, []);

  const activeStudies = caseStudies.filter(cs => !cs.is_archived);
  
  const filteredStudies = activeStudies.filter(cs => 
    cs.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cs.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-slide-up">
      {/* Student Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content flex items-center gap-6">
          <div className="stat-icon" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '20px' }}>
            <Sparkles size={40} color="#c084fc" className="float-element" />
          </div>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome to Your Dashboard</h1>
            <p style={{ margin: 0, fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '600px' }}>
              Explore active business scenarios, analyze complex challenges, and submit your insights to receive expert feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 style={{ margin: 0 }}>Available Case Studies</h2>
          <span className="badge badge-success pulse-badge">{activeStudies.length} ACTIVE</span>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search scenarios by title or content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px', marginBottom: 0, borderRadius: '999px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      <div className="grid">
        {filteredStudies.map(cs => (
          <div key={cs.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="badge badge-success pulse-badge" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>Open for Submissions</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white', lineHeight: '1.3' }}>{cs.title}</h3>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', color: 'var(--text-muted)', flex: 1 }}>
              {cs.content}
            </p>
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
              <Link to={`/case-study/${cs.id}`} className="btn w-full flex justify-center items-center" style={{ width: '100%', fontSize: '1.05rem', padding: '14px' }}>
                <FileText size={18} style={{ marginRight: '10px' }} /> Analyze Scenario
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredStudies.length === 0 && (
        <div className="glass-panel animate-slide-up" style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)',
            border: '1px dashed rgba(255,255,255,0.2)',
            marginTop: '2rem'
          }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Search size={56} color="var(--primary)" style={{ opacity: 0.8 }} className="float-element" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No Scenarios Found</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
            {searchQuery 
              ? `We couldn't find any case studies matching "${searchQuery}". Try adjusting your search terms.` 
              : `Your instructors have not published any scenarios yet. Check back later!`}
          </p>
        </div>
      )}
    </div>
  );
}
