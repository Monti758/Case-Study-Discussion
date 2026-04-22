import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, BookOpen, Users, Shield, Zap, Lock, Mail, ArrowRight, UserPlus, Type } from 'lucide-react';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import CaseStudyDetail from './components/CaseStudyDetail';
import api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup State
  const [isSignup, setIsSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('student');
  
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = () => {
    api.get('/users/').then(res => setUsers(res.data));
  };

  useEffect(() => {
    // Attempt to seed data
    api.get('/seed').then(() => {
      fetchUsers();
    }).catch(err => console.error("API not reachable yet", err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    setTimeout(() => {
      setIsLoading(false);
      
      const lowerEmail = email.toLowerCase();
      let matchedUser = null;

      if (lowerEmail.includes('instructor')) {
        matchedUser = users.find(u => u.role === 'instructor');
      } else if (lowerEmail.includes('student')) {
        matchedUser = users.find(u => u.role === 'student');
      } else if (users.length > 0) {
        // Match by name if they typed a name instead of email
        matchedUser = users.find(u => u.name.toLowerCase() === lowerEmail.split('@')[0] || u.name.toLowerCase() === lowerEmail);
      }

      if (matchedUser) {
        setUser(matchedUser);
      } else {
        setAuthError('Invalid credentials. Hint: use instructor@example.com or student@example.com');
      }
    }, 800);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      // The backend only requires name and role.
      const response = await api.post('/users/', {
        name: signupName,
        role: signupRole
      });
      
      const newUser = response.data;
      
      // Refresh user list in background
      fetchUsers();
      
      // Simulate slight delay for premium feel
      setTimeout(() => {
        setIsLoading(false);
        setUser(newUser);
      }, 600);
      
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setAuthError('Failed to create account. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="login-layout w-full">
          {/* Left Side: Branding and Info */}
          <div className="login-left">
            <div className="badge badge-success mb-4" style={{ letterSpacing: '0.1em' }}>PLATFORM v2.0</div>
            <h1 className="mb-6 float-element">CaseStudy Platform</h1>
            <p style={{ fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Empowering the next generation of business leaders through immersive, real-world scenario analysis and collaborative expert feedback.
            </p>
            
            <ul className="feature-list">
              <li className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon"><BookOpen size={22} /></div>
                <div>
                  <strong>Deep-dive Scenarios</strong>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Analyze complex business cases with rich context.</p>
                </div>
              </li>
              <li className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon"><Users size={22} /></div>
                <div>
                  <strong>Peer Collaboration</strong>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Engage in meaningful discussions with fellow students.</p>
                </div>
              </li>
              <li className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon"><Zap size={22} /></div>
                <div>
                  <strong>Expert Feedback</strong>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Receive direct, actionable insights from industry leaders.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Side: Auth Form */}
          <div className="login-right">
            <div style={{ width: '100%', maxWidth: '380px' }}>
              
              {!isSignup ? (
                // --- SIGN IN FORM ---
                <>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Shield size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} className="float-element" />
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sign In</h2>
                    <p>Enter your credentials to access your account</p>
                  </div>

                  <form onSubmit={handleLogin} className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {authError && (
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', color: '#fca5a5', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {authError}
                      </div>
                    )}

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                      <label>Email Address or Username</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="e.g., instructor@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                      <div className="flex justify-between items-center mb-2">
                        <label style={{ marginBottom: 0 }}>Password</label>
                        <a href="#" style={{ fontSize: '0.85rem' }}>Forgot password?</a>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', padding: '12px', marginTop: '1rem', background: 'linear-gradient(90deg, var(--primary), #8b5cf6)', border: 'none' }} disabled={isLoading}>
                      {isLoading ? 'Authenticating...' : <><Lock size={18} /> Secure Sign In</>}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); setAuthError(''); }}>Create one now</a></p>
                  </div>
                </>
              ) : (
                // --- SIGN UP FORM ---
                <>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <UserPlus size={48} color="var(--success)" style={{ marginBottom: '1rem' }} className="float-element" />
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p>Join the platform today</p>
                  </div>

                  <form onSubmit={handleSignup} className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {authError && (
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', color: '#fca5a5', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {authError}
                      </div>
                    )}

                    <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
                      <label>Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <Type size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="e.g., John Doe" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                          style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
                      <label>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="email" 
                          placeholder="john@example.com" 
                          required
                          style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
                      <label>Password</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          required
                          style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Account Role</label>
                      <select 
                        value={signupRole} 
                        onChange={(e) => setSignupRole(e.target.value)}
                        style={{ appearance: 'none' }}
                      >
                        <option value="student">Student (Participant)</option>
                        <option value="instructor">Instructor (Manager)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #10b981, #059669)', border: 'none' }} disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0' }}>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); setAuthError(''); }}>Sign in</a></p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <nav className="nav-bar container">
          <div className="nav-brand">
            <div className="feature-icon" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
              <BookOpen size={20} />
            </div>
            CaseStudy Platform
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="user-avatar" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <UserIcon size={18} color="var(--primary)" />
               </div>
               <div className="flex flex-col">
                 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1' }}>Signed in as</span>
                 <strong style={{ color: 'white', fontSize: '0.95rem' }}>{user.name}</strong>
               </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setUser(null)} title="Sign out" style={{ padding: '10px 20px', borderRadius: '12px' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </nav>

        <main className="container animate-slide-up">
          <Routes>
            <Route path="/" element={user.role === 'instructor' ? <InstructorDashboard user={user} /> : <StudentDashboard user={user} />} />
            <Route path="/case-study/:id" element={<CaseStudyDetail user={user} />} />
          </Routes>
        </main>
        <footer className="container" style={{ marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            © 2026 CaseStudy Platform. All rights reserved. Built for professional excellence.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
