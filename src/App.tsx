
import { Routes, Route, NavLink } from 'react-router-dom';
import { Home, Users, Calendar, BarChart2, School } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import GroupManager from './pages/GroupManager';
import TimetableEditor from './pages/TimetableEditor';
import YearCompare from './pages/YearCompare';
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
              <nav className="sidebar glass-panel" style={{ borderRadius: '0 20px 20px 0', borderLeft: 'none' }}>
                <h1 style={{ alignItems: 'flex-start' }}>
                  <Calendar size={28} color="var(--primary-color)" style={{ marginTop: '4px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                    <span>시간표</span>
                    <span style={{ fontSize: '1.2rem' }}>배정 도우미</span>
                  </div>
                </h1>
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Home size={20} /> 대시보드
                </NavLink>
                <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Users size={20} /> 그룹 관리
                </NavLink>
                <NavLink to="/editor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Calendar size={20} /> 시간표 편집
                </NavLink>
                <NavLink to="/compare" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <BarChart2 size={20} /> 연도 비교
                </NavLink>

                {/* Teacher ID Card */}
                <div className="teacher-id-card">
                  <div className="teacher-id-icon">
                    <School size={28} color="white" />
                  </div>
                  <div className="teacher-id-info">
                    <span className="teacher-id-label">소속학교</span>
                    <span className="teacher-id-school">서울개원초등학교</span>
                    <span className="teacher-id-label">이름</span>
                    <span className="teacher-id-name">{user.displayName || '교사'}</span>
                  </div>
                  <button 
                    onClick={signOut}
                    style={{
                      marginTop: '10px',
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
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
                  <Route path="/compare" element={<YearCompare />} />
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
