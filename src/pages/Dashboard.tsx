
import { useTimetable } from '../context/TimetableContext';
import { Sparkles, CalendarPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Dashboard = () => {
  const { academicYears, groups, setClassBlocks } = useTimetable();
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
      // Simulate parsing the file and populating blocks for assigned grades
      const assignedGroup = groups.find(g => g.name === '배정 대상');
      const assignedGrades = assignedGroup ? assignedGroup.memberGradeIds : [];

      if (assignedGrades.length > 0) {
        const newBlocks: any[] = [];
        const classCounts: Record<string, number> = {
          G1: 7, G2: 6, G3: 8, G4: 6, G5: 8, G6: 7
        };
        const subjects = ['국어', '수학', '사회', '과학', '영어', '체육', '음악', '미술', '실과', '도덕', '창체'];
        const teachers = ['홍길동', '김철수', '이영희', '박민수', '최지우', '정우성'];

        assignedGrades.forEach(gradeId => {
          const numClasses = classCounts[gradeId] || 5;
          for (let classNum = 1; classNum <= numClasses; classNum++) {
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((day, d_idx) => {
              // Randomize slightly for variety
              const subIdx1 = (classNum * 3 + d_idx) % subjects.length;
              const subIdx2 = (classNum * 2 + d_idx + 3) % subjects.length;
              const subIdx3 = (classNum * 5 + d_idx + 1) % subjects.length;
              
              // Morning block (2 hours)
              newBlocks.push({
                block_id: `CB_${gradeId}_${classNum}_${day}_1`,
                year_id: "2026",
                subject_id: subjects[subIdx1],
                teacher_id: teachers[(classNum + d_idx) % teachers.length],
                room_id: `본관 ${classNum}반`,
                group_id: gradeId,
                class_num: classNum,
                day_of_week: day,
                period_start: 1,
                duration: 2,
                isExternal: false,
              });
              
              // Afternoon block 1 (1 hour)
              newBlocks.push({
                block_id: `CB_${gradeId}_${classNum}_${day}_3`,
                year_id: "2026",
                subject_id: subjects[subIdx2],
                teacher_id: teachers[(classNum + d_idx + 1) % teachers.length],
                room_id: `특별실`,
                group_id: gradeId,
                class_num: classNum,
                day_of_week: day,
                period_start: 3,
                duration: 1,
                isExternal: d_idx % 2 === 0, // Some are external
              });
              
              // Afternoon block 2 (2 hours)
              newBlocks.push({
                block_id: `CB_${gradeId}_${classNum}_${day}_4`,
                year_id: "2026",
                subject_id: subjects[subIdx3],
                teacher_id: teachers[(classNum + d_idx + 2) % teachers.length],
                room_id: `본관 ${classNum}반`,
                group_id: gradeId,
                class_num: classNum,
                day_of_week: day,
                period_start: 4,
                duration: 2,
                isExternal: false,
              });
            });
          }
        });
        setClassBlocks(newBlocks);
      } else {
        alert('그룹 관리에서 배정 대상 학년을 먼저 설정해야 시간표가 생성됩니다.');
      }

      alert(`'${file.name}' 시간표 파일이 성공적으로 불러와졌습니다!`);
      navigate('/editor');
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
            <h2 style={{ margin: 0 }}>시간표 만들기</h2>
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
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn" style={{ flex: 1 }} onClick={handleUploadClick}>
              <Sparkles size={18} /> 시간표 불러오기
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/groups')}>
              <Users size={18} /> 시간표 배정하기
            </button>
          </div>
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
