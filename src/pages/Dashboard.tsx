
import { useTimetable } from '../context/TimetableContext';
import { Sparkles, CalendarPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Dashboard = () => {
  const { academicYears, groups } = useTimetable();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`'${file.name}' 파일이 성공적으로 업로드되었습니다. (MVP 기능)`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">안녕하세요, 선생님! 👋</h1>
      <p className="page-subtitle">시간표 생성 도우미와 함께 편리하게 시간표를 관리하세요.</p>

      <div className="dashboard-grid">
        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <CalendarPlus size={24} color="var(--primary-color)" />
            <h2 style={{ margin: 0 }}>현재 학사 연도</h2>
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-color)' }}><strong>{academicYears[0].label}</strong></p>
          <p>{academicYears[0].startDate} ~ {academicYears[0].endDate}</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".xlsx,.xls,.csv,.json"
            onChange={handleFileChange} 
          />
          <button className="btn" style={{ marginTop: '20px' }} onClick={handleUploadClick}>
            <Sparkles size={18} /> 새 학사연도 만들기
          </button>
        </div>

        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Users size={24} color="var(--secondary-color)" />
            <h2 style={{ margin: 0 }}>학년 그룹 현황</h2>
          </div>
          <p>현재 <strong>{groups.length}개</strong>의 그룹이 생성되어 있어요!</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '15px', marginBottom: '20px' }}>
            {groups.map(g => (
              <span key={g.group_id} style={{ background: '#f1f2f6', color: '#2f3640', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                {g.name}
              </span>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/groups')}>
            그룹 관리하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
