
import { Routes, Route, NavLink } from 'react-router-dom';
import { Home, Users, Calendar, School } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import GroupManager from './pages/GroupManager';
import TimetableEditor from './pages/TimetableEditor';
import Login from './pages/Login';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>로딩 중...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          user ? (
            <div className="app-container">
              <nav className="sidebar">

                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Home size={28} /> 시간표 만들기
                </NavLink>
                <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Users size={28} /> 그룹 관리
                </NavLink>
                <NavLink to="/editor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Calendar size={28} /> 시간표 편집/배정
                </NavLink>

                {/* Teacher ID Card */}
                <div className="teacher-id-card">
                  <div className="teacher-id-icon">
                    <School size={28} />
                  </div>
                  <div className="teacher-id-info">
                    <span className="teacher-id-label">이름</span>
                    <span className="teacher-id-name">{user.displayName || '교사'}</span>
                  </div>
                  <button 
                    onClick={signOut}
                    className="btn btn-secondary"
                    style={{ marginTop: 'var(--spacing-sm)' }}
                  >
                    로그아웃
                  </button>
                </div>
              </nav>
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/groups" element={<GroupManager />} />
                  <Route path="/editor" element={<TimetableEditor />} />
                </Routes>
                <Footer />
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
