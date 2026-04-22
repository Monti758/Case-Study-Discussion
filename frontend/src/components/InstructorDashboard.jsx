import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Archive, BookOpen, Users, Activity, CheckCircle, Search } from 'lucide-react';
import api from '../api';

export default function InstructorDashboard({ user }) {
  const [caseStudies, setCaseStudies] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = () => {
    api.get('/case-studies/').then(res => setCaseStudies(res.data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/case-studies/', {
        title, content, instructor_id: user.id
      });
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchCaseStudies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id, currentStatus) => {
    try {
      await api.patch(`/case-studies/${id}/archive`, { is_archived: !currentStatus });
      fetchCaseStudies();
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = caseStudies.filter(cs => !cs.is_archived).length;
  const archivedCount = caseStudies.length - activeCount;

  const filteredStudies = caseStudies.filter(cs => 
    cs.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cs.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <span className="badge badge-success mb-2" style={{ fontSize: '0.7rem' }}>INSTRUCTOR PORTAL</span>
          <h2 style={{ marginBottom: '0.2rem', fontSize: '2.5rem' }}>Welcome back, {user.name}</h2>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Manage your academic curriculum and mentor student performance.</p>
        </div>
        <div className="flex gap-4">
          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', marginBottom: 0, borderRadius: '20px', background: 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            <PlusCircle size={18} /> {showForm ? 'Cancel' : 'New Case Study'}
          </button>
        </div>
      </div>

      {/* New Stats Banner */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"><BookOpen size={24} /></div>
          <div className="stat-details">
            <h4>Total Case Studies</h4>
            <p>{caseStudies.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.2)' }}><CheckCircle size={24} /></div>
          <div className="stat-details">
            <h4>Active Scenarios</h4>
            <p>{activeCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.2)' }}><Archive size={24} /></div>
          <div className="stat-details">
            <h4>Archived</h4>
            <p>{archivedCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.2)' }}><Activity size={24} /></div>
          <div className="stat-details">
            <h4>Recent Activity</h4>
            <p>High</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="glass-panel animate-slide-up" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Create New Case Study</h3>
          </div>
          <form onSubmit={handleCreate}>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Marketing Strategy for Startup X" />
            
            <label>Scenario Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="6" required placeholder="Describe the business scenario..." />
            
            <div className="flex justify-between items-center mt-4">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>* Required fields</span>
              <button type="submit" className="btn">Publish Case Study</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {filteredStudies.map(cs => (
          <div key={cs.id} className="glass-panel" style={{ opacity: cs.is_archived ? 0.6 : 1, filter: cs.is_archived ? 'grayscale(0.5)' : 'none' }}>
            <div className="flex justify-between items-center mb-4">
              {cs.is_archived ? <span className="badge badge-warning">Archived</span> : <span className="badge badge-success">Active</span>}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>{cs.title}</h3>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {cs.content}
            </p>
            <div className="flex gap-4 mt-4">
              <Link to={`/case-study/${cs.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                <BookOpen size={16} /> View Details
              </Link>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleArchive(cs.id, cs.is_archived)}
                style={{ padding: '10px' }}
                title={cs.is_archived ? "Unarchive" : "Archive"}
              >
                <Archive size={16} color={cs.is_archived ? '#f59e0b' : 'var(--text-main)'} />
              </button>
            </div>
          </div>
        ))}
        {filteredStudies.length === 0 && !showForm && (
          <div className="glass-panel w-full" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <Search size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3>No Case Studies Found</h3>
            <p>{searchQuery ? `We couldn't find any results for "${searchQuery}".` : `You haven't created any case studies yet.`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
