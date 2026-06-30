
import { Routes, Route, NavLink } from 'react-router-dom';
import { Home, Users, Calendar, BarChart2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import GroupManager from './pages/GroupManager';
import TimetableEditor from './pages/TimetableEditor';
import YearCompare from './pages/YearCompare';
import Footer from './components/Footer';

function App() {
  return (
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
  );
}

export default App;
